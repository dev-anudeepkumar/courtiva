// server.js (project root)
//
// Serves the static Courtiva site (index.html, style.css, script.js,
// media/) for hosts that run the project as a Node.js app, such as
// GoDaddy's Node hosting, which expects a package.json at the repo root.
//
// The HitPay payment backend in backend/ is a separate app and is NOT
// started here. Deploy it on its own (see SETUP.md, Part 2).

const path = require('path');
const express = require('express');

const app = express();
const ROOT = __dirname;

// Keep server-only files from being downloaded as static files.
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (
    p.startsWith('/backend') ||
    p.startsWith('/node_modules') ||
    p === '/server.js' ||
    p === '/package.json' ||
    p === '/package-lock.json'
  ) {
    return res.status(404).send('Not found');
  }
  next();
});

// dotfiles: 'ignore' keeps .git, .env, etc. hidden.
app.use(express.static(ROOT, { dotfiles: 'ignore', extensions: ['html'] }));

// Any unknown path falls back to the homepage.
app.use((req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Courtiva site listening on port ${PORT}`);
});
