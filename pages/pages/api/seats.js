export default async function handler(req, res) {
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'seating-data.json');

  try {
    if (req.method === 'GET') {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      res.status(200).json(data);
    } 
    else if (req.method === 'POST') {
      const newData = req.body;
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
