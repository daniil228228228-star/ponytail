/*
 * ELITEROOF — hero 3D roof model (progressive enhancement).
 *
 * Renders a small, procedurally-built low-poly gable-roof house in the hero
 * section using self-hosted Three.js (assets/vendor/three/three.module.min.js
 * — no CDN, no network dependency at runtime).
 *
 * This script never touches the DOM outside `.hero-blueprint`: it either
 * swaps the flat SVG (`.hero-illustration`) for a live <canvas>, or — on any
 * failure (no WebGL, import error, anything throwing) — does nothing and
 * leaves the SVG exactly as it was. That SVG is never removed from the DOM;
 * it is only visually hidden via the `is-3d-ready` class this script adds.
 *
 * Kept deliberately separate from js/main.js (which owns nav/FAQ/reveal/form
 * behavior) so the two can be reasoned about independently.
 */
(async () => {
  'use strict';

  const container = document.querySelector('.hero-blueprint');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // ---- Feature-detect WebGL before paying for the (large) three.js import ----
  function hasWebGL() {
    try {
      const test = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (test.getContext('webgl2') || test.getContext('webgl'))
      );
    } catch (e) {
      return false;
    }
  }
  if (!hasWebGL()) return; // Fallback SVG stays visible.

  let THREE;
  try {
    THREE = await import('../vendor/three/three.module.min.js');
  } catch (e) {
    return; // Fallback SVG stays visible.
  }

  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const reduceMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);

    // ---------------------------------------------------------------
    // Procedural geometry: a simple, elegant low-poly gable-roof house.
    // ---------------------------------------------------------------
    const house = new THREE.Group();

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2319, roughness: 0.78, metalness: 0.06 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x372718, roughness: 0.48, metalness: 0.22 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xd3a273, roughness: 0.32, metalness: 0.6 });

    const wallW = 2.2;
    const wallH = 1.1;
    const wallD = 1.6;
    const walls = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), wallMat);
    walls.position.y = wallH / 2;
    house.add(walls);

    // Gable roof: a triangular profile extruded along the ridge, with a
    // small eave overhang beyond the wall footprint.
    const roofHalfW = wallW / 2 + 0.16;
    const roofApex = 0.92;
    const roofDepth = wallD + 0.32;
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-roofHalfW, 0);
    roofShape.lineTo(roofHalfW, 0);
    roofShape.lineTo(0, roofApex);
    roofShape.closePath();
    const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: roofDepth, bevelEnabled: false, curveSegments: 1 });
    roofGeo.translate(0, 0, -roofDepth / 2);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = wallH;
    house.add(roof);

    // Thin bronze wireframe tracing the roof edges — echoes the hand-drawn
    // blueprint line-art motif the flat SVG established.
    const roofEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(roofGeo, 20),
      new THREE.LineBasicMaterial({ color: 0xd3a273, transparent: true, opacity: 0.55 })
    );
    roofEdges.position.y = wallH;
    house.add(roofEdges);

    // Ridge accent beam.
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, roofDepth - 0.02), accentMat);
    ridge.position.set(0, wallH + roofApex, 0);
    house.add(ridge);

    // Small chimney for silhouette interest.
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.16), wallMat);
    chimney.position.set(0.55, wallH + 0.62, -0.22);
    house.add(chimney);
    const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.2), accentMat);
    chimneyCap.position.set(0.55, wallH + 0.84, -0.22);
    house.add(chimneyCap);

    // Faint bronze trace around the wall footprint — a quiet "dimension
    // line" echo of the flat illustration's hi-dim/hi-tick marks.
    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(wallW, wallH, wallD)),
      new THREE.LineBasicMaterial({ color: 0xd3a273, transparent: true, opacity: 0.14 })
    );
    baseEdges.position.y = wallH / 2;
    house.add(baseEdges);

    house.rotation.x = -0.12;
    house.rotation.y = 0.5;
    scene.add(house);

    // Bounding sphere of the whole house (precomputed from the geometry
    // above) plus a comfortable margin, and a fixed gentle down-look angle —
    // used by sizeToContainer() below to keep the model fully framed no
    // matter how narrow/tall the hero-blueprint box is at a given viewport.
    const cameraTarget = new THREE.Vector3(0, (wallH + roofApex) / 2, 0);
    const boundRadius = Math.sqrt(roofHalfW ** 2 + cameraTarget.y ** 2 + (roofDepth / 2) ** 2);
    const framingMargin = 1.2;
    const cameraElevation = 0.26; // radians

    // ---------------------------------------------------------------
    // Soft studio lighting: key + hemisphere fill + bronze rim. No shadow
    // maps / environment maps — kept cheap on purpose for a hero decoration.
    // ---------------------------------------------------------------
    const key = new THREE.DirectionalLight(0xfff1de, 2.1);
    key.position.set(3.2, 4.6, 3.6);
    scene.add(key);

    const fill = new THREE.HemisphereLight(0x8a97ad, 0x1c1611, 0.55);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xd3a273, 1.1);
    rim.position.set(-3.4, 2.2, -4.2);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambient);

    // ---------------------------------------------------------------
    // Sizing — capped DPR, debounced resize.
    // ---------------------------------------------------------------
    function sizeToContainer() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      camera.aspect = w / h;

      // Refit the camera distance to whichever of vertical/horizontal FOV is
      // tighter for the current aspect, so the house never crops regardless
      // of how tall/narrow the hero-blueprint box happens to be.
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const limitingFov = Math.min(vFov, hFov);
      const dist = (boundRadius * framingMargin) / Math.sin(limitingFov / 2);
      camera.position.set(
        0,
        cameraTarget.y + Math.sin(cameraElevation) * dist,
        Math.cos(cameraElevation) * dist
      );
      camera.lookAt(cameraTarget);
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
    }
    sizeToContainer();
    // Stylesheets are render-blocking, but this is a cheap extra safety net
    // for the (rare) case layout wasn't settled at first measurement.
    window.addEventListener('load', sizeToContainer, { once: true });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeToContainer, 150);
    });

    // ---------------------------------------------------------------
    // Render loop: one slow, continuous turn roughly every 32s. Paused
    // entirely off-screen (IntersectionObserver) and skipped for
    // prefers-reduced-motion (a single static frame is still rendered).
    // ---------------------------------------------------------------
    const REVOLUTION_SECONDS = 32;
    let rafId = null;
    let lastT = null;
    let inView = true;
    const spinAllowed = () => inView && !reduceMotionMql.matches;

    function frame(t) {
      if (lastT == null) lastT = t;
      const dt = (t - lastT) / 1000;
      lastT = t;
      house.rotation.y += dt * ((Math.PI * 2) / REVOLUTION_SECONDS);
      renderer.render(scene, camera);
      rafId = spinAllowed() ? requestAnimationFrame(frame) : null;
      if (rafId == null) lastT = null;
    }
    function startLoop() {
      if (rafId != null) return;
      lastT = null;
      rafId = requestAnimationFrame(frame);
    }
    function stopLoop() {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
      lastT = null;
    }

    // Always paint at least one frame, even when motion is disabled.
    renderer.render(scene, camera);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting;
            if (spinAllowed()) startLoop();
            else stopLoop();
          });
        },
        { threshold: 0.01 }
      );
      io.observe(container);
    }

    reduceMotionMql.addEventListener('change', () => {
      if (spinAllowed()) startLoop();
      else {
        stopLoop();
        renderer.render(scene, camera);
      }
    });

    if (spinAllowed()) startLoop();

    // Only now swap the flat SVG for the live canvas — a frame has
    // definitely rendered successfully at this point.
    container.classList.add('is-3d-ready');
  } catch (e) {
    // Any failure during setup: leave the SVG fallback exactly as it was.
    container.classList.remove('is-3d-ready');
  }
})();
