let count = 0;

document.getElementById('clickMe').addEventListener('click', () => {
  count++;
  document.getElementById('clickCount').textContent = `Button clicked ${count} times.`;
});
