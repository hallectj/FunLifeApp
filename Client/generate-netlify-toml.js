const fs = require('fs');
const path = require('path');

const netlifyTomlContent = `[[redirects]]
  from = "/*"
  to = "/browser/index.html"
  status = 200`;

const filePath = path.join(__dirname, 'dist/fun_life_app', 'netlify.toml');

fs.writeFileSync(filePath, netlifyTomlContent);

console.log(`netlify.toml file generated and moved to ${filePath} successfully.`);