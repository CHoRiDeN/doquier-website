"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Soft champagne light pools drifting over near-black.
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
float blob(vec2 uv, vec2 c, float s){ return exp(-dot(uv - c, uv - c) / s); }
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  uv.x *= r.x / r.y;
  float a = r.x / r.y;
  vec2 c1 = vec2(a * (0.5 + 0.28 * sin(t * 0.21)), 0.18 + 0.1 * cos(t * 0.17));
  vec2 c2 = vec2(a * (0.3 + 0.2 * cos(t * 0.13)), 0.05 + 0.12 * sin(t * 0.19));
  vec2 c3 = vec2(a * (0.75 + 0.18 * sin(t * 0.11 + 2.0)), 0.1 + 0.1 * sin(t * 0.23));
  vec3 warm = vec3(0.765, 0.722, 0.659);
  vec3 deep = vec3(0.42, 0.33, 0.26);
  vec3 col = vec3(0.039, 0.039, 0.043);
  col += warm * blob(uv, c1, 0.09) * 0.55;
  col += deep * blob(uv, c2, 0.12) * 0.6;
  col += warm * blob(uv, c3, 0.06) * 0.35;
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * Low-resolution WebGL mesh gradient. Renders at a fraction of the display size
 * (it's all soft light, so upscaling is invisible) and only while on screen.
 */
export function MeshGradient({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false, alpha: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "r");
    const uTime = gl.getUniformLocation(program, "t");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const resize = () => {
      const scale = 0.35;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
