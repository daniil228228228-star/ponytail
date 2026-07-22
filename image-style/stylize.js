#!/usr/bin/env node
// Free, offline neural style transfer (AI image generation) using
// @magenta/image (arbitrary style transfer) + node-canvas, run entirely
// in Node.js — no browser, no API key, no paid connector.
//
// Usage:
//   node stylize.js <content.png> <style.png> <output.png>
//   node stylize.js --demo <output.png>   (uses procedurally generated
//                                          content/style images so you can
//                                          try it with no input files)

const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { loadImage, createCanvas } = require('canvas');

// @magenta/image's dist bundle checks `typeof window` / uses
// `document.createElement`, `Image`, and `ImageData` — none of which exist
// in plain Node. jsdom supplies `window`/`document`/`Image`; `ImageData`
// specifically needs to come from `canvas` (jsdom's own ImageData isn't
// wired to a real pixel buffer backend).
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLImageElement = dom.window.HTMLImageElement;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.HTMLVideoElement = dom.window.HTMLVideoElement;
global.Image = dom.window.Image;
global.ImageData = require('canvas').ImageData;

function toPngBuffer(canvas) {
  return Buffer.from(canvas.toDataURL('image/png').split(',')[1], 'base64');
}

function drawDemoPhoto(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#5aa0d8');
  grad.addColorStop(1, '#274b7a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.beginPath();
  ctx.fillStyle = '#ffdc78';
  ctx.arc(w * 0.7, h * 0.3, Math.min(w, h) * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2f6b3a';
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
}

function drawDemoStyle(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (w * y + x) * 4;
      const v = Math.sin((x + y) * 0.15) * 127 + 128;
      const v2 = Math.cos(x * 0.1 - y * 0.08) * 127 + 128;
      img.data[idx] = v;
      img.data[idx + 1] = v2 * 0.6;
      img.data[idx + 2] = 255 - v;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

async function canvasFromImageFile(filePath) {
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas;
}

async function main() {
  const args = process.argv.slice(2);
  let contentCanvas, styleCanvas, outPath;

  if (args[0] === '--demo') {
    outPath = args[1] || 'out/demo.png';
    const W = 256, H = 256;
    contentCanvas = createCanvas(W, H);
    drawDemoPhoto(contentCanvas.getContext('2d'), W, H);
    styleCanvas = createCanvas(W, H);
    drawDemoStyle(styleCanvas.getContext('2d'), W, H);
    console.log('Using procedurally generated demo content/style images.');
  } else {
    const [contentPath, stylePath, out] = args;
    if (!contentPath || !stylePath || !out) {
      console.error('Usage: node stylize.js <content.png> <style.png> <output.png>');
      console.error('       node stylize.js --demo <output.png>');
      process.exit(1);
    }
    outPath = out;
    contentCanvas = await canvasFromImageFile(contentPath);
    styleCanvas = await canvasFromImageFile(stylePath);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const mi = require('@magenta/image');
  const model = new mi.ArbitraryStyleTransferNetwork();
  console.log('Loading model (downloads ~180KB of weights on first run)...');
  await model.initialize();

  console.log('Running style transfer...');
  const imageData = await model.stylize(contentCanvas, styleCanvas);

  const outCanvas = createCanvas(imageData.width, imageData.height);
  outCanvas.getContext('2d').putImageData(imageData, 0, 0);
  fs.writeFileSync(outPath, toPngBuffer(outCanvas));
  console.log('Saved:', outPath);
}

main().catch((e) => {
  console.error('FATAL:', e.stack || e.message);
  process.exit(1);
});
