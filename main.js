/**
 * MUGTREE - Main Effects Controller
 * Heavy visual effects, glitch systems, and dark interactions
 */

// ============================================
// CUSTOM CURSOR
// ============================================
class DarkCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        this.cursorDot = document.getElementById('cursor-dot');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.5;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Expand on hover
        document.querySelectorAll('a, button, .interactive').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.width = '50px';
                this.cursor.style.height = '50px';
                this.cursor.style.borderColor = '#ff6b35';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.borderColor = '#ff4500';
            });
        });

        this.animate();
    }

    animate() {
        // Smooth follow
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        this.cursor.style.left = this.pos.x - 10 + 'px';
        this.cursor.style.top = this.pos.y - 10 + 'px';

        this.cursorDot.style.left = this.mouse.x - 2 + 'px';
        this.cursorDot.style.top = this.mouse.y - 2 + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#_______';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-ember/40">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// ============================================
// GLITCH BURST EFFECT
// ============================================
class GlitchBurst {
    constructor() {
        this.active = false;
        this.overlay = this.createOverlay();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    trigger() {
        if (this.active) return;
        this.active = true;

        // Screen shake
        document.body.style.animation = 'screen-shake 0.3s ease';

        // Color flash
        this.overlay.style.display = 'block';
        this.overlay.style.background = `rgba(255, 69, 0, ${Math.random() * 0.3})`;

        // Create glitch slices
        for (let i = 0; i < 5; i++) {
            const slice = document.createElement('div');
            const height = Math.random() * 100;
            const top = Math.random() * 100;
            slice.style.cssText = `
                position: absolute;
                left: 0;
                width: 100%;
                top: ${top}%;
                height: ${height}px;
                background: rgba(255, 69, 0, 0.1);
                transform: translateX(${(Math.random() - 0.5) * 50}px);
            `;
            this.overlay.appendChild(slice);
        }

        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.overlay.innerHTML = '';
            document.body.style.animation = '';
            this.active = false;
        }, 150);
    }
}

// Add screen shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes screen-shake {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        10% { transform: translate(-5px, -5px) rotate(-0.5deg); }
        20% { transform: translate(5px, -5px) rotate(0.5deg); }
        30% { transform: translate(-5px, 5px) rotate(-0.5deg); }
        40% { transform: translate(5px, 5px) rotate(0.5deg); }
        50% { transform: translate(-5px, -5px) rotate(-0.5deg); }
        60% { transform: translate(5px, -5px) rotate(0.5deg); }
        70% { transform: translate(-5px, 5px) rotate(-0.5deg); }
        80% { transform: translate(5px, 5px) rotate(0.5deg); }
        90% { transform: translate(-5px, -5px) rotate(-0.5deg); }
    }
