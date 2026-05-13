import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const dataPath = path.join(process.cwd(), 'seating-data.json');

    if (req.method === 'GET') {
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(rawData);
      res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      const newData = req.body;
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
      res.status(200).json({ success: true });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
