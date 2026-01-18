/**
 * MUGTREE - Heavy Desert Particle Systems
 * Sandstorm, Embers, and Atmospheric Effects
 */

// ============================================
// SANDSTORM SYSTEM - Heavy blowing sand/dust
// ============================================
class Sandstorm {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.windAngle = 0;

        this.config = {
            particleCount: 100,
            minSize: 0.5,
            maxSize: 3,
            minSpeed: 2,
            maxSpeed: 8,
            windStrength: 0.3,
            turbulence: 0.02,
            colors: [
                'rgba(139, 37, 0, 0.4)',    // rust
                'rgba(102, 0, 0, 0.3)',      // blood
                'rgba(255, 69, 0, 0.2)',     // ember
                'rgba(255, 107, 53, 0.15)', // blaze
                'rgba(20, 20, 20, 0.5)',    // dark dust
                'rgba(40, 30, 20, 0.4)',    // brown dust
            ]
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle(startFromLeft = false) {
        const size = this.random(this.config.minSize, this.config.maxSize);
        const speed = this.random(this.config.minSpeed, this.config.maxSpeed);

        return {
            x: startFromLeft ? -10 : this.random(0, this.canvas.width),
            y: this.random(0, this.canvas.height),
            size: size,
            baseSpeed: speed,
            speedX: speed,
            speedY: this.random(-1, 1),
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            opacity: this.random(0.1, 0.6),
            noise: this.random(0, 1000),
            noiseSpeed: this.random(0.01, 0.03),
            trail: [],
            maxTrail: Math.floor(this.random(3, 8)),
        };
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    // Simplex noise approximation for turbulence
    noise(x) {
        return Math.sin(x * 0.5) * Math.cos(x * 0.3) + Math.sin(x * 0.7);
    }

    update() {
        // Slowly change wind direction
        this.windAngle += this.config.turbulence;

        this.particles.forEach((p, index) => {
            // Store trail position
            p.trail.unshift({ x: p.x, y: p.y });
            if (p.trail.length > p.maxTrail) p.trail.pop();

            // Noise-based turbulence
            p.noise += p.noiseSpeed;
            const turbulenceX = this.noise(p.noise) * 2;
            const turbulenceY = this.noise(p.noise + 100) * 1.5;

            // Wind effect
            const windX = Math.cos(this.windAngle) * this.config.windStrength;
            const windY = Math.sin(this.windAngle * 0.5) * this.config.windStrength * 0.3;

            // Update position
            p.x += p.speedX + turbulenceX + windX;
            p.y += p.speedY + turbulenceY + windY;

            // Mouse repulsion
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.x += (dx / dist) * force * 3;
                p.y += (dy / dist) * force * 3;
            }

            // Wrap around
            if (p.x > this.canvas.width + 20) {
                this.particles[index] = this.createParticle(true);
            }
            if (p.y < -20) p.y = this.canvas.height + 20;
            if (p.y > this.canvas.height + 20) p.y = -20;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // Draw trail
            if (p.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let i = 1; i < p.trail.length; i++) {
                    this.ctx.lineTo(p.trail[i].x, p.trail[i].y);
                }
                this.ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, (p.opacity * 0.3) + ')');
                this.ctx.lineWidth = p.size * 0.5;
                this.ctx.stroke();
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Glow for larger particles
            if (p.size > 2) {
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, 'rgba(255, 69, 0, 0.1)');
                gradient.addColorStop(1, 'transparent');
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// EMBER SYSTEM - Rising fire particles
// ============================================
class EmberSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.embers = [];

        this.config = {
            emberCount: 20,
            spawnRate: 0.3,
            minSize: 1,
            maxSize: 4,
            riseSpeed: { min: 0.5, max: 2 },
            drift: 1.5,
            colors: [
                { r: 255, g: 69, b: 0 },    // ember
                { r: 255, g: 107, b: 53 },  // blaze
                { r: 255, g: 140, b: 0 },   // inferno
                { r: 255, g: 87, b: 34 },   // magma
            ]
        };

        this.init();
    }

    init() {
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createEmber() {
        const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)];
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            size: this.random(this.config.minSize, this.config.maxSize),
            riseSpeed: this.random(this.config.riseSpeed.min, this.config.riseSpeed.max),
            drift: (Math.random() - 0.5) * this.config.drift,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: this.random(0.02, 0.08),
            color: color,
            life: 1,
            decay: this.random(0.002, 0.008),
            flicker: Math.random(),
            flickerSpeed: this.random(0.1, 0.3),
        };
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    update() {
        // Spawn new embers
        if (Math.random() < this.config.spawnRate && this.embers.length < this.config.emberCount) {
            this.embers.push(this.createEmber());
        }

        // Update existing embers
        this.embers = this.embers.filter(ember => {
            ember.wobble += ember.wobbleSpeed;
            ember.flicker += ember.flickerSpeed;

            // Rise up with wobble
            ember.y -= ember.riseSpeed;
            ember.x += ember.drift + Math.sin(ember.wobble) * 0.5;

            // Decay life
            ember.life -= ember.decay;

            // Gradually slow down
            ember.riseSpeed *= 0.999;

            return ember.life > 0 && ember.y > -50;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.embers.forEach(ember => {
            const flickerIntensity = 0.5 + Math.sin(ember.flicker) * 0.5;
            const alpha = ember.life * flickerIntensity;

            // Outer glow
            const glowSize = ember.size * 8;
            const gradient = this.ctx.createRadialGradient(
                ember.x, ember.y, 0,
                ember.x, ember.y, glowSize
            );
            gradient.addColorStop(0, `rgba(${ember.color.r}, ${ember.color.g}, ${ember.color.b}, ${alpha * 0.4})`);
            gradient.addColorStop(0.4, `rgba(${ember.color.r}, ${ember.color.g}, ${ember.color.b}, ${alpha * 0.1})`);
            gradient.addColorStop(1, 'transparent');

            this.ctx.beginPath();
            this.ctx.arc(ember.x, ember.y, glowSize, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // Core
            this.ctx.beginPath();
            this.ctx.arc(ember.x, ember.y, ember.size * ember.life, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
            this.ctx.fill();

            // Middle layer
            this.ctx.beginPath();
            this.ctx.arc(ember.x, ember.y, ember.size * 1.5 * ember.life, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${ember.color.r}, ${ember.color.g}, ${ember.color.b}, ${alpha * 0.8})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// DUST DEVIL - Occasional swirling effect
// ============================================
class DustDevil {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.active = false;
        this.particles = [];
        this.center = { x: 0, y: 0 };
        this.radius = 100;
        this.angle = 0;
    }

    spawn(x, y) {
        if (this.active) return;
        this.active = true;
        this.center = { x, y };
        this.particles = [];
        this.angle = 0;

        for (let i = 0; i < 50; i++) {
            this.particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * this.radius,
                speed: 0.05 + Math.random() * 0.1,
                size: 1 + Math.random() * 2,
                riseSpeed: 0.5 + Math.random() * 1,
                y: 0,
            });
        }

        setTimeout(() => {
            this.active = false;
            this.particles = [];
        }, 5000);
    }

    update() {
        if (!this.active) return;

        this.angle += 0.02;

        this.particles.forEach(p => {
            p.angle += p.speed;
            p.y -= p.riseSpeed;
            p.radius += 0.2;
        });
    }

    draw() {
        if (!this.active) return;

        this.particles.forEach(p => {
            const x = this.center.x + Math.cos(p.angle) * p.radius;
            const y = this.center.y + p.y + Math.sin(p.angle) * p.radius * 0.3;

            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 37, 0, ${0.5 - Math.abs(p.y) / 500})`;
            this.ctx.fill();
        });
    }
}

// ============================================
// HEAT HAZE EFFECT - Distortion layer
// ============================================
class HeatHaze {
    constructor() {
        this.time = 0;
        this.enabled = false;
    }

    apply(element) {
        if (!this.enabled) return;

        this.time += 0.016;
        const distortion = Math.sin(this.time * 2) * 0.5;
        element.style.transform = `scaleX(${1 + distortion * 0.002})`;
    }
}

// ============================================
// DEBRIS SYSTEM - Floating rocks/objects
// ============================================
class DebrisSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.debris = [];
        this.init();
    }

    init() {
        // Create floating debris elements
        for (let i = 0; i < 15; i++) {
            this.createDebris();
        }
    }

    createDebris() {
        const debris = document.createElement('div');
        const size = 2 + Math.random() * 8;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * 10;

        debris.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(20, 20, 20, 0.8);
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${x}%;
            top: ${y}%;
            animation: float-debris ${duration}s ease-in-out ${delay}s infinite;
            box-shadow: 0 0 ${size}px rgba(255, 69, 0, 0.1);
        `;

        this.container.appendChild(debris);
        this.debris.push(debris);
    }
}

// Add debris animation
const debrisStyle = document.createElement('style');
debrisStyle.textContent = `
    @keyframes float-debris {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
        }
        25% {
            transform: translate(20px, -30px) rotate(90deg);
            opacity: 0.6;
        }
        50% {
            transform: translate(-10px, -50px) rotate(180deg);
            opacity: 0.4;
        }
        75% {
            transform: translate(30px, -20px) rotate(270deg);
            opacity: 0.5;
        }
    }
`;
document.head.appendChild(debrisStyle);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sandstorm
    const sandstorm = new Sandstorm('sand-canvas');

    // Initialize ember system
    const embers = new EmberSystem('ember-canvas');

    // Initialize debris
    const debris = new DebrisSystem('debris-container');

    // Random dust devil spawns
    if (sandstorm.canvas) {
        const dustDevil = new DustDevil(sandstorm.canvas);

        setInterval(() => {
            if (Math.random() < 0.3) {
                const x = Math.random() * window.innerWidth;
                const y = window.innerHeight * 0.7;
                dustDevil.spawn(x, y);
            }
        }, 10000);
    }

    // Expose for debugging
    window.desertEffects = {
        sandstorm,
        embers,
        debris
    };
});
