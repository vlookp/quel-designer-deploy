const SUPABASE_URL = 'https://pwosfdnirfnlgrhfwaqc.supabase.co';
const NOTION_DB_ID = '0b4f1f62-dddd-4c4f-94bc-445327c7807e';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nom, email, note, commentaire, sb_token, sb_key } = req.body;
  if (!note) return res.status(400).json({ error: 'note required' });

  const errors = [];

  // 1. Save to Supabase
  try {
    const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        'apikey': sb_key,
        'Authorization': `Bearer ${sb_token || sb_key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ nom, email, note, commentaire })
    });
    if (!sbRes.ok) errors.push('supabase: ' + await sbRes.text());
  } catch (e) {
    errors.push('supabase: ' + e.message);
  }

  // 2. Create page in Notion
  const notionToken = process.env.NOTION_TOKEN;
  if (notionToken) {
    try {
      const notionRes = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DB_ID },
          properties: {
            'Nom': { title: [{ text: { content: nom || 'Anonyme' } }] },
            'Email': { email: email || null },
            'Note': { number: note },
            'Commentaire': { rich_text: commentaire ? [{ text: { content: commentaire } }] : [] }
          }
        })
      });
      if (!notionRes.ok) errors.push('notion: ' + await notionRes.text());
    } catch (e) {
      errors.push('notion: ' + e.message);
    }
  }

  if (errors.length) return res.status(207).json({ ok: false, errors });
  return res.status(200).json({ ok: true });
}
