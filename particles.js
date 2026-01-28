/**
 * MUGTREE - Minimal Particles
 * Simple floating particles, no heavy effects
 */

class MinimalParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 30;
        this.mouse = { x: null, y: null };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('click', (e) => {
            this.explode(e.clientX, e.clientY);
        });
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    explode(x, y) {
        this.particles.forEach(p => {
            const dx = (p.x - x) + 0.1 * (Math.random() - 0.5);
            const dy = (p.y - y) + 0.1 * (Math.random() - 0.5);
            const dist = 0.4 * Math.sqrt(dx * dx + dy * dy);
            const force = Math.min(300 / (dist + 1), 15);

            p.speedX += (dx / dist) * force;
            p.speedY += (dy / dist) * force;
        });
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1 + 0.2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: -Math.random() * 1 - 0.2,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            // Loosely drift toward cursor if it exists
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Gentle attraction - stronger when closer
                const attraction = 0.04;
                p.speedX += (dx / dist) * attraction;
                p.speedY += (dy / dist) * attraction;

                // Dampen speed to keep it slow
                p.speedX *= 0.90;
                p.speedY *= 0.98;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            // Draw glow
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            gradient.addColorStop(0, `rgba(255, 100, 50, ${p.opacity})`);
            gradient.addColorStop(1, 'transparent');
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Draw core
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 150, 80, ${p.opacity + 0.2})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MinimalParticles('ember-canvas');
});
