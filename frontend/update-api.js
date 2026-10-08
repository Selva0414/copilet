import fs from 'fs';
import path from 'path';

const frontendDir = 'c:/Users/SELVA P/Documents/project/frontend/src';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        content = content.replace(/http:\/\/localhost:5000/g, 'https://copilet-3.onrender.com');
        fs.writeFileSync(fullPath, content);
        console.log('Updated API URL in', fullPath);
      }
    }
  }
}

replaceInDir(frontendDir);
console.log('Successfully updated all frontend files to point to https://copilet-3.onrender.com');
