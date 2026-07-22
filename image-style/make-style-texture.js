// Generates a rich, painterly "Starry Night"-style swirl texture procedurally
// (no external images needed) to use as the style input for stylize.js.
const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 512, H = 512;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Deep night-sky gradient base
const bg = ctx.createLinearGradient(0, 0, 0, H);
bg.addColorStop(0, '#0b1e4d');
bg.addColorStop(0.5, '#173d7a');
bg.addColorStop(1, '#0a1630');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

function swirl(cx, cy, r, turns, hue, sat, light, strokeWidth) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let arm = 0; arm < 3; arm++) {
    ctx.beginPath();
    const armOffset = (arm / 3) * Math.PI * 2;
    for (let t = 0; t <= 1; t += 0.02) {
      const angle = armOffset + t * Math.PI * 2 * turns;
      const radius = r * t;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, 0.85)`;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

// Several overlapping swirls at different scales/hues, Van-Gogh-ish
swirl(W * 0.28, H * 0.32, 120, 2.2, 45, 90, 65, 7);
swirl(W * 0.28, H * 0.32, 70, 1.6, 200, 80, 55, 4);
swirl(W * 0.75, H * 0.68, 150, 2.6, 210, 85, 45, 8);
swirl(W * 0.75, H * 0.68, 90, 1.8, 40, 95, 60, 4);
swirl(W * 0.5, H * 0.85, 100, 2.0, 190, 70, 40, 6);

// Bright stars
for (let i = 0; i < 40; i++) {
  const x = Math.random() * W;
  const y = Math.random() * H * 0.7;
  const r = Math.random() * 2.5 + 0.5;
  ctx.beginPath();
  ctx.fillStyle = `hsla(50, 100%, 90%, ${0.5 + Math.random() * 0.5})`;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Flowing brush-stroke texture overlay (short curved dashes across the frame)
for (let i = 0; i < 260; i++) {
  const x = Math.random() * W;
  const y = Math.random() * H;
  const len = 14 + Math.random() * 22;
  const angle = Math.sin(x * 0.02) * 1.2 + Math.cos(y * 0.015) * 1.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
  const hue = 190 + Math.sin(x * 0.01 + y * 0.01) * 60;
  ctx.strokeStyle = `hsla(${hue}, 80%, ${55 + Math.random() * 20}%, 0.35)`;
  ctx.lineWidth = 2 + Math.random() * 2;
  ctx.lineCap = 'round';
  ctx.stroke();
}

fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/style-starrynight.png', canvas.toBuffer('image/png'));
console.log('Saved out/style-starrynight.png');
