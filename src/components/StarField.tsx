"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

type Star = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkle: number;
  twinkleSpeed: number;
};

function createStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    opacity: Math.random() * 0.6 + 0.25,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.025 + 0.008,
  }));
}

export function StarField() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (theme !== "dark") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.round((width * height) / 14000);
      starsRef.current = createStars(
        Math.min(Math.max(density, 60), 160),
        width,
        height,
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      for (const star of starsRef.current) {
        if (!reduceMotion) {
          star.x += star.speedX;
          star.y += star.speedY;
          star.twinkle += star.twinkleSpeed;

          if (star.x < -4) star.x = width + 4;
          if (star.x > width + 4) star.x = -4;
          if (star.y < -4) star.y = height + 4;
          if (star.y > height + 4) star.y = -4;
        }

        const pulse = 0.55 + Math.sin(star.twinkle) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(210, 230, 255, ${star.opacity * pulse})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  if (theme !== "dark") return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  );
}
