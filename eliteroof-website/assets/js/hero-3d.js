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

    // Standing-seam metal roof, not a shingle roof — matches the site's
    // actual #1 listed service (металлочерепица) and its cool zinc/patina
    // material story instead of the old warm bronze. Both materials carry
    // a constant `emissive` floor so no face ever reads as pure
    // background-matching black on the unlit side of a rotation — without
    // it the walls were nearly indistinguishable from --surface-dark for
    // roughly a quarter of every turn.
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x232b27, roughness: 0.82, metalness: 0.05,
      emissive: 0x0e130f, emissiveIntensity: 0.6,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x3d4c44, roughness: 0.32, metalness: 0.55,
      emissive: 0x141c18, emissiveIntensity: 0.4,
    });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xdcae54, roughness: 0.32, metalness: 0.5 });

    const wallW = 2.2;
    const wallH = 1.1;
    const wallD = 1.6;
    const walls = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), wallMat);
    walls.position.y = wallH / 2;
    house.add(walls);

    // Ground plane — a subtle dark disc so the house and path lights read
    // as sitting on something instead of floating in mid-air. Deliberately
    // unadorned (no grid of its own) so it doesn't fight the
    // `.hero-blueprint` CSS grid backdrop already sitting behind the
    // canvas in the page.
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e0a, roughness: 0.95, metalness: 0, transparent: true, opacity: 0.8,
    });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24), groundMat);
    ground.rotation.x = -Math.PI / 2;
    house.add(ground);

    // Warm lit windows — unlit (MeshBasic, ignores the scene's lighting so
    // it always reads as "glowing" regardless of rotation angle), the
    // single biggest lever for the "premium house at night" mood this
    // model is going for. A few on the front face, a couple on the side so
    // the house still reads as inhabited from any angle mid-rotation.
    // Each window is now a small group: a larger, dimmer "bloom" plane
    // behind the glass (fakes a soft glow with zero extra render passes),
    // the bright pane itself, and a thin dark mullion cross on top — so it
    // reads as an actual window with muntins, not a flat glowing rectangle.
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd28c });
    const windowGeo = new THREE.PlaneGeometry(0.17, 0.24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffd28c, transparent: true, opacity: 0.16, depthWrite: false,
    });
    const glowGeo = new THREE.PlaneGeometry(0.17 * 1.8, 0.24 * 1.8);
    const mullionMat = new THREE.MeshBasicMaterial({ color: 0x18140f });
    const mullionVGeo = new THREE.PlaneGeometry(0.016, 0.24);
    const mullionHGeo = new THREE.PlaneGeometry(0.17, 0.016);
    // Pane sits proud of the wall face; the dim glow plane is tucked into
    // the small gap between the wall and the pane so nothing z-fights.
    const paneOffset = 0.006;
    function makeWindow() {
      const group = new THREE.Group();
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.z = -0.004;
      group.add(glow);
      group.add(new THREE.Mesh(windowGeo, windowMat));
      const barV = new THREE.Mesh(mullionVGeo, mullionMat);
      barV.position.z = 0.003;
      group.add(barV);
      const barH = new THREE.Mesh(mullionHGeo, mullionMat);
      barH.position.z = 0.003;
      group.add(barH);
      return group;
    }
    // Windows on all four faces (not just front + one side) — the model
    // auto-rotates continuously, and with only two lit faces roughly half
    // of every turn showed a flat dark box with no glow at all, the same
    // "unlit side reads as a shapeless blob" problem the wall emissive
    // floor above was added to fix. Fewer panes on the back/far side keeps
    // the front the visual focus while still keeping *something* lit from
    // any angle.
    const frontWindowY = wallH * 0.58;
    [-0.78, -0.28, 0.28, 0.78].forEach((x) => {
      const win = makeWindow();
      win.position.set(x, frontWindowY, wallD / 2 + paneOffset);
      house.add(win);
    });
    [-0.5, 0.5].forEach((x) => {
      const win = makeWindow();
      win.position.set(x, frontWindowY, -(wallD / 2 + paneOffset));
      win.rotation.y = Math.PI;
      house.add(win);
    });
    [-0.42, 0.42].forEach((z) => {
      const win = makeWindow();
      win.position.set(wallW / 2 + paneOffset, frontWindowY, z);
      win.rotation.y = Math.PI / 2;
      house.add(win);
    });
    [-0.42, 0.42].forEach((z) => {
      const win = makeWindow();
      win.position.set(-(wallW / 2 + paneOffset), frontWindowY, z);
      win.rotation.y = -Math.PI / 2;
      house.add(win);
    });

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
      new THREE.LineBasicMaterial({ color: 0xdcae54, transparent: true, opacity: 0.55 })
    );
    roofEdges.position.y = wallH;
    house.add(roofEdges);

    // Ridge accent beam.
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, roofDepth - 0.02), accentMat);
    ridge.position.set(0, wallH + roofApex, 0);
    house.add(ridge);

    // Standing-seam metal roof ridges — thin raised ribs running from
    // ridge to eave on each slope, evenly spaced across the roof's depth.
    // This is the single most on-brand addition: a literal depiction of
    // the standing-seam / fold-seam metal roofing (металлочерепица /
    // фальцевая кровля) that's this company's headline service, instead
    // of a flat painted slope.
    const slopeLen = Math.hypot(roofHalfW, roofApex);
    const seamMat = new THREE.MeshStandardMaterial({
      color: 0xdcae54, roughness: 0.35, metalness: 0.6, transparent: true, opacity: 0.55,
    });
    const seamGeo = new THREE.BoxGeometry(slopeLen - 0.06, 0.012, 0.02);
    const seamCount = 6;
    const seamInset = 0.14; // keep seams clear of the front/back gable edges
    const seamSpan = roofDepth - seamInset * 2;
    [-1, 1].forEach((side) => {
      const angle = Math.atan2(-roofApex, side * roofHalfW);
      const nx = side * roofApex;
      const ny = roofHalfW;
      const nLen = Math.hypot(nx, ny);
      for (let i = 0; i < seamCount; i++) {
        const z = -seamSpan / 2 + (seamSpan * i) / (seamCount - 1);
        const seam = new THREE.Mesh(seamGeo, seamMat);
        seam.position.set(
          (side * roofHalfW) / 2 + (nx / nLen) * 0.018,
          wallH + roofApex / 2 + (ny / nLen) * 0.018,
          z
        );
        seam.rotation.z = angle;
        house.add(seam);
      }
    });

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
      new THREE.LineBasicMaterial({ color: 0xdcae54, transparent: true, opacity: 0.14 })
    );
    baseEdges.position.y = wallH / 2;
    house.add(baseEdges);

    // Landscape path lighting — a handful of small warm glow points along
    // the front approach, echoing the reference photo's walkway lights.
    // Kept deliberately minimal and unlit (MeshBasic) for cheapness.
    const pathLightMat = new THREE.MeshBasicMaterial({ color: 0xffb35c });
    const pathLightGeo = new THREE.SphereGeometry(0.02, 6, 5);
    [
      [-0.22, 0.18], [0.22, 0.34], [-0.3, 0.52],
      [0.3, 0.68], [-0.2, 0.86], [0.2, 1.02],
    ].forEach(([x, zOffset]) => {
      const light = new THREE.Mesh(pathLightGeo, pathLightMat);
      light.position.set(x, 0.012, wallD / 2 + zOffset);
      house.add(light);
    });

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

    const rim = new THREE.DirectionalLight(0xdcae54, 1.1);
    rim.position.set(-3.4, 2.2, -4.2);
    scene.add(rim);

    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
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
