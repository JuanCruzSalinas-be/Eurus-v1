import React, { useEffect, useRef } from "react";

/**
 * Ported from a vanilla mouse-trail canvas demo (originally a Next.js/TS
 * shadcn "canvas.tsx" component): a bundle of spring-jointed point chains
 * that all ease toward the pointer, drawn with an additive "lighter" blend
 * so overlapping trails glow into rainbow streaks. The original attached
 * everything to `document` via `getElementById("canvas")` and never cleaned
 * up — here it's scoped to this component's own canvas ref (so it can be
 * mounted more than once) and every listener/rAF is torn down on unmount,
 * matching the rest of this site's canvas effect (see WovenCanvas.jsx).
 */
const SETTINGS = { friction: 0.5, trails: 80, size: 50, dampening: 0.025, tension: 0.99 };

function makeOscillator({ phase = 0, offset = 0, frequency = 0.001, amplitude = 1 }) {
  return { phase, offset, frequency, amplitude, value: offset };
}
function updateOscillator(o) {
  o.phase += o.frequency;
  o.value = o.offset + Math.sin(o.phase) * o.amplitude;
  return o.value;
}

function makeNode(x, y) {
  return { x, y, vx: 0, vy: 0 };
}

function makeLine(spring, pos) {
  const line = {
    spring: spring + 0.1 * Math.random() - 0.05,
    friction: SETTINGS.friction + 0.01 * Math.random() - 0.005,
    nodes: [],
  };
  for (let i = 0; i < SETTINGS.size; i++) line.nodes.push(makeNode(pos.x, pos.y));
  return line;
}

function updateLine(line, pos) {
  let spring = line.spring;
  let node = line.nodes[0];
  node.vx += (pos.x - node.x) * spring;
  node.vy += (pos.y - node.y) * spring;
  for (let i = 0; i < line.nodes.length; i++) {
    node = line.nodes[i];
    if (i > 0) {
      const prev = line.nodes[i - 1];
      node.vx += (prev.x - node.x) * spring;
      node.vy += (prev.y - node.y) * spring;
      node.vx += prev.vx * SETTINGS.dampening;
      node.vy += prev.vy * SETTINGS.dampening;
    }
    node.vx *= line.friction;
    node.vy *= line.friction;
    node.x += node.vx;
    node.y += node.vy;
    spring *= SETTINGS.tension;
  }
}

function drawLine(line, ctx) {
  const nodes = line.nodes;
  let x = nodes[0].x;
  let y = nodes[0].y;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 1, len = nodes.length - 2; i < len; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    x = 0.5 * (a.x + b.x);
    y = 0.5 * (a.y + b.y);
    ctx.quadraticCurveTo(a.x, a.y, x, y);
  }
  const a = nodes[nodes.length - 2];
  const b = nodes[nodes.length - 1];
  ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
  ctx.stroke();
  ctx.closePath();
}

export default function MouseTrailCanvas({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    const pos = { x: 0, y: 0 };
    let lines = [];
    let running = false;
    let started = false;
    let rafId;

    const hue = makeOscillator({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const setPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      pos.x = t.clientX - rect.left;
      pos.y = t.clientY - rect.top;
    };

    const render = () => {
      if (!running) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `hsla(${Math.round(updateOscillator(hue))},100%,50%,0.025)`;
      ctx.lineWidth = 10;
      for (let i = 0; i < lines.length; i++) {
        updateLine(lines[i], pos);
        drawLine(lines[i], ctx);
      }
      rafId = requestAnimationFrame(render);
    };

    const begin = (e) => {
      setPos(e);
      lines = [];
      for (let i = 0; i < SETTINGS.trails; i++) {
        lines.push(makeLine(0.45 + (i / SETTINGS.trails) * 0.025, pos));
      }
      started = true;
      running = true;
      render();
    };

    const onMove = (e) => {
      if (!started) {
        begin(e);
        return;
      }
      setPos(e);
    };
    const onLeave = () => {
      running = false;
    };
    const onFocus = () => {
      if (started && !running) {
        running = true;
        render();
      }
    };
    const onBlur = () => {
      running = false;
    };

    resize();
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchstart", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchstart", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
