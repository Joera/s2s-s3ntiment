function initScramble(el) {
  const cols = 24;
  const cellSize = 32;
  const gap = 4;

  el.style.display = 'grid';
  el.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  el.style.gap = `${gap}px`;
  el.style.width = `${cols * cellSize + (cols - 1) * gap}px`;

  const lines = el.innerText.trim().split(/\n/);
  const cells = [];

  lines.forEach(line => {
    const words = line.trim().split(/\s+/);
    const lineCells = [];

    words.forEach((word, i) => {
      const remaining = cols - (lineCells.length % cols);
      if (word.length > remaining) {
        for (let p = 0; p < remaining; p++) lineCells.push({ char: '', empty: true });
      }
      word.split('').forEach(c => lineCells.push({ char: c, empty: false }));
      if (i < words.length - 1) lineCells.push({ char: '', empty: true });
    });

    while (lineCells.length % cols !== 0) lineCells.push({ char: '', empty: true });
    cells.push(...lineCells);
  });

  el.innerHTML = cells
    .map(c => `<span${c.empty ? ' class="empty"' : ''}>${c.char}</span>`)
    .join('');

  const spans = [...el.querySelectorAll('span:not(.empty)')];
  const origChars = spans.map((s, i) => ({ i, char: s.textContent }));
  let cancelled = false;

  const delay = ms => new Promise(r => setTimeout(r, ms));

  async function doScramble() {

    // scramble all at once
    const shuffled = [...origChars].sort(() => Math.random() - 0.5);
    spans.forEach((s, i) => s.textContent = shuffled[i].char);

    await delay(2000);

    // restore in random order, one by one
    const restoreOrder = [...origChars].sort(() => Math.random() - 0.5);
    for (const { i, char } of restoreOrder) {
        if (cancelled) return;
        spans[i].textContent = char;
        await delay(80);
    }
    }

  async function run() {
    // 8 seconds readable
    await delay(8000);
    if (cancelled) return;

    await doScramble();

    if (!cancelled) run();
  }

  run();
  return () => { cancelled = true; };
}

document.querySelectorAll('.intermezzo h3').forEach(el => initScramble(el));