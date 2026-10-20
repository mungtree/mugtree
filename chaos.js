/**
 * MUGTREE - Chaos
 * Interactive terminal, cursor-tracking eye, scattering title, inferno mode
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Inferno mode: konami code or typing "agni"
let infernoTimer = null;
function inferno(duration = 8000) {
    document.body.classList.add('inferno');
    window.embers?.burn(duration);
    clearTimeout(infernoTimer);
    infernoTimer = setTimeout(() => document.body.classList.remove('inferno'), duration);
}

function listenForSecrets() {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let keys = [];
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        keys = [...keys, e.key].slice(-konami.length);
        if (keys.join() === konami.join()) inferno();
        if (keys.slice(-4).join('').toLowerCase() === 'agni') inferno();
    });
}

// Title letters flee from the cursor
function scatterTitle() {
    const title = document.getElementById('title');
    if (!title || prefersReducedMotion) return;
    const letters = [...title.textContent.trim()].map(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.className = 'inline-block transition-transform duration-500 ease-out';
        return span;
    });
    title.replaceChildren(...letters);

    window.addEventListener('mousemove', (e) => {
        letters.forEach(span => {
            const r = span.getBoundingClientRect();
            const dx = r.left + r.width / 2 - e.clientX;
            const dy = r.top + r.height / 2 - e.clientY;
            const dist = Math.hypot(dx, dy);
            const push = Math.max(0, 1 - dist / 200) * 60;
            const rot = (dx / (dist || 1)) * push * 0.5;
            span.style.transform = push
                ? `translate(${(dx / dist) * push}px, ${(dy / dist) * push}px) rotate(${rot}deg)`
                : '';
        });
    });
}

// The eye watches you, and occasionally blinks
function watchingEye() {
    const iris = document.getElementById('iris');
    const pupil = document.getElementById('pupil');
    if (!iris || !pupil) return;

    window.addEventListener('mousemove', (e) => {
        const r = iris.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const angle = Math.atan2(dy, dx);
        const reach = Math.min(Math.hypot(dx, dy) / 10, r.width * 0.25);
        pupil.style.transform = `translate(${Math.cos(angle) * reach}px, ${Math.sin(angle) * reach}px)`;
    });

    if (prefersReducedMotion) return;
    const blink = () => {
        iris.classList.add('blink');
        setTimeout(() => iris.classList.remove('blink'), 150);
        setTimeout(blink, 2500 + Math.random() * 5000);
    };
    setTimeout(blink, 3000);
}

// Sun drifts with the cursor; click it three times for a surprise
function restlessSun() {
    const sun = document.getElementById('sun');
    if (!sun) return;
    if (!prefersReducedMotion) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            sun.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    let clicks = 0;
    let reset;
    sun.addEventListener('click', () => {
        clicks++;
        clearTimeout(reset);
        reset = setTimeout(() => clicks = 0, 800);
        if (clicks >= 3) {
            clicks = 0;
            document.body.classList.add('spin');
            setTimeout(() => document.body.classList.remove('spin'), 1200);
        }
    });
}

// A terminal that actually takes input
function terminal() {
    const input = document.getElementById('term-in');
    const out = document.getElementById('term-out');
    if (!input || !out) return;

    const history = [];
    let cursor = 0;

    const print = (text, cls = 'text-white/50') => {
        const line = document.createElement('p');
        line.className = cls;
        line.textContent = text;
        out.append(line);
        out.scrollTop = out.scrollHeight;
    };

    const commands = {
        help: () => print('help  whoami  github  discord  date  clear  sudo'),
        whoami: () => print('mugtree. 23.'),
        github: () => { print('opening github.com/mungtree...'); window.open('https://github.com/mungtree', '_blank'); },
        discord: () => print('meett'),
        date: () => print(new Date().toString()),
        clear: () => out.replaceChildren(),
        sudo: (args) => args.join(' ').includes('rm -rf')
            ? (print('deleting everything...', 'text-ember'), setTimeout(() => document.body.classList.add('void'), 600), setTimeout(() => document.body.classList.remove('void'), 3600))
            : print('nice try. attachment to power is still attachment.'),
        ls: () => print('karma.txt  dharma.txt  moksha/  .anxieties (empty)'),
        cat: (args) => print(args[0] === 'karma.txt' ? 'do the work. drop the outcome.' : `cat: ${args[0] ?? ''}: no such file`),
        exit: () => print('there is no exit. only the cycle.'),
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && history.length) {
            cursor = Math.max(0, cursor - 1);
            input.value = history[cursor];
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && history.length) {
            cursor = Math.min(history.length, cursor + 1);
            input.value = history[cursor] ?? '';
        }
        if (e.key !== 'Enter') return;

        const raw = input.value.trim();
        input.value = '';
        if (!raw) return;
        history.push(raw);
        cursor = history.length;

        print(`> ${raw}`, 'text-white/80');
        const [cmd, ...args] = raw.split(/\s+/);
        const run = commands[cmd.toLowerCase()];
        run ? run(args) : print(`${cmd}: command not found. try 'help'`);
    });
}

// The tab misses you
function clingyTab() {
    const original = document.title;
    document.addEventListener('visibilitychange', () => {
        document.title = document.hidden ? 'come back...' : original;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    listenForSecrets();
    scatterTitle();
    watchingEye();
    restlessSun();
    terminal();
    clingyTab();
    console.log('%c psst. try the konami code, or type "agni". ', 'color: #ff4500; font-family: monospace;');
});
