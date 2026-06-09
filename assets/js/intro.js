 
 
 
 
 const el = document.querySelector("#intro h2")
    const cols = 12;
    const lines = el.innerText.trim().split(/\n/);
    const cells = [];

    lines.forEach(line => {
    const words = line.trim().split(/\s+/);
    const lineCells = [];

    words.forEach((word, i) => {
        // if word doesn't fit remaining space, pad first
        const remaining = cols - (lineCells.length % cols);
        if (word.length > remaining) {
        for (let p = 0; p < remaining; p++) lineCells.push(`<span></span>`);
        }

        word.split('').forEach(c => lineCells.push(`<span>${c}</span>`));
        if (i < words.length - 1) lineCells.push(`<span></span>`);
    });

    // pad line to full 12 cols
    while (lineCells.length % cols !== 0) lineCells.push(`<span></span>`);

    cells.push(...lineCells);
    });

    el.innerHTML = cells.join('');

    function animateSpans(el) {
    const allSpans = [...el.querySelectorAll('span')];
    const spans = allSpans.filter(s => s.textContent.trim() !== '');
    const teal = '#4C8175';
    const red = '#AA5A6C';
    let cancelled = false;

    const delay = ms => new Promise(r => setTimeout(r, ms));

    async function run() {
        // phase 1: random red infection — 2400ms per letter
        const order1 = [...spans.keys()].sort(() => Math.random() - 0.5);
        for (const i of order1) {
        if (cancelled) return;
        spans[i].style.background = red;
        await delay(2400);
        }

        await delay(1000);

        // phase 2: bubble sort teal back to front
        const values = spans.map(() => 1); // all red = 1, teal = 0
        for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values.length - i - 1; j++) {
            if (cancelled) return;
            if (values[j] > values[j + 1]) {
            [values[j], values[j + 1]] = [values[j + 1], values[j]];
            spans[j].style.background = teal;
            spans[j + 1].style.background = red;
            await delay(400);
            }
        }
        }

        await delay(1000);

        // phase 3: random teal restore — 2400ms per letter
        const order2 = [...spans.keys()].sort(() => Math.random() - 0.5);
        for (const i of order2) {
        if (cancelled) return;
        spans[i].style.background = teal;
        await delay(2400);
        }

        await delay(1000);
        if (!cancelled) run();
    }

  run();
  return () => { cancelled = true; };
}

const cancel = animateSpans(document.querySelector('#intro h2'));