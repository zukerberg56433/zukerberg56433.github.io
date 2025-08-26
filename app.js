let hasStarted = false;
const output = document.getElementById('output');
const audioEl = document.getElementById('bg-audio');

document.body.addEventListener('click', () => {
  if (!hasStarted) {
    hasStarted = true;
    document.getElementById('click-to-enter').remove();
    output.style.display = 'flex';
    audioEl.play().catch(() => {});
    startDisplay();
  }
});

async function startDisplay() {
  let browserData = {};
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    browserData = {
      ip: data.ip || 'N/A',
      city: data.city || 'N/A',
      region: data.region || 'N/A',
      country: data.country_name || 'N/A',
      latitude: data.latitude || 'N/A',
      longitude: data.longitude || 'N/A',
      timezone: data.timezone || 'N/A',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`
    };
  } catch {
    browserData = {
      ip: 'N/A',
      city: 'N/A',
      region: 'N/A',
      country: 'N/A',
      latitude: 'N/A',
      longitude: 'N/A',
      timezone: 'N/A',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`
    };
  }

  const lines = () => [
    `IP Address: ${browserData.ip}`,
    `Device Info: ${browserData.platform}`,
    `Browser Info: ${browserData.userAgent}`,
    `Location: ${browserData.country}, ${browserData.region}, ${browserData.city}`,
    `Coordinates: ${browserData.latitude}, ${browserData.longitude}`,
    `Timezone: ${browserData.timezone}`,
    `Screen Size: ${browserData.screen}`,
    `Language: ${browserData.language}`
  ];

  const totalDuration = 2500;
  const fullText = lines().join('');
  const perCharDelay = totalDuration / fullText.length;

  for (const lineText of lines()) {
    const line = document.createElement('div');
    line.classList.add('line');
    output.appendChild(line);
    await typeFast(line, lineText, perCharDelay);
  }
}

async function typeFast(el, text, delay) {
  el.textContent = '';
  for (let i = 0; i <= text.length; i++) {
    el.textContent = text.slice(0, i);
    await sleep(delay);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const colors = ['#ffffff', '#ffb3ba', '#bae1ff', '#baffc9', '#ffffba', '#ffdfba', '#d7baff'];

document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.opacity -= 0.02;
    if (p.opacity <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.opacity})`;
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    parseInt(result[1], 16) + "," +
    parseInt(result[2], 16) + "," +
    parseInt(result[3], 16)
    : '255,255,255';
}

animateParticles();
