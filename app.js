const express = require('express');
const marked = require('marked');
const sanitizeHtml = require('sanitize-html');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Vulnerable App for Snyk Demonstration is running.');
});

// Fix XSS: use sanitize-html on the marked output
app.get('/markdown', async (req, res) => {
  const input = req.query.md || '# Hello World';
  // marked.parse is the modern API for marked
  const rawHtml = await marked.parse(input);
  const html = sanitizeHtml(rawHtml);
  res.send(html);
});

// Fix Prototype Pollution: avoid _.merge with user input, use Object.assign
app.post('/merge', (req, res) => {
  let dest = {};
  let payload = req.body || {};
  Object.assign(dest, payload);
  res.json(dest);
});

// Fix SSRF: validate URL, replace request with native fetch
app.get('/fetch', async (req, res) => {
  const targetUrl = req.query.url || 'http://example.com';
  try {
    const urlObj = new URL(targetUrl);
    if (urlObj.hostname !== 'example.com') {
      return res.status(400).send('Only example.com is allowed');
    }
    const response = await fetch(targetUrl);
    const body = await response.text();
    res.send(body);
  } catch (error) {
    res.status(500).send('Error fetching URL');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
