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

  /* ==========================================================================
     2. Interactive 3D Virtual Votive Candle Stand
     ========================================================================== */
  function initCandleChapel(initialIntentions) {
    const container = document.getElementById("candles-three-container");
    const tooltip = document.getElementById("candle-3d-tooltip");
    if (!container || !window.THREE) return null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09111f);
    scene.fog = new THREE.FogExp2(0x09111f, 0.075);

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(0, 2.35, 6.4);
    camera.lookAt(0, 1.15, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch (e) {
      return null;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.className = "candles__three-canvas";
    container.appendChild(renderer.domElement);

    // Hide fallback static image once WebGL renders cleanly
    const fallbackImg = container.querySelector(".candle-fallback-img");
    if (fallbackImg) fallbackImg.style.display = "none";

    // Chapel Ambient & Stone Lighting
    scene.add(new THREE.AmbientLight(0x283858, 0.85));
    const rimSpot = new THREE.DirectionalLight(0x88aadd, 0.55);
    rimSpot.position.set(-4, 6, 4);
    scene.add(rimSpot);

    // Warm cluster light from the votive rack
    const warmRackLight = new THREE.PointLight(0xffb55a, 2.4, 14);
    warmRackLight.position.set(0, 2.1, 1.4);
    scene.add(warmRackLight);

    const standGroup = new THREE.Group();
    scene.add(standGroup);

    const ironMat = new THREE.MeshStandardMaterial({
      color: 0x1b2028,
      roughness: 0.55,
      metalness: 0.78
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc59b4d,
      roughness: 0.3,
      metalness: 0.88
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xd98e3a,
      roughness: 0.18,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72
    });
    const waxMat = new THREE.MeshStandardMaterial({
      color: 0xf7eed7,
      roughness: 0.6
    });

    // Stone Pedestal Floor
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.4, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x121a2a, roughness: 0.9 })
    );
    floor.position.y = -0.35;
    standGroup.add(floor);

    // Wrought Iron Side Uprights & Crossbars (3 ascending tiers)
    [-2.15, 2.15].forEach((x) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 2.75, 10), ironMat);
      post.position.set(x, 1.0, -0.2);
      standGroup.add(post);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), brassMat);
      finial.position.set(x, 2.42, -0.2);
      standGroup.add(finial);
    });

    // Brass Cross atop the stand
    const crossVert = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.62, 0.08), brassMat);
    crossVert.position.set(0, 2.55, -0.55);
    const crossHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), brassMat);
    crossHoriz.position.set(0, 2.68, -0.55);
    standGroup.add(crossVert, crossHoriz);

    const tiers = [
      { y: 0.55, z: 0.65 },
      { y: 1.15, z: 0.05 },
      { y: 1.75, z: -0.55 }
    ];
    const cols = [-1.65, -0.99, -0.33, 0.33, 0.99, 1.65];

    const haloTex = createGlowTexture("rgba(255, 232, 156, 0.95)", "rgba(245, 152, 45, 0.3)");
    const candleSlots = [];
    const clickableMeshes = [];

    tiers.forEach((tier, rowIdx) => {
      // Tier iron bar & tray
      const bar = new THREE.Mesh(new THREE.BoxGeometry(4.35, 0.06, 0.42), ironMat);
      bar.position.set(0, tier.y - 0.18, tier.z);
      standGroup.add(bar);

      cols.forEach((x, colIdx) => {
        const idx = rowIdx * cols.length + colIdx;
        const candleGroup = new THREE.Group();
        candleGroup.position.set(x, tier.y, tier.z);

        // Brass cup saucer
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.04, 16), brassMat);
        saucer.position.y = -0.14;
        candleGroup.add(saucer);

        // Amber glass votive cup
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.32, 16, 1, true), glassMat);
        glass.position.y = 0.04;
        candleGroup.add(glass);

        // Wax core
        const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.105, 0.22, 14), waxMat);
        wax.position.y = -0.01;
        candleGroup.add(wax);

        // Flame mesh
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe49e });
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.15, 10), flameMat);
        flame.position.y = 0.2;
        candleGroup.add(flame);

        // Additive glow sprite
        const haloMat = new THREE.SpriteMaterial({
          map: haloTex,
          color: 0xffbe55,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const halo = new THREE.Sprite(haloMat);
        halo.scale.set(0.72, 0.72, 1);
        halo.position.y = 0.22;
        candleGroup.add(halo);

        // Invisible hit cylinder for easy raycasting
        const hitTarget = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 0.55, 8),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        hitTarget.position.y = 0.08;
        hitTarget.userData = { slotIndex: idx };
        candleGroup.add(hitTarget);
        clickableMeshes.push(hitTarget);

        // First 12 candles start lit
        const isLit = idx < 12;
        flame.visible = isLit;
        halo.visible = isLit;

        const defaultIntention =
          initialIntentions[idx % initialIntentions.length] || {
            name: "Cathedral Pilgrim",
            intention: "Praying for peace, strength, and gratitude.",
            time: "Burning today"
          };

        candleSlots.push({
          idx,
          group: candleGroup,
          flame,
          halo,
          lit: isLit,
          phase: Math.random() * Math.PI * 2,
          scalePulse: isLit ? 1 : 0,
          meta: isLit
            ? defaultIntention
            : { name: "Unlit Votive", intention: "Submit a prayer intention or click to light this candle.", time: "Available" }
        });

        standGroup.add(candleGroup);
      });
    });

    // Spark burst particles when a new candle lights
    const sparkCount = 48;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.14,
      map: haloTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    standGroup.add(sparks);
    let sparkLife = 0;
    let sparkOrigin = new THREE.Vector3();

    function triggerSparks(worldLocalPos) {
      sparkOrigin.copy(worldLocalPos);
      sparkLife = 1.0;
      const arr = sparkGeo.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        arr[i * 3] = sparkOrigin.x + (Math.random() - 0.5) * 0.25;
        arr[i * 3 + 1] = sparkOrigin.y + 0.18 + Math.random() * 0.15;
        arr[i * 3 + 2] = sparkOrigin.z + (Math.random() - 0.5) * 0.25;
      }
      sparkGeo.attributes.position.needsUpdate = true;
    }

    function lightSlot(slot, name, intention) {
      slot.lit = true;
      slot.flame.visible = true;
      slot.halo.visible = true;
      slot.scalePulse = 0.05;
      slot.meta = { name, intention, time: "Just lit" };
      triggerSparks(slot.group.position);
    }

    // Orbit Drag + Raycasting Click
    let isDragging = false;
    let dragDistance = 0;
    let prevX = 0;
    let targetYaw = 0;
    let currentYaw = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", (e) => {
      isDragging = true;
      dragDistance = 0;
      prevX = e.clientX;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      dragDistance += Math.abs(dx);
      targetYaw = Math.max(-0.55, Math.min(0.55, targetYaw + dx * 0.006));
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    dom.addEventListener("click", (e) => {
      if (dragDistance > 6) return;
      const rect = dom.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes);
      if (!hits.length) {
        if (tooltip) tooltip.classList.remove("is-visible");
        return;
      }

      const slot = candleSlots[hits[0].object.userData.slotIndex];
      if (!slot) return;

      if (!slot.lit) {
        lightSlot(slot, "Silent Prayer", "Lit silently in the 3D Votive Chapel.");
        const countEl = document.getElementById("candle-count");
        if (countEl) {
          const cur = Number(countEl.textContent.replace(/,/g, "")) || 1428;
          countEl.textContent = (cur + 1).toLocaleString();
        }
      }

      if (tooltip) {
        const strong = document.createElement("strong");
        strong.textContent = slot.meta.name;
        const span = document.createElement("span");
        span.textContent = slot.meta.intention;
        tooltip.replaceChildren(strong, span);
        tooltip.classList.add("is-visible");
      }
    });

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    window.addEventListener("resize", () => {
      const w = container.clientWidth || 540;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Smooth orbit yaw + subtle idle sway
      const idleYaw = isDragging ? 0 : Math.sin(t * 0.25) * 0.08;
      currentYaw += (targetYaw + idleYaw - currentYaw) * 0.06;
      standGroup.rotation.y = currentYaw;

      // Flicker every lit candle
      candleSlots.forEach((slot) => {
        if (!slot.lit) return;
        if (slot.scalePulse < 1) {
          slot.scalePulse = Math.min(1, slot.scalePulse + 0.08);
        }
        const flicker = 0.92 + Math.sin(t * 9.5 + slot.phase) * 0.08 + Math.cos(t * 15 + slot.phase) * 0.05;
        slot.flame.scale.set(
          slot.scalePulse * (0.9 + flicker * 0.1),
          slot.scalePulse * flicker * 1.15,
          slot.scalePulse
        );
        slot.halo.material.opacity = (0.68 + Math.sin(t * 7 + slot.phase) * 0.14) * slot.scalePulse;
      });

      warmRackLight.intensity = 2.2 + Math.sin(t * 6.5) * 0.18;

      if (sparkLife > 0) {
        sparkLife = Math.max(0, sparkLife - 0.025);
        sparkMat.opacity = sparkLife;
        const arr = sparkGeo.attributes.position.array;
        for (let i = 0; i < sparkCount; i++) {
          arr[i * 3 + 1] += 0.018;
          arr[i * 3] += Math.sin(t * 6 + i) * 0.002;
        }
        sparkGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    return {
      lightNewCandle(name, intention) {
        const nextUnlit = candleSlots.find((s) => !s.lit);
        const target = nextUnlit || candleSlots[Math.floor(Math.random() * candleSlots.length)];
        if (target) {
          lightSlot(target, name, intention);
          if (tooltip) {
            const strong = document.createElement("strong");
            strong.textContent = target.meta.name;
            const span = document.createElement("span");
            span.textContent = target.meta.intention;
            tooltip.replaceChildren(strong, span);
            tooltip.classList.add("is-visible");
          }
        }
      }
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroSanctuary();
    const initial = (window.CathedralData && window.CathedralData.INITIAL_CANDLES) || [];
    window.Cathedral3D = initCandleChapel(initial);
  });
})();
