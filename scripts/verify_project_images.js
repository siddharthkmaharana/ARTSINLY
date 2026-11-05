const fs = require('fs');
const path = require('path');

// 1. Gather all files in public/images
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const publicDir = path.join(__dirname, '..', 'public');
const imagesDir = path.join(publicDir, 'images');
const diskFiles = getAllFiles(imagesDir).map(p => {
  return p.substring(publicDir.length).replace(/\\/g, '/');
});

console.log('=== DISK IMAGES FOUND IN public/images (' + diskFiles.length + ') ===');
diskFiles.forEach(f => console.log('  ' + f));

// 2. Scan src/lib/mock-data.ts for image references
const mockDataContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'mock-data.ts'), 'utf8');

// Check for any http/https image links
const externalMatches = mockDataContent.match(/https?:\/\/[^\s"',]+\.(jpg|jpeg|png|webp|avif|svg)/gi) || [];
console.log('\n=== EXTERNAL IMAGE LINKS IN mock-data.ts ===');
if (externalMatches.length === 0) {
  console.log('  NONE! (0 external image links found)');
} else {
  externalMatches.forEach(m => console.log('  FOUND:', m));
}

// Check all "/images/..." paths in mock-data.ts
const localMatches = (mockDataContent.match(/"\/images\/[^"]+"/g) || []).map(s => s.slice(1, -1));
const uniqueLocal = [...new Set(localMatches)];
console.log('\n=== LOCAL IMAGE PATHS REFERENCED IN mock-data.ts (' + uniqueLocal.length + ') ===');
let missing = 0;
uniqueLocal.forEach(p => {
  const full = path.join(publicDir, p);
  const exists = fs.existsSync(full);
  if (!exists) {
    console.log('  MISSING ON DISK:', p);
    missing++;
  } else {
    console.log('  OK:', p);
  }
});

console.log('\nTotal local image references missing:', missing);

// 3. Scan ALL files in src/
const srcDir = path.join(__dirname, '..', 'src');
const allSrcFiles = getAllFiles(srcDir).filter(f => /\.(tsx?|jsx?|json)$/.test(f));

console.log('\n=== SCANNING ALL ' + allSrcFiles.length + ' FILES IN src/ ===');
let totalExternal = 0;
let totalMissingLocal = 0;

for (const filePath of allSrcFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');

  // Check for external image links (excluding schema.org context or api routes)
  const extImgs = content.match(/https?:\/\/[^\s"',]+\.(jpg|jpeg|png|webp|avif|svg)/gi) || [];
  // Exclude favicon or schema.org
  const realExtImgs = extImgs.filter(m => !m.includes('favicon.ico') && !m.includes('schema.org'));
  if (realExtImgs.length > 0) {
    console.log('EXTERNAL IMAGE LINKS in ' + relPath + ':');
    realExtImgs.forEach(m => console.log('  ' + m));
    totalExternal += realExtImgs.length;
  }

  // Check for unsplash URLs
  const unsplashMatches = content.match(/https?:\/\/images\.unsplash\.com[^\s"',]*/gi) || [];
  if (unsplashMatches.length > 0) {
    console.log('UNSPLASH URLS in ' + relPath + ':');
    unsplashMatches.forEach(m => console.log('  ' + m));
    totalExternal += unsplashMatches.length;
  }

  // Check for local image paths
  const localImgs = (content.match(/"\/images\/[^"]+"/g) || []).map(s => s.slice(1, -1));
  for (const p of localImgs) {
    const full = path.join(publicDir, p);
    if (!fs.existsSync(full)) {
      console.log('MISSING LOCAL IMAGE in ' + relPath + ': ' + p);
      totalMissingLocal++;
    }
  }
}

console.log('\nTotal external image links across src/: ' + totalExternal);
console.log('Total broken local image paths across src/: ' + totalMissingLocal);
