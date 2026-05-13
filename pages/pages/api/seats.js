export default async function handler(req, res) {
  const owner = 'kotchabhanjiwarangsinee-svg';
  const repo = 'classroom-seating';
  const path = 'seating-data.json';
  const token = process.env.GITHUB_TOKEN;

  try {
    if (req.method === 'GET') {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `token ${token}` } }
      );
      const data = await response.json();
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString());
      res.status(200).json(content);
    } 
    else if (req.method === 'POST') {
      const newData = req.body;
      
      const getResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `token ${token}` } }
      );
      const fileData = await getResponse.json();
      
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update seating`,
            content: Buffer.from(JSON.stringify(newData, null, 2)).toString('base64'),
            sha: fileData.sha,
          }),
        }
      );
      
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
