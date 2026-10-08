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
        // Replace with dynamic API url
        // We will use import.meta.env.VITE_API_URL || 'http://localhost:5000'
        // But since it's often inside backticks or quotes, let's be careful.
        // Easiest is to define an API_URL at the top or replace the exact string.
        // Actually, replacing 'http://localhost:5000' with (import.meta.env.VITE_API_URL || 'http://localhost:5000') might break strings if it's already inside a string.
        // Let's just create a config file or replace string literals.
        // A safer way: replace "'http://localhost:5000" with "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}"
        content = content.replace(/'http:\/\/localhost:5000/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
        content = content.replace(/"http:\/\/localhost:5000/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

replaceInDir(frontendDir);
console.log('Done!');
