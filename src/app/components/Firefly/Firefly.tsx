"use client";

import { useEffect, useRef } from "react";

interface FireflyProps {
  text?: string;
}

class FireLine {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  life: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.speedX = (Math.random() - 0.5) * 10;
    this.speedY = (Math.random() - 0.5) * 10;
    this.life = Math.random() * 100 + 50;
    this.color = `hsl(${Math.random() * 60 + 20}, 100%, 50%)`; // Fire-like colors
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.life / 10), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initFireLines(
  fireLines: FireLine[],
  fireLineCount: number,
  canvasWidth: number,
  canvasHeight: number
) {
  fireLines.length = 0;
  for (let i = 0; i < fireLineCount; i++) {
    fireLines.push(new FireLine(canvasWidth, canvasHeight));
  }
}

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Trail effect for smoother visuals
  ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas with a slight opacity
}

function drawNeonText(
  ctx: CanvasRenderingContext2D,
  text: string,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.font = "100px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Create gradient for neon effect
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
  gradient.addColorStop(0, "rgb(255, 80, 0, 1)"); // Neon orange
  gradient.addColorStop(1, "#FF4500"); // Deep orange

  // Set text fill style to gradient
  ctx.fillStyle = gradient;

  // Set shadow for neon glow effect
  ctx.shadowColor = "#FF4500"; // Orange glow
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
}

function animate(
  ctx: CanvasRenderingContext2D,
  fireLines: FireLine[],
  canvasWidth: number,
  canvasHeight: number,
  text: string,
  animationFrameIdRef: React.MutableRefObject<number | null>
) {
  clearCanvas(ctx, canvasWidth, canvasHeight); // Clear the canvas with trail effect

  fireLines.forEach((fireLine, index) => {
    fireLine.update();
    fireLine.draw(ctx);
    if (fireLine.life < 0) {
      fireLines.splice(index, 1);
      fireLines.push(new FireLine(canvasWidth, canvasHeight)); // Add a new fire line when one fades away
    }
  });

  drawNeonText(ctx, text, canvasWidth, canvasHeight); // Draw neon text

  animationFrameIdRef.current = requestAnimationFrame(() =>
    animate(
      ctx,
      fireLines,
      canvasWidth,
      canvasHeight,
      text,
      animationFrameIdRef
    )
  );
}

export const Firefly = ({ text = "Hello World!" }: FireflyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireLinesRef = useRef<FireLine[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      if (!ctxRef.current) {
        ctxRef.current = canvas.getContext("2d");
      }
      const ctx = ctxRef.current;
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const fireLines = fireLinesRef.current;
      const fireLineCount = 300;

      initFireLines(fireLines, fireLineCount, canvas.width, canvas.height);
      animate(
        ctx,
        fireLines,
        canvas.width,
        canvas.height,
        text,
        animationFrameIdRef
      );

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initFireLines(fireLines, fireLineCount, canvas.width, canvas.height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [text]);

  return <canvas ref={canvasRef} />;
};
