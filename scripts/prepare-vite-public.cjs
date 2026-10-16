const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '../public');
const target = path.resolve(__dirname, '../public-vite');
fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
for (const name of fs.readdirSync(source)) {
  if (name !== 'index.html') fs.cpSync(path.join(source, name), path.join(target, name), { recursive: true });
}
