(function () {
  "use strict";

  function createGlowTexture(innerColor, midColor) {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.35, midColor);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createRoseWindowTexture() {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;

    ctx.fillStyle = "#080f1d";
    ctx.fillRect(0, 0, size, size);

    // Outer luminous backing
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 240);
    bgGrad.addColorStop(0, "rgba(255, 226, 150, 0.95)");
    bgGrad.addColorStop(0.45, "rgba(197, 155, 77, 0.7)");
    bgGrad.addColorStop(0.75, "rgba(56, 98, 178, 0.75)");
    bgGrad.addColorStop(1, "rgba(15, 26, 46, 0.2)");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 242, 0, Math.PI * 2);
    ctx.fill();

    // Stained glass radial petals (16-fold Gothic rose tracery)
    const petals = 16;
    const palette = ["#2a58a8", "#9e2a3b", "#d9a94e", "#1e7a78"];
    for (let ring = 0; ring < 3; ring++) {
      const rInner = 42 + ring * 64;
      const rOuter = rInner + 56;
      for (let i = 0; i < petals; i++) {
        const a0 = (i / petals) * Math.PI * 2;
        const a1 = ((i + 0.86) / petals) * Math.PI * 2;
        ctx.fillStyle = palette[(i + ring) % palette.length];
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter, a0, a1);
        ctx.arc(cx, cy, rInner, a1, a0, true);
        ctx.closePath();
        ctx.fill();

        // Dark lead came lines
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#0a111e";
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }

    // Center medallion
    ctx.fillStyle = "#ffe5a3";
    ctx.beginPath();
    ctx.arc(cx, cy, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0a111e";
    ctx.lineWidth = 6;
    ctx.stroke();

    // Stone tracery rings
    [40, 104, 168, 236].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#09101d";
      ctx.lineWidth = 7;
      ctx.stroke();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  /* ==========================================================================
     1. Hero 3D Cathedral Nave, Rose Window & Sunbeams
     ========================================================================== */
  function initHeroSanctuary() {
    const container = document.getElementById("hero-three-container");
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1628, 0.032);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 620;
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 12);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch (e) {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.className = "hero__three-canvas";
    container.appendChild(renderer.domElement);

    const heroImg = container.parentElement?.querySelector(".hero__img");
    if (heroImg) heroImg.style.opacity = "0.45";

    // Ambient & Sanctuary Lighting
    scene.add(new THREE.AmbientLight(0x4b6594, 0.7));
    const roseLight = new THREE.PointLight(0xffcf77, 2.2, 42);
    roseLight.position.set(0, 6.2, -16);
    scene.add(roseLight);

    const altarLight = new THREE.PointLight(0xe6b560, 1.5, 25);
    altarLight.position.set(0, 1.5, -14);
    scene.add(altarLight);

    // Gothic Stone Archway Ribs receding toward the sanctuary
    const archGroup = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1d2b44,
      roughness: 0.85,
      metalness: 0.12
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xc59b4d,
      roughness: 0.35,
      metalness: 0.75
    });

    function createPointedArch() {
      const group = new THREE.Group();
      const leftCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-4.8, -2.5, 0),
        new THREE.Vector3(-4.6, 4.2, 0),
        new THREE.Vector3(0, 7.6, 0)
      );
      const rightCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(4.8, -2.5, 0),
        new THREE.Vector3(4.6, 4.2, 0),
        new THREE.Vector3(0, 7.6, 0)
      );
      const leftGeo = new THREE.TubeGeometry(leftCurve, 24, 0.18, 8, false);
      const rightGeo = new THREE.TubeGeometry(rightCurve, 24, 0.18, 8, false);

      group.add(new THREE.Mesh(leftGeo, stoneMat));
      group.add(new THREE.Mesh(rightGeo, stoneMat));

      // Tall Nave Columns
      const colGeo = new THREE.CylinderGeometry(0.24, 0.28, 7.5, 10);
      const leftCol = new THREE.Mesh(colGeo, stoneMat);
      leftCol.position.set(-4.8, -1.5, 0);
      const rightCol = new THREE.Mesh(colGeo, stoneMat);
      rightCol.position.set(4.8, -1.5, 0);
      group.add(leftCol, rightCol);

      return group;
    }

    for (let i = 0; i < 6; i++) {
      const arch = createPointedArch();
      arch.position.z = 6 - i * 4.2;
      archGroup.add(arch);
    }
    scene.add(archGroup);

    // Glowing Rose Window in the distant choir
    const roseTexture = createRoseWindowTexture();
    const roseGeo = new THREE.CircleGeometry(3.4, 48);
    const roseMat = new THREE.MeshBasicMaterial({
      map: roseTexture,
      transparent: true,
      opacity: 0.92
    });
    const roseMesh = new THREE.Mesh(roseGeo, roseMat);
    roseMesh.position.set(0, 5.2, -16.5);
    scene.add(roseMesh);

    // Rose Window Rim
    const rimGeo = new THREE.TorusGeometry(3.48, 0.14, 12, 48);
    const rimMesh = new THREE.Mesh(rimGeo, goldTrimMat);
    rimMesh.position.copy(roseMesh.position);
    scene.add(rimMesh);

    // Volumetric Sunbeams streaming diagonally down the nave
    const beamGroup = new THREE.Group();
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffd78a,
      transparent: true,
      opacity: 0.065,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 4; i++) {
      const coneGeo = new THREE.ConeGeometry(2.6 + i * 0.45, 22, 24, 1, true);
      const beam = new THREE.Mesh(coneGeo, beamMat.clone());
      beam.position.set(-2.5 + i * 1.7, 3.2, -9 + i * 3.2);
      beam.rotation.z = -0.34;
      beam.rotation.x = 0.36;
      beam.userData = { baseOpacity: 0.045 + (i % 2) * 0.02, phase: i * 1.3 };
      beamGroup.add(beam);
    }
    scene.add(beamGroup);

    // Floating Golden Incense / Dust Particles
    const particleCount = 260;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 10 - 2;
      positions[i * 3 + 2] = Math.random() * 24 - 16;
      speeds[i] = 0.004 + Math.random() * 0.009;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const moteTex = createGlowTexture("rgba(255, 238, 190, 1)", "rgba(197, 155, 77, 0.35)");
    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      map: moteTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax & Motion Toggle
    let targetX = 0;
    let targetY = 0;
    let isPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isVisible = true;

    const heroEl = container.closest(".hero");
    heroEl?.addEventListener("pointermove", (e) => {
      const rect = heroEl.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2.2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * -1.0;
    });

    const toggleBtn = document.getElementById("hero-3d-toggle");
    if (toggleBtn) {
      if (isPaused) toggleBtn.textContent = "3D Motion: Paused";
      toggleBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        toggleBtn.textContent = isPaused ? "3D Motion: Paused" : "3D Sanctuary: Live";
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    window.addEventListener("resize", () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      if (!isPaused) {
        // Gentle camera breathing + parallax
        camera.position.x += (targetX * 0.85 - camera.position.x) * 0.04;
        camera.position.y += (1.8 + targetY * 0.45 + Math.sin(t * 0.35) * 0.08 - camera.position.y) * 0.04;
        camera.lookAt(0, 3.2, -16);

        // Slow rotation of rose window light glow
        roseMesh.rotation.z = t * 0.025;

        // Breathing sunbeams
        beamGroup.children.forEach((beam) => {
          beam.material.opacity =
            beam.userData.baseOpacity + Math.sin(t * 0.8 + beam.userData.phase) * 0.015;
        });

        // Rising incense motes
        const posAttr = particleGeo.attributes.position;
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i) + speeds[i];
          const x = posAttr.getX(i) + Math.sin(t * 0.5 + i) * 0.0018;
          if (y > 8.5) y = -2.2;
          posAttr.setY(i, y);
          posAttr.setX(i, x);
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroSanctuary();
  });
})();
