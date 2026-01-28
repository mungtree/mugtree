/**
 * MUGTREE - Minimal Effects
 */

// Glitch text cycling for tagline
class TextCycle {
    constructor(el) {
        this.el = el;
        this.phrases = [
            '// WELCOME! //',
            '// ॐ नमो नारायणाय //',
            '// DISCORD: meett //',
            '// ॐ नमः शिवाय //',
            '// ( ͡° ͜ʖ ͡°) //',
        ];
        this.index = 0;
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01';
    }

    glitchTo(targetText) {
        const duration = 600;
        const steps = 10;
        const stepDuration = duration / steps;
        let step = 0;

        const animate = () => {
            if (step < steps) {
                let glitched = '';
                for (let i = 0; i < targetText.length; i++) {
                    if (Math.random() < step / steps) {
                        glitched += targetText[i];
                    } else {
                        glitched += this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                    }
                }
                this.el.textContent = glitched;
                step++;
                setTimeout(animate, stepDuration);
            } else {
                this.el.textContent = targetText;
            }
        };
        animate();
    }

    start() {
        setInterval(() => {
            this.index = (this.index + 1) % this.phrases.length;
            this.glitchTo(this.phrases[this.index]);
        }, 4000);
    }
}

// Counter animation
class Counter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
    }

    start() {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            this.element.textContent = Math.floor(eased * this.target);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Text cycling on tagline
    const tagline = document.getElementById('tagline');
    if (tagline) {
        tagline.style.transition = 'opacity 0.3s ease';
        const cycle = new TextCycle(tagline);
        setTimeout(() => cycle.start(), 3000);
    }

    // Counter animation for days
    const daysCounter = document.getElementById('counter-days');
    if (daysCounter) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const startDate = new Date('2024-06-01');
                const today = new Date();
                const diffDays = Math.ceil(Math.abs(today - startDate) / (1000 * 60 * 60 * 24));
                const counter = new Counter(daysCounter, diffDays, 2000);
                counter.start();
                observer.disconnect();
            }
        });
        observer.observe(daysCounter);
    }

    console.log('%c MUGTREE ', 'background: #ff4500; color: #000; font-size: 20px; font-weight: bold;');
});
