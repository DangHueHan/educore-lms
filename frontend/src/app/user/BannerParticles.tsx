"use client";
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
  color: string;
  type: "dot" | "ring" | "cross";
}

const COLORS = [
  "56,189,248",   // sky-400
  "59,130,246",   // blue-500
  "99,202,255",   // light blue
  "147,197,253",  // blue-300
  "34,211,238",   // cyan-400
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export function BannerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles concentrated on the right half (where robot is)
    const spawn = (): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      // Robot is roughly in right 55% of banner
      const x = randomBetween(w * 0.42, w * 0.98);
      const y = randomBetween(h * 0.05, h * 0.95);
      const angle = randomBetween(0, Math.PI * 2);
      const speed = randomBetween(0.2, 0.7);
      const types: Particle["type"][] = ["dot", "dot", "dot", "ring", "cross"];
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.25, // slight upward drift
        radius: randomBetween(1.5, 4.5),
        alpha: randomBetween(0.2, 0.9),
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: types[Math.floor(Math.random() * types.length)],
      };
    };

    // Init pool
    for (let i = 0; i < 80; i++) particles.push(spawn());

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.shadowColor = `rgba(${p.color},0.9)`;
      ctx.shadowBlur = p.radius * 5;

      if (p.type === "dot") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "ring") {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // cross / plus
        const s = p.radius * 2;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x - s, p.y);
        ctx.lineTo(p.x + s, p.y);
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x, p.y + s);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawGlow = () => {
      const w = canvas.width;
      const h = canvas.height;
      // Main glow orb around robot center (~70% x, 50% y)
      const gx = w * 0.68;
      const gy = h * 0.52;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.3);
      grad.addColorStop(0, "rgba(56,189,248,0.13)");
      grad.addColorStop(0.5, "rgba(59,130,246,0.07)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Secondary smaller glow — accent
      const g2 = ctx.createRadialGradient(gx - 60, gy + 40, 0, gx - 60, gy + 40, w * 0.15);
      g2.addColorStop(0, "rgba(34,211,238,0.10)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    // Floating lines connecting nearby particles
    const drawConnections = () => {
      const maxDist = 80;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.25;
            ctx.save();
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.shadowColor = "rgba(56,189,248,0.4)";
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      drawGlow();
      drawConnections();

      particles = particles.map((p) => {
        let { x, y, vx, vy, alpha, alphaDir } = p;
        x += vx;
        y += vy;
        alpha += alphaDir * 0.008;
        if (alpha > 0.95 || alpha < 0.1) alphaDir *= -1;

        // Respawn if out of bounds
        if (x < w * 0.38 || x > w * 1.02 || y < -10 || y > h + 10) {
          return spawn();
        }
        return { ...p, x, y, alpha, alphaDir };
      });

      particles.forEach(drawParticle);
      animId = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3 }}
    />
  );
}
