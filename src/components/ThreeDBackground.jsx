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

    // Golden ratio for coordinates construction
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [];

    // Helper to add cyclic permutations of a coordinate set
    const addCyclicPermutations = (x, y, z) => {
      rawVertices.push([x, y, z]);
      rawVertices.push([y, z, x]);
      rawVertices.push([z, x, y]);
    };

    // Construct the 60 vertices of a truncated icosahedron
    const signs = [-1, 1];
    
    // 1. All cyclic permutations of (0, +-1, +-3*phi)
    for (let s1 of signs) {
      for (let s2 of signs) {
        addCyclicPermutations(0, s1, s2 * 3 * phi);
      }
    }

    // 2. All cyclic permutations of (+-1, +-(2 + phi), +-2*phi)
    for (let s1 of signs) {
      for (let s2 of signs) {
        for (let s3 of signs) {
          addCyclicPermutations(s1, s2 * (2 + phi), s3 * 2 * phi);
        }
      }
    }

    // 3. All cyclic permutations of (+-phi, +-2, +-(2*phi + 1))
    for (let s1 of signs) {
      for (let s2 of signs) {
        for (let s3 of signs) {
          addCyclicPermutations(s1 * phi, s2 * 2, s3 * (2 * phi + 1));
        }
      }
    }

    // Normalize vertices to project onto a unit sphere
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x*x + y*y + z*z);
      return [x / len, y / len, z / len];
    });

    // Generate 90 edges based on uniform edge distance (distSq around 0.1628)
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const distSq = dx*dx + dy*dy + dz*dz;
        if (Math.abs(distSq - 0.1628) < 0.02) {
          edges.push([i, j]);
        }
      }
    }

    // Neighbors adjacency list for cycle discovery
    const neighbors = Array.from({ length: 60 }, () => []);
    edges.forEach(([u, v]) => {
      neighbors[u].push(v);
      neighbors[v].push(u);
    });

    // Helper to find shortest path using BFS avoiding a node
    function findShortestPath(start, target, avoid) {
      const queue = [[start, [start]]];
      const visited = new Set([start, avoid]);

      while (queue.length > 0) {
        const [curr, path] = queue.shift();
        if (curr === target) return path;

        for (let n of neighbors[curr]) {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push([n, [...path, n]]);
          }
        }
      }
      return null;
    }

    // Generate 32 faces (12 pentagons and 20 hexagons) dynamically using BFS cycles
    const faces = [];
    const faceKeys = new Set();

    for (let i = 0; i < 60; i++) {
      const nbs = neighbors[i];
      if (nbs.length >= 3) {
        const pairs = [
          [nbs[0], nbs[1]],
          [nbs[1], nbs[2]],
          [nbs[2], nbs[0]]
        ];

        pairs.forEach(([j, k]) => {
          const path = findShortestPath(k, j, i);
          if (path) {
            const cycle = [i, ...path];
            const key = [...cycle].sort((a, b) => a - b).join(',');
            if (!faceKeys.has(key)) {
              faceKeys.add(key);
              faces.push(cycle);
            }
          }
        });
      }
    }

    // Generate 128x128 noise pattern canvas programmatically
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const noiseCtx = noiseCanvas.getContext('2d');
    const noiseData = noiseCtx.createImageData(128, 128);
    const d = noiseData.data;
    for (let i = 0; i < d.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      d[i] = val;
      d[i+1] = val;
      d[i+2] = val;
      d[i+3] = 255;
    }
    noiseCtx.putImageData(noiseData, 0, 0);
    const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

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



    // Mouse movement tracking for particle parallax
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentMouseX = mouseX;
    let currentMouseY = mouseY;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

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
        colorType: Math.random() > 0.5 ? 'white' : 'pink'
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

      // Smoothly LERP glow opacity (always active for red neon theme)
      const targetGlowOpacity = 1.0;
      currentGlowOpacity += (targetGlowOpacity - currentGlowOpacity) * 0.08;

      // Only scroll-linked rotation (no idle rotation, no mouse rotation)
      angleX = scrollProgress.current.value * Math.PI * 2.5;
      angleY = scrollProgress.current.value * Math.PI * 3.5;
      angleZ = scrollProgress.current.value * Math.PI * 1.5;

      // Responsive Size scale factor (larger on desktop, normalized on mobile)
      const focalLength = Math.min(width, height) * (width < 768 ? 0.78 : 0.92);

      // Smooth mouse interpolation for dust particles parallax
      currentMouseX += (mouseX - currentMouseX) * 0.05;
      currentMouseY += (mouseY - currentMouseY) * 0.05;

      const mouseOffsetX = (currentMouseX - width / 2) * 0.05;
      const mouseOffsetY = (currentMouseY - height / 2) * 0.05;
      const scrollOffset = scrollProgress.current.value * -80; // Slow upward drift

      // Fixed center projection with Scroll Y-Parallax
      const centerX = width / 2;
      const centerY = (height / 2) + (scrollProgress.current.value - 0.5) * -160;

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

          // Project with mouse and scroll parallax
          const px = p.x + mouseOffsetX * p.parallaxFactor;
          const py = p.y + (mouseOffsetY + scrollOffset) * p.parallaxFactor;

          // Calculate depth of field blur relative to focal plane (z = 0.2)
          const distFromFocus = Math.abs(p.z - 0.2);
          
          // Math-based DoF: far particles grow larger and become fainter, mimicking out-of-focus bokeh
          const sizeScale = 1 + distFromFocus * 2.8;
          const currentSize = p.size * sizeScale;

          if (!isDark) {
            // Light Mode: Ambient white/pale-pink blurred dust particles
            const baseOpacity = 0.55;
            const currentOpacity = (p.opacity * baseOpacity) / (1 + distFromFocus * 2.0);

            ctx.beginPath();
            ctx.arc(px, py, currentSize, 0, Math.PI * 2);

            const grad = ctx.createRadialGradient(px, py, 0, px, py, currentSize);
            if (p.colorType === 'white') {
              grad.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
              grad.addColorStop(0.4, `rgba(255, 255, 255, ${currentOpacity * 0.7})`);
              grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            } else {
              grad.addColorStop(0, `rgba(255, 210, 220, ${currentOpacity})`);
              grad.addColorStop(0.4, `rgba(255, 180, 195, ${currentOpacity * 0.6})`);
              grad.addColorStop(1, 'rgba(255, 180, 195, 0)');
            }
            ctx.fillStyle = grad;
            ctx.fill();
          } else {
            // Dark Mode: Glowing saturated neon-red particles
            const baseOpacity = 0.38;
            const currentOpacity = (p.opacity * baseOpacity) / (1 + distFromFocus * 2.0);

            ctx.beginPath();
            ctx.arc(px, py, currentSize, 0, Math.PI * 2);

            const grad = ctx.createRadialGradient(px, py, 0, px, py, currentSize);
            grad.addColorStop(0, isDark ? `rgba(255, 255, 255, ${currentOpacity})` : `rgba(255, 45, 55, ${currentOpacity})`);
            grad.addColorStop(0.35, isDark ? `rgba(255, 45, 55, ${currentOpacity * 0.85})` : `rgba(255, 90, 100, ${currentOpacity * 0.95})`);
            grad.addColorStop(1, 'rgba(255, 45, 55, 0)');

            ctx.fillStyle = grad;
            ctx.fill();
          }
        });
      };

      // Helper to draw a single glass face (pentagon or hexagon)
      const drawFace = ({ points, avgZ }) => {
        const depthPct = (avgZ + 1.0) / 2.0; // 0 to 1
        const baseOpacity = isDark ? 0.35 : 0.65;
        const opacity = (0.2 + depthPct * 0.8) * baseOpacity;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        // Calculate centroid
        let sumX = 0;
        let sumY = 0;
        points.forEach(p => {
          sumX += p.x;
          sumY += p.y;
        });
        const cx = sumX / points.length;
        const cy = sumY / points.length;

        // Calculate radius as max distance from center to any point
        let maxDistSq = 0;
        points.forEach(p => {
          const distSq = Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2);
          if (distSq > maxDistSq) maxDistSq = distSq;
        });
        const r = Math.sqrt(maxDistSq) * 1.5;

        // Shift light source slightly top-left
        const lx = cx - r * 0.3;
        const ly = cy - r * 0.3;

        const radGrad = ctx.createRadialGradient(lx, ly, r * 0.1, cx, cy, r);
        if (isDark) {
          radGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`); // white reflection highlight
          radGrad.addColorStop(0.3, `rgba(255, 45, 55, ${opacity * 0.1})`);  // faint red body tint
          radGrad.addColorStop(1, `rgba(255, 45, 55, ${opacity * 0.22})`);  // edge refraction glow
        } else {
          radGrad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.6})`); // strong white reflection highlight
          radGrad.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.25})`); // clean white glass body
          radGrad.addColorStop(0.8, `rgba(255, 45, 55, ${opacity * 0.12})`);  // soft neon red refraction tint
          radGrad.addColorStop(1, `rgba(255, 45, 55, ${opacity * 0.25})`);  // edge refraction border glow
        }
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Stroke thin crystal highlight borders
        ctx.lineWidth = isDark ? 0.6 : 0.8;
        ctx.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${opacity * 0.18})`
          : `rgba(255, 255, 255, ${opacity * 0.45})`;
        ctx.stroke();
      };

      // Helper to draw a single edge
      const drawEdge = ({ p1, p2, avgZ }) => {
        const depthPct = (avgZ + 1.0) / 2.0; // 0 to 1
        
        const baseOpacity = isDark ? 0.38 : 0.55;
        const opacityRange = isDark ? 0.22 : 0.15;
        const opacity = baseOpacity + depthPct * opacityRange;

        const baseWidth = isDark ? 0.8 : 1.4;
        const widthRange = isDark ? 1.5 : 1.8;
        const lineWidth = baseWidth + depthPct * widthRange;

        // Stroke 1: Ambient Reflection / Outer Glow (Wide & vibrant glow halo) - both modes (neon)
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth + 2.5; // Subtler glow width
        ctx.strokeStyle = isDark 
          ? `rgba(255, 45, 55, ${opacity * 0.20})` 
          : `rgba(255, 45, 55, ${opacity * 0.40})`;
        ctx.stroke();

        // Stroke 2: Metallic Chrome Body (Linear gradient with terminator line)
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        if (isDark) {
          // Neon red reflective metallic body for dark mode
          grad.addColorStop(0, `rgba(45, 5, 6, ${opacity * 0.6})`);
          grad.addColorStop(0.22, `rgba(255, 45, 55, ${opacity * 0.8})`);
          grad.addColorStop(0.45, `rgba(255, 120, 130, ${opacity * 0.8})`); // Specular neon highlight
          grad.addColorStop(0.55, `rgba(25, 2, 3, ${opacity * 0.6})`); // Horizon terminator line
          grad.addColorStop(0.78, `rgba(255, 45, 55, ${opacity * 0.8})`);
          grad.addColorStop(1, `rgba(45, 5, 6, ${opacity * 0.6})`);
        } else {
          // Lighter neon red reflective metallic body for light mode (increased luminance)
          grad.addColorStop(0, `rgba(70, 6, 8, ${opacity * 0.70})`);
          grad.addColorStop(0.22, `rgba(255, 45, 55, ${opacity * 0.85})`);
          grad.addColorStop(0.45, `rgba(255, 180, 190, ${opacity * 0.90})`); // Specular highlight
          grad.addColorStop(0.55, `rgba(35, 3, 4, ${opacity * 0.70})`); // Horizon terminator line
          grad.addColorStop(0.78, `rgba(255, 45, 55, ${opacity * 0.85})`);
          grad.addColorStop(1, `rgba(70, 6, 8, ${opacity * 0.70})`);
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth + 0.5;
        ctx.strokeStyle = grad;
        ctx.stroke();

        // Stroke 3: Specular core line (Ultra-thin reflect line)
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = lineWidth * 0.28;
        ctx.strokeStyle = isDark 
          ? `rgba(255, 60, 65, ${opacity * 0.85})` // Neon red core line
          : `rgba(255, 80, 85, ${opacity * 0.75})`;
        ctx.stroke();
      };

      // Helper to draw a single node (vertex)
      const drawNode = (p) => {
        const depthPct = (p.z + 1.0) / 2.0;
        const radius = isDark ? (3.2 + depthPct * 3.8) : (3.6 + depthPct * 4.2); // Reduced node sizes slightly
        const baseOpacity = isDark ? 0.50 : 0.65;
        const opacityRange = isDark ? 0.15 : 0.10;
        const opacity = baseOpacity + depthPct * opacityRange;

        // Draw soft ambient vector glow behind node - both modes (neon)
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3.5, 0, Math.PI * 2); // Increased node glow radius for glowing end points
        const nodeGlowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3.5);
        nodeGlowGrad.addColorStop(0, isDark ? `rgba(255, 45, 55, ${opacity * 0.50})` : `rgba(255, 45, 55, ${opacity * 0.60})`);
        nodeGlowGrad.addColorStop(0.35, isDark ? `rgba(255, 45, 55, ${opacity * 0.18})` : `rgba(255, 45, 55, ${opacity * 0.26})`);
        nodeGlowGrad.addColorStop(1, 'rgba(255, 45, 55, 0)');
        ctx.fillStyle = nodeGlowGrad;
        ctx.fill();

        // Draw metallic chrome node
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        // Shift radial gradient center slightly top-left for glossy light source offset
        const radGrad = ctx.createRadialGradient(
          p.x - radius * 0.28, p.y - radius * 0.28, radius * 0.05,
          p.x, p.y, radius
        );
        
        if (isDark) {
          radGrad.addColorStop(0, `rgba(255, 120, 130, ${opacity * 0.95})`); // Neon red core highlight
          radGrad.addColorStop(0.15, `rgba(255, 60, 70, ${opacity * 0.95})`); // Neon red rim
          radGrad.addColorStop(0.35, `rgba(255, 45, 55, ${opacity * 0.8})`); // bright red body
          radGrad.addColorStop(0.55, `rgba(40, 5, 6, ${opacity * 0.8})`); // dark horizon reflection terminator
          radGrad.addColorStop(0.8, `rgba(255, 100, 110, ${opacity * 0.7})`); // bounce reflection
          radGrad.addColorStop(1, `rgba(20, 2, 3, ${opacity * 0.85})`); // deep shadow edge
        } else {
          // Neon red chrome node for light mode
          radGrad.addColorStop(0, `rgba(255, 200, 205, ${opacity * 0.95})`); // core highlight
          radGrad.addColorStop(0.15, `rgba(255, 120, 130, ${opacity * 0.95})`); // rim
          radGrad.addColorStop(0.35, `rgba(255, 45, 55, ${opacity * 0.85})`); // bright red body
          radGrad.addColorStop(0.55, `rgba(40, 5, 6, ${opacity * 0.75})`); // horizon reflection
          radGrad.addColorStop(0.8, `rgba(255, 140, 150, ${opacity * 0.8})`); // bounce reflection
          radGrad.addColorStop(1, `rgba(30, 3, 4, ${opacity * 0.8})`); // deep shadow
        }

        ctx.fillStyle = radGrad;
        ctx.fill();
      };

      // Helper to draw glowing core or refractive glass sphere inside shape
      const drawGlowingCore = (cx, cy, focal) => {
        if (currentGlowOpacity < 0.01) return;

        if (isDark) {
          // Pulse breathing effect based on timestamp in Dark Mode
          const pulse = 1 + Math.sin(time * 0.003) * 0.08;
          const coreRadius = focal * 0.25 * pulse;
          
          ctx.beginPath();
          ctx.arc(cx, cy, coreRadius * 2.8, 0, Math.PI * 2);
          let grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.8);
          
          grad.addColorStop(0, `rgba(255, 255, 255, ${1.0 * currentGlowOpacity})`);
          grad.addColorStop(0.08, `rgba(255, 240, 200, ${0.92 * currentGlowOpacity})`);
          grad.addColorStop(0.18, `rgba(255, 150, 50, ${0.78 * currentGlowOpacity})`);
          grad.addColorStop(0.32, `rgba(255, 45, 55, ${0.58 * currentGlowOpacity})`);
          grad.addColorStop(0.55, `rgba(200, 20, 30, ${0.28 * currentGlowOpacity})`);
          grad.addColorStop(0.80, `rgba(130, 5, 10, ${0.08 * currentGlowOpacity})`);
          grad.addColorStop(1, 'rgba(130, 5, 10, 0)');
          
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // Refractive Glass Sphere in Light Mode
          const sphereRadius = focal * 0.16;

          // 1. Ambient soft back glow
          ctx.beginPath();
          ctx.arc(cx, cy, sphereRadius * 1.5, 0, Math.PI * 2);
          const outerGlow = ctx.createRadialGradient(cx, cy, sphereRadius * 0.9, cx, cy, sphereRadius * 1.5);
          outerGlow.addColorStop(0, 'rgba(255, 45, 55, 0.08)');
          outerGlow.addColorStop(1, 'rgba(255, 45, 55, 0)');
          ctx.fillStyle = outerGlow;
          ctx.fill();

          // 2. Main Glass Body (Refractive transparency + volume shadow)
          ctx.beginPath();
          ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
          const bodyGrad = ctx.createRadialGradient(
            cx - sphereRadius * 0.15, cy - sphereRadius * 0.15, sphereRadius * 0.1,
            cx, cy, sphereRadius
          );
          bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');      // Light passing straight through
          bodyGrad.addColorStop(0.5, 'rgba(255, 240, 242, 0.25)');    // Glass body volume
          bodyGrad.addColorStop(0.85, 'rgba(255, 210, 215, 0.12)');   // Refracted pink tint
          bodyGrad.addColorStop(1, 'rgba(255, 180, 185, 0.35)');     // Thick dark edge reflection
          ctx.fillStyle = bodyGrad;
          ctx.fill();

          // 3. Bottom-Right Caustic Focus (Focused light on opposite side)
          ctx.beginPath();
          ctx.arc(cx + sphereRadius * 0.35, cy + sphereRadius * 0.35, sphereRadius * 0.45, 0, Math.PI * 2);
          const causticGrad = ctx.createRadialGradient(
            cx + sphereRadius * 0.4, cy + sphereRadius * 0.4, 0,
            cx + sphereRadius * 0.35, cy + sphereRadius * 0.35, sphereRadius * 0.45
          );
          causticGrad.addColorStop(0, 'rgba(255, 120, 135, 0.45)');   // Sharp bright caustic focus
          causticGrad.addColorStop(0.3, 'rgba(255, 45, 55, 0.18)');   // Soft caustic spill
          causticGrad.addColorStop(1, 'rgba(255, 45, 55, 0)');
          ctx.fillStyle = causticGrad;
          ctx.fill();

          // 4. Horizon Terminator Curve (Curved reflection inside sphere)
          ctx.beginPath();
          ctx.arc(cx, cy + sphereRadius * 0.15, sphereRadius * 0.95, 0.15 * Math.PI, 0.85 * Math.PI, false);
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.stroke();

          // 5. Fresnel Inner Rim reflection (White border highlight)
          ctx.beginPath();
          ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
          const rimGrad = ctx.createRadialGradient(cx, cy, sphereRadius * 0.78, cx, cy, sphereRadius);
          rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          rimGrad.addColorStop(0.85, 'rgba(255, 255, 255, 0.18)');
          rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.65)');       // Bright white halo edge
          ctx.fillStyle = rimGrad;
          ctx.fill();

          // 6. Chromatic Aberration Rim (Fringe dispersion)
          ctx.beginPath();
          ctx.arc(cx - 0.8, cy - 0.8, sphereRadius, 0, Math.PI * 2);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = 'rgba(0, 220, 255, 0.38)';                // Cyan fringe
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx + 0.8, cy + 0.8, sphereRadius, 0, Math.PI * 2);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = 'rgba(255, 45, 55, 0.38)';                // Red/pink fringe
          ctx.stroke();

          // 7. Primary Specular Highlight (Sharp top-left glare)
          ctx.beginPath();
          ctx.arc(cx - sphereRadius * 0.38, cy - sphereRadius * 0.38, sphereRadius * 0.22, 0, Math.PI * 2);
          const specularGrad = ctx.createRadialGradient(
            cx - sphereRadius * 0.44, cy - sphereRadius * 0.44, 0,
            cx - sphereRadius * 0.38, cy - sphereRadius * 0.38, sphereRadius * 0.22
          );
          specularGrad.addColorStop(0, 'rgba(255, 255, 255, 0.90)');   // Glare core
          specularGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.50)');  // Specular body
          specularGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = specularGrad;
          ctx.fill();

          // 8. Secondary Pinpoint Specular Highlight (Sharp tiny glare reflection)
          ctx.beginPath();
          ctx.arc(cx - sphereRadius * 0.15, cy - sphereRadius * 0.45, sphereRadius * 0.08, 0, Math.PI * 2);
          const pinGrad = ctx.createRadialGradient(
            cx - sphereRadius * 0.17, cy - sphereRadius * 0.47, 0,
            cx - sphereRadius * 0.15, cy - sphereRadius * 0.45, sphereRadius * 0.08
          );
          pinGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
          pinGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = pinGrad;
          ctx.fill();

          // 9. Sharp Crystal Outline (Outer border)
          ctx.beginPath();
          ctx.arc(cx, cy, sphereRadius, 0, Math.PI * 2);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.stroke();
        }
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

      // Map faces to project depth for Painter's Algorithm sorting
      const faceData = faces.map((vertexIndices) => {
        const points = vertexIndices.map(idx => projected[idx]);
        let sumZ = 0;
        points.forEach(p => {
          sumZ += p.z;
        });
        const avgZ = sumZ / points.length;
        return { points, avgZ };
      });

      // Sort edges and faces: draw furthest first, closest last
      edgeData.sort((a, b) => a.avgZ - b.avgZ);
      faceData.sort((a, b) => a.avgZ - b.avgZ);

      // 1.5 Draw furthest faces (avgZ < 0)
      faceData.forEach((face) => {
        if (face.avgZ < 0) drawFace(face);
      });

      // 2. Draw furthest nodes (z < 0)
      projected.forEach((p) => {
        if (p.z < 0) drawNode(p);
      });

      // 3. Draw furthest edges (avgZ < 0)
      edgeData.forEach((edge) => {
        if (edge.avgZ < 0) drawEdge(edge);
      });

      // 4. Draw Glowing Center Core (z = 0)
      drawGlowingCore(centerX, centerY, focalLength);

      // 4.5 Draw closest faces (avgZ >= 0)
      faceData.forEach((face) => {
        if (face.avgZ >= 0) drawFace(face);
      });

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

      // 8. Shimmering Tactile Grain Overlay
      ctx.save();
      ctx.globalAlpha = isDark ? 0.022 : 0.045; // Subtly transparent grain overlay
      ctx.globalCompositeOperation = 'source-over';
      const noiseOffsetX = Math.floor(Math.random() * 128);
      const noiseOffsetY = Math.floor(Math.random() * 128);
      ctx.translate(noiseOffsetX, noiseOffsetY);
      ctx.fillStyle = noisePattern;
      ctx.fillRect(-128, -128, width + 128, height + 128);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

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
        className="absolute inset-0 radial-mesh opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-normal transition-theme duration-700" 
      />

      {/* Corner Gradient Mesh in Light Mode */}
      <div className="absolute inset-0 corner-mesh-tr opacity-100 dark:opacity-0 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute inset-0 corner-mesh-bl opacity-100 dark:opacity-0 transition-opacity duration-700 pointer-events-none" />



      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-100 dark:opacity-95 transition-opacity duration-700"
      />
    </div>
  );
}
