"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLORS = [0xff9933, 0xffffff, 0x138808, 0x000080];

export default function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 30;

    const COUNT = 2000;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.01 + Math.random() * 0.03;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let frame: number;
    let t = 0;

    function animate() {
      frame = requestAnimationFrame(animate);
      t += 0.005;

      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 30) pos[i * 3 + 1] = -30;
      }
      geo.attributes.position.needsUpdate = true;

      points.rotation.y = t * 0.05;
      points.rotation.x = Math.sin(t * 0.1) * 0.1;

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
