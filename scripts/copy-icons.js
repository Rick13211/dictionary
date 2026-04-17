import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const src = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\c94c76d2-3d4e-462b-9686-3e2253a50a1b\\dictionary_app_icon_1776431442742.png';

fs.copyFileSync(src, path.join(publicDir, 'icon-192x192.png'));
fs.copyFileSync(src, path.join(publicDir, 'icon-512x512.png'));

console.log('✅ Icons successfully copied to the public folder!');
