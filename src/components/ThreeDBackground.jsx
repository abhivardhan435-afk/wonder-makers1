import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ThreeDBackground() {
  const canvasRef = useRef(null);
  const radialGlowRef = useRef(null);
  const scrollProgress = useRef({ value: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Golden ratio for icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    // 12 vertices of an icosahedron
    const rawVertices = [
      [-1,  phi,  0],
      [ 1,  phi,  0],
      [-1, -phi,  0],
      [ 1, -phi,  0],
      [ 0, -1,  phi],
      [ 0,  1,  phi],
      [ 0, -1, -phi],
      [ 0,  1, -phi],
      [ phi, 0, -1],
      [ phi, 0,  1],
      [-phi, 0, -1],
      [-phi, 0,  1],
    ];

    // Normalize vertices and scale
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x*x + y*y + z*z);
      return [x / len, y / len, z / len];
    });

    // Generate 30 edges based on distance
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const distSq = dx*dx + dy*dy + dz*dz;
        if (Math.abs(distSq - 1.1) < 0.1) {
          edges.push([i, j]);
        }
      }
    }

    // Scroll mapping using GSAP
    const trigger = gsap.to(scrollProgress.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    // Particles for immersed look (dust/micro-refractions)
    const numParticles = 35;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 - 1, // depth from -1 (far back) to 1 (near front)
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.25 + 0.08), // slow float upwards
        speedX: (Math.random() * 0.14 - 0.07),  // slow sideways drift
        opacity: Math.random() * 0.55 + 0.15,
        parallaxFactor: Math.random() * 0.75 + 0.25,
      });
    }

    const handleResize = () => {
      const prevWidth = width;
      const prevHeight = height;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Rescale particle positions so they don't jump on window resize
      particles.forEach(p => {
        p.x = (p.x / prevWidth) * width;
        p.y = (p.y / prevHeight) * height;
      });
    };
    window.addEventListener('resize', handleResize);

    // Initial rotation angles and theme tracking
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const cameraDist = 3.0;
    let currentGlowOpacity = document.documentElement.classList.contains('dark') ? 1.0 : 0.0;

    // Render loop
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isDark = document.documentElement.classList.contains('dark');

      // Smoothly LERP glow opacity based on active theme
      const targetGlowOpacity = isDark ? 1.0 : 0.0;
      currentGlowOpacity += (targetGlowOpacity - currentGlowOpacity) * 0.08;

      // Only scroll-linked rotation (no idle rotation, no mouse rotation)
      angleX = scrollProgress.current.value * Math.PI * 2.5;
      angleY = scrollProgress.current.value * Math.PI * 3.5;
      angleZ = scrollProgress.current.value * Math.PI * 1.5;

      // Responsive Size scale factor (larger on desktop, normalized on mobile)
      const focalLength = Math.min(width, height) * (width < 768 ? 0.78 : 0.92);

      // Fixed center projection (no mouse offset shift to keep the shape perfectly centered)
      const centerX = width / 2;
      const centerY = height / 2;

      // Cosine and Sine values for rotation
      const cx = Math.cos(angleX), sx = Math.sin(angleX);
      const cy = Math.cos(angleY), sy = Math.sin(angleY);
      const cz = Math.cos(angleZ), sz = Math.sin(angleZ);

      // Helper function to draw particles at a specific depth layer
      const drawParticles = (layer) => {
        particles.forEach((p) => {
          const isBackground = p.z < 0;
          if (layer === 'bg' && !isBackground) return;
          if (layer === 'fg' && isBackground) return;

          // Update position
          p.y += p.speedY;
          p.x += p.speedX;

          // Wrapping bounds
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.y > height + 20) p.y = -20;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          // Use particle positions directly (no cursor offset)
          const px = p.x;
          const py = p.y;

          // Calculate depth of field blur relative to focal plane (z = 0.2)
          const distFromFocus = Math.abs(p.z - 0.2);
          
          // Math-based DoF: far particles grow larger and become fainter, mimicking out-of-focus bokeh
          const sizeScale = 1 + distFromFocus * 2.8;
          const currentSize = p.size * sizeScale;

          const baseOpacity = isDark ? 0.38 : 0.65;
          const currentOpacity = (p.opacity * baseOpacity) / (1 + distFromFocus * 2.0);

          ctx.beginPath();
          ctx.arc(px, py, currentSize, 0, Math.PI * 2);

          const grad = ctx.createRadialGradient(px, py, 0, px, py, currentSize);
          if (isDark) {
            grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
            grad.addColorStop(0.35, `rgba(255, 45, 55, ${currentOpacity * 0.85})`);
            grad.addColorStop(1, 'rgba(255, 45, 55, 0)');
          } else {
            grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
            grad.addColorStop(0.35, `rgba(255, 45, 55, ${currentOpacity * 0.85})`);
            grad.addColorStop(1, 'rgba(255, 45, 55, 0)');
          }

          ctx.fillStyle = grad;
          ctx.fill();
        });
      };

      // Helper to draw a single edge
      const drawEdge = ({ p1, p2, avgZ }) => {
        const depthPct = (avgZ + 1.0) / 2.0; // 0 to 1
        
        const baseOpacity = isDark ? 0.60 : 0.85;
        const opacityRange = isDark ? 0.40 : 0.15;
        const opacity = baseOpacity + depthPct * opacityRange;

        const baseWidth = isDark ? 1.0 : 1.8;
        const widthRange = isDark ? 2.0 : 2.2;
        const lineWidth = baseWidth + depthPct * widthRange;

        // Draw solid bright red edge (no ambient glows, no metallic chrome shaders)
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = `rgba(255, 45, 55, ${opacity})`;
        ctx.stroke();
      };

      // Helper to draw a single node (vertex)
      const drawNode = (p) => {
        const depthPct = (p.z + 1.0) / 2.0;
        const radius = isDark ? (4.0 + depthPct * 4.5) : (4.5 + depthPct * 5.0);
        const baseOpacity = isDark ? 0.80 : 0.90;
        const opacityRange = isDark ? 0.20 : 0.10;
        const opacity = baseOpacity + depthPct * opacityRange;

        // Draw solid bright red node (no glows, no complex metallic gradients)
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 45, 55, ${opacity})`;
        ctx.fill();
      };

      // Helper to draw glowing core inside shape
      const drawGlowingCore = (cx, cy, focal) => {
        if (currentGlowOpacity < 0.01) return;

        // Pulse breathing effect based on timestamp
        const pulse = 1 + Math.sin(time * 0.003) * 0.08;
        const coreRadius = focal * 0.25 * pulse;
        
        // Layer 1: Outer soft ambient glow (wide, low opacity)
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 2.6, 0, Math.PI * 2);
        let grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.6);
        if (isDark) {
          grad.addColorStop(0, `rgba(255, 45, 55, ${0.28 * currentGlowOpacity})`);
          grad.addColorStop(0.5, `rgba(255, 45, 55, ${0.08 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(255, 45, 55, 0)');
        } else {
          grad.addColorStop(0, `rgba(225, 25, 38, ${0.25 * currentGlowOpacity})`);
          grad.addColorStop(0.5, `rgba(225, 25, 38, ${0.08 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(225, 25, 38, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Layer 2: Medium glow body (intense color)
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 1.3, 0, Math.PI * 2);
        grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 1.3);
        if (isDark) {
          grad.addColorStop(0, `rgba(255, 45, 55, ${0.55 * currentGlowOpacity})`);
          grad.addColorStop(0.3, `rgba(255, 45, 55, ${0.35 * currentGlowOpacity})`);
          grad.addColorStop(0.7, `rgba(255, 45, 55, ${0.12 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(255, 45, 55, 0)');
        } else {
          grad.addColorStop(0, `rgba(225, 25, 38, ${0.55 * currentGlowOpacity})`);
          grad.addColorStop(0.3, `rgba(225, 25, 38, ${0.35 * currentGlowOpacity})`);
          grad.addColorStop(0.7, `rgba(225, 25, 38, ${0.12 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(225, 25, 38, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Layer 3: Specular bright center core (white-hot center)
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 0.45, 0, Math.PI * 2);
        grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 0.45);
        if (isDark) {
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * currentGlowOpacity})`);
          grad.addColorStop(0.4, `rgba(255, 255, 255, ${0.80 * currentGlowOpacity})`);
          grad.addColorStop(0.8, `rgba(255, 45, 55, ${0.30 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(255, 45, 55, 0)');
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * currentGlowOpacity})`);
          grad.addColorStop(0.4, `rgba(255, 255, 255, ${0.75 * currentGlowOpacity})`);
          grad.addColorStop(0.8, `rgba(225, 25, 38, ${0.25 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(225, 25, 38, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();
      };

      // 1. Draw Background Particles (submerged deep behind shape)
      drawParticles('bg');

      // Rotate and project all vertices of the 3D shape
      const projected = vertices.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cy - z * sy;
        let z1 = x * sy + z * cy;
        let y1 = y;

        // Rotate X
        let y2 = y1 * cx - z1 * sx;
        let z2 = y1 * sx + z1 * cx;
        let x2 = x1;

        // Rotate Z
        let x3 = x2 * cz - y2 * sz;
        let y3 = x2 * sz + y2 * cz;
        let z3 = z2;

        // Perspective scale
        const scale = focalLength / (cameraDist - z3);
        const px = centerX + x3 * scale;
        const py = centerY + y3 * scale;

        return { x: px, y: py, z: z3 };
      });

      // Map edges to project depth for Painter's Algorithm sorting
      const edgeData = edges.map(([v1, v2]) => {
        const p1 = projected[v1];
        const p2 = projected[v2];
        const avgZ = (p1.z + p2.z) / 2;
        return { v1, v2, p1, p2, avgZ };
      });

      // Sort edges: draw furthest edges first, closest edges last
      edgeData.sort((a, b) => a.avgZ - b.avgZ);

      // 2. Draw furthest nodes (z < 0)
      projected.forEach((p) => {
        if (p.z < 0) drawNode(p);
      });

      // 3. Draw furthest edges (avgZ < 0)
      edgeData.forEach((edge) => {
        if (edge.avgZ < 0) drawEdge(edge);
      });

      // 4. Draw Glowing Center Core (z = 0) - Disabled to remove neon elements
      // drawGlowingCore(centerX, centerY, focalLength);

      // 5. Draw closest edges (avgZ >= 0)
      edgeData.forEach((edge) => {
        if (edge.avgZ >= 0) drawEdge(edge);
      });

      // 6. Draw closest nodes (z >= 0)
      projected.forEach((p) => {
        if (p.z >= 0) drawNode(p);
      });

      // 7. Draw Foreground Particles (floating in front of the shape)
      drawParticles('fg');

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (trigger.scrollTrigger) {
        trigger.scrollTrigger.kill();
      }
      trigger.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden select-none">
      {/* Background Radial Glow Layer */}
      <div 
        ref={radialGlowRef}
        className="absolute inset-0 radial-mesh opacity-40 dark:opacity-30 mix-blend-screen dark:mix-blend-normal transition-theme duration-700" 
      />
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-100 dark:opacity-95 transition-opacity duration-700"
      />
    </div>
  );
}
