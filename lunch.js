const DEFAULT_OPTIONS = [
  'Idli', 'Dosa', 'Vada', 'Pongal', 'Uttapam',
  'Sambar Rice', 'Curd Rice', 'Lemon Rice', 'Bisi Bele Bath', 'Meals'
];

const COLORS = [
  '#4f46e5', '#ef4444', '#f59e0b', '#10b981',
  '#3b82f6', '#a855f7', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16'
];

const STORAGE_KEY = 'southIndianLunchOptions';

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('result');
const optionListEl = document.getElementById('optionList');
const addForm = document.getElementById('addForm');
const newOptionInput = document.getElementById('newOption');

let options = loadOptions();
let currentRotation = 0;
let spinning = false;

function loadOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch (e) {
    // ignore malformed storage
  }
  return [...DEFAULT_OPTIONS];
}

function saveOptions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
}

function drawWheel() {
  const size = canvas.width;
  const center = size / 2;
  const radius = center;
  const sliceAngle = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, size, size);

  options.forEach((option, i) => {
    const startAngle = i * sliceAngle - Math.PI / 2;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(option, radius - 12, 0);
    ctx.restore();
  });
}

function renderOptionList() {
  optionListEl.innerHTML = '';
  options.forEach((option, i) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = option;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.disabled = options.length <= 2;
    removeBtn.addEventListener('click', () => {
      options.splice(i, 1);
      saveOptions();
      drawWheel();
      renderOptionList();
    });
    li.appendChild(span);
    li.appendChild(removeBtn);
    optionListEl.appendChild(li);
  });
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = newOptionInput.value.trim();
  if (!value) return;
  options.push(value);
  saveOptions();
  drawWheel();
  renderOptionList();
  newOptionInput.value = '';
});

spinBtn.addEventListener('click', () => {
  if (spinning || options.length < 2) return;
  spinning = true;
  spinBtn.disabled = true;
  resultEl.textContent = '';

  const sliceAngle = 360 / options.length;
  const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full turns
  const randomOffset = Math.random() * 360;
  currentRotation += extraSpins * 360 + randomOffset;

  canvas.style.transform = `rotate(${currentRotation}deg)`;

  canvas.addEventListener('transitionend', function onEnd() {
    canvas.removeEventListener('transitionend', onEnd);
    const finalAngle = currentRotation % 360;
    const winningIndex = Math.floor(((360 - finalAngle) % 360) / sliceAngle);
    resultEl.textContent = `Lunch is: ${options[winningIndex]}!`;
    spinning = false;
    spinBtn.disabled = false;
  }, { once: true });
});

drawWheel();
renderOptionList();
