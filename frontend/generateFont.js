// generateFont.js
const fs = require('fs');
const path = require('path');
const { addTTFFont } = require('jspdf-font-generator');

const ttfPath = path.join(__dirname, 'DejaVuSans.ttf');
const font = fs.readFileSync(ttfPath);
const outputPath = path.join(__dirname, 'DejaVuSans-normal.js');

const result = addTTFFont(font, 'DejaVuSans', 'normal');
fs.writeFileSync(outputPath, result);

console.log('DejaVuSans-normal.js');