`;
document.head.appendChild(shakeStyle);

// ============================================
// PARALLAX SYSTEM
// ============================================
class DarkParallax {
    constructor() {
        this.elements = [];
        this.sunOrb = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.scrollTicking = false;
        this.mouseTicking = false;
        this.init();
    }

    init() {
        // Cache sun orb element
        this.sunOrb = document.getElementById('sun-orb');

        // Note: Removed scroll parallax for sun to prevent teleporting
        // Sun now only responds to mouse movement

        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });

        // Start animation loop for smooth mouse parallax
        this.animateMouseParallax();
    }

    onScroll() {
        if (!this.scrollTicking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                this.elements.forEach(item => {
                    if (item.type === 'scroll') {
                        const yPos = scrolled * item.speed;
                        item.el.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
                    }
                });
                this.scrollTicking = false;
            });
            this.scrollTicking = true;
        }
    }

    onMouseMove(e) {
        // Just update target values - actual DOM update happens in animateMouseParallax
        this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    animateMouseParallax() {
        // Smooth interpolation toward target
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

        if (this.sunOrb) {
            this.sunOrb.style.transform = `translate(${this.mouseX * 10}px, ${this.mouseY * 10}px)`;
        }

        requestAnimationFrame(() => this.animateMouseParallax());
    }
}

// ============================================
// COUNTER ANIMATIONS
// ============================================
class DarkCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.current = 0;
    }

    start() {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Easing
            const eased = 1 - Math.pow(1 - progress, 3);
            this.current = Math.floor(eased * this.target);

            this.element.textContent = this.current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
}

// ============================================
// SCROLL REVEAL WITH GLITCH
// ============================================
class GlitchReveal {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // Trigger glitch on important elements
                    if (entry.target.classList.contains('glitch-on-reveal')) {
                        this.triggerGlitch(entry.target);
                    }
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'glitch-reveal 0.5s ease forwards';
    }
}

// ============================================
// TEMPERATURE FLUCTUATION
// ============================================
class TemperatureFlux {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.baseTemp = 127;
        this.fluctuate();
    }

    fluctuate() {
        setInterval(() => {
            const variation = Math.floor((Math.random() - 0.5) * 10);
            const newTemp = this.baseTemp + variation;
            this.element.textContent = newTemp;

            // Red flash on high temps
            if (newTemp > 130) {
                this.element.style.color = '#ff4500';
                this.element.style.textShadow = '0 0 10px #ff4500';
            } else {
                this.element.style.color = '';
                this.element.style.textShadow = '';
            }
        }, 2000);
    }
}

// ============================================
// AUDIO VISUALIZER BARS (visual only)
// ============================================
class FakeAudioBars {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.bars = [];
        this.init();
    }

    init() {
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 3px;
                background: linear-gradient(to top, #ff4500, #ff8c00);
                margin: 0 1px;
                border-radius: 1px;
            `;
            this.container.appendChild(bar);
            this.bars.push(bar);
        }

        this.animate();
    }

    animate() {
        this.bars.forEach(bar => {
            const height = Math.random() * 30 + 5;
            bar.style.height = height + 'px';
        });

        setTimeout(() => this.animate(), 100);
    }
}

// ============================================
// RANDOM INTERFERENCE
// ============================================
class Interference {
    constructor() {
        this.scheduleNext();
    }

    scheduleNext() {
        const delay = 5000 + Math.random() * 15000;
        setTimeout(() => {
            this.trigger();
            this.scheduleNext();
        }, delay);
    }

    trigger() {
        // Brief screen distortion
        document.body.style.filter = `
            hue-rotate(${Math.random() * 30 - 15}deg)
            saturate(${1 + Math.random() * 0.5})
        `;

        setTimeout(() => {
            document.body.style.filter = '';
        }, 100);
    }
}

// ============================================
// CREEPY MESSAGE SYSTEM
// ============================================
class CreepyMessages {
    constructor() {
        this.messages = [
            'MY DISCORD: meett',
            'I CODE SOMETIMES',
            'ॐ नमो नारायणाय',
            'ॐ नमः शिवाय',
            'The moon and sun are kind enough to shine indiscriminately',
            '( ͡° ͜ʖ ͡°)',
            'wassah dude',
        ];

        this.scheduleMessage();
    }

    scheduleMessage() {
        const delay = 5000 + Math.random() * 10000;
        setTimeout(() => {
            this.showMessage();
            this.scheduleMessage();
        }, delay);
    }

    showMessage() {
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];

        const el = document.createElement('div');
        el.textContent = message;
        el.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Space Mono', monospace;
            font-size: 3vw;
            color: rgba(255, 69, 0, 0.15);
            pointer-events: none;
            z-index: 9994;
            letter-spacing: 0.5em;
            animation: creepy-fade 2s ease forwards;
        `;

        document.body.appendChild(el);

        setTimeout(() => el.remove(), 2000);
    }
}

// Add creepy fade animation
const creepyStyle = document.createElement('style');
creepyStyle.textContent = `
    @keyframes creepy-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
    }

    @keyframes glitch-reveal {
        0% { transform: skew(0deg); filter: blur(10px); opacity: 0; }
        20% { transform: skew(-5deg); filter: blur(5px); }
        40% { transform: skew(3deg); filter: blur(2px); }
        60% { transform: skew(-2deg); filter: blur(1px); }
        80% { transform: skew(1deg); filter: blur(0); }
        100% { transform: skew(0deg); filter: blur(0); opacity: 1; }
    }
