"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_grain;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float heightAt(vec2 uv, float t) {
  vec2 p = uv * vec2(0.12, 0.2);
  p += vec2(t * 0.018, t * 0.012);

  // Domain warp for silk / liquid folds
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0)),
    fbm(p + vec2(5.2, 1.3))
  );
  vec2 r = vec2(
    fbm(p + 2.4 * q + vec2(1.7 + t * 0.02, 9.2)),
    fbm(p + 2.4 * q + vec2(8.3, 2.8 + t * 0.015))
  );

  float h = fbm(p + 2.8 * r);
  // Soft bias so valleys stay deep charcoal
  h = smoothstep(0.38, 0.92, h);
  return h;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  // Keep aspect so folds don't stretch on wide screens
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) + 0.5;

  float t = u_time * 0.35;
  float h = heightAt(p, t);

  // Finite-difference normals for soft 3D lighting
  float e = 1.5 / max(u_res.y, 1.0);
  float hx = heightAt(p + vec2(e * aspect, 0.0), t);
  float hy = heightAt(p + vec2(0.0, e), t);
  vec3 n = normalize(vec3((h - hx) / e, (h - hy) / e, 0.55));

  vec3 lightDir = normalize(vec3(-0.35, 0.55, 0.75));
  float diff = max(dot(n, lightDir), 0.0);
  float rim = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.2) * 0.22;
  float shade = 0.12 + diff * 0.78 + rim;
  shade *= mix(0.55, 1.0, h);

  // Cool grey ramp — never warm
  vec3 c0 = vec3(0.02, 0.02, 0.022);
  vec3 c1 = vec3(0.14, 0.145, 0.15);
  vec3 c2 = vec3(0.42, 0.43, 0.445);
  vec3 col = mix(c0, c1, smoothstep(0.0, 0.45, shade));
  col = mix(col, c2, smoothstep(0.45, 1.0, shade));

  // Soft vignette matching reference framing
  float vig = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(1.1, 1.0)));
  col *= mix(0.72, 1.0, vig);

  // Film grain
  float g = hash(gl_FragCoord.xy + fract(t * 13.7) * 100.0) - 0.5;
  col += g * u_grain;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function paintFallback(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;
  const g = ctx.createRadialGradient(
    w * 0.35,
    h * 0.7,
    0,
    w * 0.5,
    h * 0.55,
    Math.max(w, h) * 0.75
  );
  g.addColorStop(0, "#3a3b3e");
  g.addColorStop(0.45, "#1a1b1d");
  g.addColorStop(1, "#050505");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const g2 = ctx.createRadialGradient(
    w * 0.78,
    h * 0.22,
    0,
    w * 0.78,
    h * 0.22,
    Math.min(w, h) * 0.45
  );
  g2.addColorStop(0, "rgba(90,92,96,0.45)");
  g2.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
}

export function HeroBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      const resizeFallback = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
        canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        paintFallback(canvas);
      };
      resizeFallback();
      window.addEventListener("resize", resizeFallback);
      return () => window.removeEventListener("resize", resizeFallback);
    }

    const program = createProgram(gl);
    if (!program) {
      const paintSolid = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
        canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.02, 0.02, 0.022, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
      };
      paintSolid();
      window.addEventListener("resize", paintSolid);
      return () => window.removeEventListener("resize", paintSolid);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "a_pos");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uGrain = gl.getUniformLocation(program, "u_grain");

    gl.useProgram(program);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let t0 = performance.now();
    let frozenTime = 0;

    const grainForSize = () => {
      // Slightly less grain on dense/mobile displays
      const short = Math.min(w, h);
      return short < 700 ? 0.035 : 0.048;
    };

    const render = (timeSec: number) => {
      gl.uniform1f(uTime, timeSec);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uGrain, grainForSize());
      if (prefersReduced.matches) {
        render(0);
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      const t = (now - t0) * 0.001;
      frozenTime = t;
      render(t);
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
        return;
      }
      if (prefersReduced.matches) return;
      running = true;
      t0 = performance.now() - frozenTime * 1000;
      raf = requestAnimationFrame(draw);
    };

    resize();

    if (!prefersReduced.matches) {
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Animated silk light folds"
      role="img"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
