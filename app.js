const express = require('express');
const _ = require('lodash');
const marked = require('marked');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Vulnerable App for Snyk Demonstration is running.');
});

// Example route using an outdated version of marked
app.get('/markdown', (req, res) => {
  const html = marked(req.query.md || '# Hello World');
  res.send(html);
});

// Example route using an outdated version of lodash
app.post('/merge', (req, res) => {
  let dest = {};
  let payload = req.body || {};
  _.merge(dest, payload);
  res.json(dest);
});

// Example route using deprecated request module
app.get('/fetch', (req, res) => {
  const targetUrl = req.query.url || 'http://example.com';
  request(targetUrl, (error, response, body) => {
    if (error) {
      return res.status(500).send('Error fetching URL');
    }
    res.send(body);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
