/* ===================================================
   Geometry Particle Animation — particles.js
   Continuous looping geometric particles with
   connecting lines across the entire viewport.
   =================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ————— Configuration —————
  const CONFIG = {
    particleCount: 80,          // number of particles
    connectionDistance: 160,     // max distance for connecting lines
    particleMinSize: 2,
    particleMaxSize: 5,
    speedMin: 0.15,
    speedMax: 0.6,
    mouseRadius: 200,           // interaction radius around cursor
    // Colors from portfolio palette (accent indigo family)
    colors: [
      'rgba(79, 70, 229, 0.45)',   // --accent
      'rgba(67, 56, 202, 0.35)',   // --accent-hover
      'rgba(99, 102, 241, 0.35)',  // lighter indigo
      'rgba(129, 140, 248, 0.3)',  // soft indigo
      'rgba(165, 180, 252, 0.25)', // very light indigo
    ],
    lineColor: 'rgba(79, 70, 229, ',  // base for connection lines (alpha appended)
    shapes: ['circle', 'triangle', 'square', 'diamond', 'hexagon'],
  };

  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animationId;
  let dpr = 1;

  // ————— Resize canvas to full viewport —————
  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ————— Particle class —————
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial
        ? Math.random() * window.innerHeight
        : Math.random() * window.innerHeight;
      this.size = CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize);
      this.baseSize = this.size;
      this.speedX = (Math.random() - 0.5) * 2 * CONFIG.speedMax;
      this.speedY = (Math.random() - 0.5) * 2 * CONFIG.speedMax;
      // Ensure minimum speed
      if (Math.abs(this.speedX) < CONFIG.speedMin) this.speedX = CONFIG.speedMin * (Math.random() > 0.5 ? 1 : -1);
      if (Math.abs(this.speedY) < CONFIG.speedMin) this.speedY = CONFIG.speedMin * (Math.random() > 0.5 ? 1 : -1);
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.shape = CONFIG.shapes[Math.floor(Math.random() * CONFIG.shapes.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
      this.pulsePhase += 0.02;

      // Gentle size pulsing
      this.size = this.baseSize + Math.sin(this.pulsePhase) * 0.5;

      // Mouse interaction — gently push particles away
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        this.x += (dx / dist) * force * 1.5;
        this.y += (dy / dist) * force * 1.5;
      }

      // Wrap around edges
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (this.x < -20) this.x = w + 20;
      if (this.x > w + 20) this.x = -20;
      if (this.y < -20) this.y = h + 20;
      if (this.y > h + 20) this.y = -20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.8;

      const s = this.size;

      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.closePath();
          ctx.stroke();
          ctx.globalAlpha = this.opacity * 0.3;
          ctx.fill();
          break;

        case 'square':
          ctx.beginPath();
          ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
          ctx.stroke();
          ctx.globalAlpha = this.opacity * 0.2;
          ctx.fill();
          break;

        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.7, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.7, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.globalAlpha = this.opacity * 0.25;
          ctx.fill();
          break;

        case 'hexagon':
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = s * Math.cos(angle);
            const py = s * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.globalAlpha = this.opacity * 0.2;
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  // ————— Draw connecting lines between nearby particles —————
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const alpha = (1 - dist / CONFIG.connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = CONFIG.lineColor + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // ————— Animation loop —————
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update & draw particles
    for (const p of particles) {
      p.update();
      p.draw();
    }

    // Connection lines
    drawConnections();

    animationId = requestAnimationFrame(animate);
  }

  // ————— Initialize —————
  function init() {
    resize();
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(new Particle());
    }
    animate();
  }

  // ————— Event listeners —————
  window.addEventListener('resize', () => {
    resize();
    // Adjust particle count on smaller screens
    const targetCount = window.innerWidth < 768 ? 40 : CONFIG.particleCount;
    while (particles.length > targetCount) particles.pop();
    while (particles.length < targetCount) particles.push(new Particle());
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Reduce animation when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
