"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface NeonSignProps {
  text?: string;
}

class Line {
  y: number;
  amplitude: number;
  frequency: number;
  phase: number;
  points: Point[];

  constructor(
    y: number,
    amplitude: number,
    frequency: number,
    phase: number,
    canvasWidth: number
  ) {
    this.y = y;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.phase = phase;
    this.points = [];
    for (let x = 0; x <= canvasWidth; x += 5) {
      const randomOffset = Math.sin(x * 0.05 + this.phase) * this.amplitude;
      this.points.push({ x: x, y: this.y + randomOffset });
    }
  }

  update(time: number, canvasWidth: number) {
    this.points.forEach((point, index) => {
      const distanceFromCenter = Math.abs(point.x - canvasWidth / 2);
      const maxDistance = canvasWidth / 2;

      const currentAmplitude =
        this.amplitude * (1 - Math.pow(distanceFromCenter / maxDistance, 2));
      const yOffset =
        Math.sin(index * 0.05 + time * this.frequency + this.phase) *
          currentAmplitude +
        Math.cos(time * 0.001 + point.x * 0.01) * 20;
      point.y = this.y + yOffset;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length - 2; i += 2) {
      const cpX = (this.points[i].x + this.points[i + 1].x) / 2;
      const cpY = (this.points[i].y + this.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, cpX, cpY);
    }
    ctx.strokeStyle = "rgb(0 255 80 / 10%)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function initLines(
  lines: Line[],
  lineCount: number,
  centralHeight: number,
  canvasHeight: number,
  canvasWidth: number
) {
  lines.length = 0;
  for (let i = 0; i < lineCount; i++) {
    const y =
      canvasHeight / 2 -
      centralHeight / 2 +
      (centralHeight / lineCount) * i +
      Math.random() * 100 -
      50;
    const amplitude = Math.random() * 200 + 50;
    const frequency = Math.random() * 0.1 + 0.01;
    const phase = Math.random() * Math.PI * 2;
    lines.push(new Line(y, amplitude, frequency, phase, canvasWidth));
  }
}

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // Trail effect for smoother visuals
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
  gradient.addColorStop(0, "rgb(0 255 80 / 10%)"); // Neon pink
  gradient.addColorStop(1, "#00F5D4"); // Neon turquoise

  // Set text fill style to gradient
  ctx.fillStyle = gradient;

  // Set shadow for neon glow effect
  ctx.shadowColor = "#00F5D4"; // Neon turquoise glow
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
}

function animate(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  waveSpeed: number,
  canvasWidth: number,
  canvasHeight: number,
  text: string,
  time: number,
  animationFrameIdRef: React.MutableRefObject<number | null>
) {
  clearCanvas(ctx, canvasWidth, canvasHeight); // Clear the canvas with trail effect

  lines.forEach((line) => {
    line.update(time * waveSpeed, canvasWidth);
    line.draw(ctx);
  });

  drawNeonText(ctx, text, canvasWidth, canvasHeight); // Draw neon text

  animationFrameIdRef.current = requestAnimationFrame((newTime) =>
    animate(
      ctx,
      lines,
      waveSpeed,
      canvasWidth,
      canvasHeight,
      text,
      newTime,
      animationFrameIdRef
    )
  );
}

export const NeonSign = ({ text = "Hello World!" }: NeonSignProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
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

      const lines = linesRef.current;
      const lineCount = 30;
      const waveSpeed = 0.01;
      const centralHeight = canvas.height * 0.2;

      initLines(lines, lineCount, centralHeight, canvas.height, canvas.width);
      animate(
        ctx,
        lines,
        waveSpeed,
        canvas.width,
        canvas.height,
        text,
        0,
        animationFrameIdRef
      );

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initLines(lines, lineCount, centralHeight, canvas.height, canvas.width);
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