`;
document.head.appendChild(creepyStyle);

// ============================================
// SUN PULSATION SYNC
// ============================================
class SunPulsation {
    constructor() {
        this.sun = document.getElementById('sun-orb');
        if (!this.sun) return;

        this.breathe();
    }

    breathe() {
        let scale = 1;
        let growing = true;
        const minScale = 0.95;
        const maxScale = 1.05;
        const speed = 0.001;

        const animate = () => {
            if (growing) {
                scale += speed;
                if (scale >= maxScale) growing = false;
            } else {
                scale -= speed;
                if (scale <= minScale) growing = true;
            }

            this.sun.style.transform = `scale(${scale})`;
            requestAnimationFrame(animate);
        };

        animate();
    }
}

// ============================================
// OM SYMBOL COLOR SHIFT
// ============================================
class OmColorShift {
    constructor() {
        this.omSymbol = document.getElementById('om-symbol');
        if (!this.omSymbol) return;

        this.colors = [
            '#ff4500', // inferno
            '#ff6b35', // ember
            '#ff8c00', // dark orange
            '#ffa500', // orange
            '#ffffff', // white
            '#ffb347', // light orange
            '#ff6347', // tomato
            '#ff4500', // back to inferno
        ];

        this.currentIndex = 0;
        this.shift();
    }

    shift() {
        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.colors.length;
            this.omSymbol.style.color = this.colors[this.currentIndex];
        }, 2000);
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all systems
    const cursor = new DarkCursor();
    const parallax = new DarkParallax();
    const glitchBurst = new GlitchBurst();
    const reveal = new GlitchReveal();
    const tempFlux = new TemperatureFlux('temp-counter');
    const interference = new Interference();
    const creepyMessages = new CreepyMessages();
    const sunPulse = new SunPulsation();
    const omColorShift = new OmColorShift();

    // Text scramble on tagline
    const tagline = document.getElementById('tagline');
    if (tagline) {
        const scrambler = new TextScramble(tagline);
        const phrases = [
            '// ॐ नमो नारायणाय //',
            '// THE MIND IS A WONDERFUL SERVANT BUT A TERRIBLE MASTER //',
            '// ( ͡° ͜ʖ ͡°) //',
            '// DISCORD: meett //',
            '// ॐ नमः शिवाय //',
        ];

        let counter = 0;
        const cycleText = () => {
            scrambler.setText(phrases[counter]).then(() => {
                setTimeout(cycleText, 5000);
            });
            counter = (counter + 1) % phrases.length;
        };

        setTimeout(cycleText, 3000);
    }

    // Counter animation for days lost
    const daysCounter = document.getElementById('counter-days');
    if (daysCounter) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Calculate days since June 1, 2024
                const startDate = new Date('2024-06-01');
                const today = new Date();
                const diffTime = Math.abs(today - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                const counter = new DarkCounter(daysCounter, diffDays, 3000);
                counter.start();
                observer.disconnect();
            }
        });
        observer.observe(daysCounter);
    }

    // Random glitch bursts on click
    document.addEventListener('click', () => {
        if (Math.random() < 0.3) {
            glitchBurst.trigger();
        }
    });

    // Keyboard easter egg
    let konamiIndex = 0;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg: intense glitch
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => glitchBurst.trigger(), i * 100);
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Expose for debugging
    window.mugtree = {
        cursor,
        parallax,
        glitchBurst,
        triggerGlitch: () => glitchBurst.trigger(),
    };

    console.log('%c MUGTREE ', 'background: #ff4500; color: #000; font-size: 20px; font-weight: bold;');
    console.log('%c Welcome to the wasteland... ', 'color: #ff6b35; font-style: italic;');
});
