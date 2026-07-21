/*
 * ELITEROOF — hero 3D roof model (progressive enhancement).
 *
 * Renders a procedurally-built low-poly modern house in the hero section
 * using self-hosted Three.js (assets/vendor/three/three.module.min.js — no
 * CDN, no network dependency at runtime, no textures/images ever).
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
    // Real shadow mapping — soft PCF, capped resolution (this is a
    // continuously-running hero decoration, not a hero shot render, so
    // 1024 is deliberately chosen over 2048/4096 to keep frame time flat).
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const reduceMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)');

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);

    // Tiny deterministic pseudo-random helper (sine hash) — used only for
    // scattering the tree ring. Deterministic on purpose: the model should
    // look identical on every load/reload, not re-roll each visit.
    function hash(n) {
      const s = Math.sin(n * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    }

    // ---------------------------------------------------------------
    // Palette — pulled straight from css/tokens.css. Gold accent family:
    // #dcae54 bright (dark surfaces), #7d5d1e deep (light surfaces). Reused
    // here for both the metal-roof trim AND the terrace railing, so the
    // railing reads as the same brand gold rather than an invented "wood"
    // color, and the dark-mode --border (#34413a) becomes the paved
    // courtyard tone, and --surface-dark (#12181a) becomes the tree color —
    // every material in the scene traces back to a real token.
    // ---------------------------------------------------------------
    const GOLD_BRIGHT = 0xdcae54; // --accent-on-dark
    const GOLD_DEEP = 0x7d5d1e;   // --accent
    const SURFACE_DARK = 0x12181a; // --surface-dark
    const BORDER_DARK = 0x34413a;  // dark-mode --border

    // ---------------------------------------------------------------
    // Procedural geometry: a modern house with a main two-story volume, a
    // lower attached wing (garage-like), a cantilevered covered terrace
    // with a slat railing, a full glazed ground-floor wall, landscape
    // lighting, low-poly trees and a paved courtyard — an architectural
    // silhouette rather than a toy house, echoing the reference night-aerial
    // photo (dark standing-seam roof, warm glass, forest backdrop).
    // ---------------------------------------------------------------
    const house = new THREE.Group();

    // Walls carry a constant `emissive` floor so no face ever reads as pure
    // background-matching black on the unlit side of a rotation — without
    // it the walls were nearly indistinguishable from --surface-dark for
    // roughly a quarter of every turn.
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x232b27, roughness: 0.82, metalness: 0.05,
      emissive: 0x0e130f, emissiveIntensity: 0.6,
    });
    // Standing-seam metal roof material — MeshPhysicalMaterial with a touch
    // of clearcoat so it picks up sharp, narrow specular highlights like
    // real coated metal roofing, instead of the flatter matte look
    // MeshStandardMaterial gives.
    const roofMat = new THREE.MeshPhysicalMaterial({
      color: 0x3d4c44, roughness: 0.32, metalness: 0.55,
      emissive: 0x141c18, emissiveIntensity: 0.4,
      clearcoat: 0.5, clearcoatRoughness: 0.15,
    });
    const accentMat = new THREE.MeshStandardMaterial({ color: GOLD_BRIGHT, roughness: 0.32, metalness: 0.5 });
    // Terrace railing — literally the deep-gold brand token rendered as a
    // matte metal slat, doubling as both "wood-slat railing" silhouette and
    // an on-brand gold accent instead of an invented wood color.
    const slatMat = new THREE.MeshStandardMaterial({ color: GOLD_DEEP, roughness: 0.55, metalness: 0.15 });
    const treeMat = new THREE.MeshStandardMaterial({ color: SURFACE_DARK, roughness: 0.85, metalness: 0.02 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x0b0e0a, roughness: 0.9, metalness: 0 });

    // ---- Main volume ----
    const wallW = 2.2;
    const wallH = 1.1;
    const wallD = 1.6;
    const walls = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallD), wallMat);
    walls.position.y = wallH / 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    house.add(walls);

    // ---- Lower attached wing (multi-volume roofline) — a second, lower
    // volume offset to one side (garage / secondary wing), so the
    // silhouette reads as an architecturally-considered composition rather
    // than a single toy box. Shares the same wall/roof material story as
    // the main volume, reinforcing "one roofing system across the whole
    // property" — the actual brand story.
    const wingW = 1.0;
    const wingH = 0.6;
    const wingD = 1.15;
    const wingX = -(wallW / 2 + wingW / 2);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(wingW, wingH, wingD), wallMat);
    wing.position.set(wingX, wingH / 2, 0);
    wing.castShadow = true;
    wing.receiveShadow = true;
    house.add(wing);

    // Ground plane — a subtle dark disc so the house, courtyard and path
    // lights read as sitting on something instead of floating in mid-air.
    const groundRadius = 2.15;
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e0a, roughness: 0.95, metalness: 0, transparent: true, opacity: 0.8,
    });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(groundRadius, 28), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    house.add(ground);

    // Paved courtyard — a lighter inset patch in front of the entrance,
    // subtly differentiated from the surrounding dark ground.
    const courtyardMat = new THREE.MeshStandardMaterial({ color: BORDER_DARK, roughness: 0.85, metalness: 0.04 });
    const courtyard = new THREE.Mesh(new THREE.CircleGeometry(0.78, 20), courtyardMat);
    courtyard.rotation.x = -Math.PI / 2;
    courtyard.position.set(0, 0.004, wallD / 2 + 0.68);
    courtyard.receiveShadow = true;
    house.add(courtyard);

    // ---- Windows ----
    // Small punched windows: unlit (MeshBasic, ignores scene lighting so it
    // always reads "glowing" regardless of rotation angle) — each is a
    // group of a soft bloom plane, the bright pane, and a mullion cross.
    const windowMat = new THREE.MeshBasicMaterial({ color: 0xffd28c });
    const windowGeo = new THREE.PlaneGeometry(0.17, 0.24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffd28c, transparent: true, opacity: 0.16, depthWrite: false,
    });
    const glowGeo = new THREE.PlaneGeometry(0.17 * 1.8, 0.24 * 1.8);
    const mullionMat = new THREE.MeshBasicMaterial({ color: 0x18140f });
    const mullionVGeo = new THREE.PlaneGeometry(0.016, 0.24);
    const mullionHGeo = new THREE.PlaneGeometry(0.17, 0.016);
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

    // Full-height glazed wall — the single highest-impact "premium
    // architectural photo" lever from the reference: a much larger glowing
    // glass plane with slim mullions on the front (ground) face, replacing
    // the small punched windows there. Other faces keep small punched
    // windows so the house still reads as lit from every rotation angle.
    function makeGlassWall(width, height) {
      const group = new THREE.Group();
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(width * 1.14, height * 1.14), glowMat);
      glow.position.z = -0.006;
      group.add(glow);
      group.add(new THREE.Mesh(new THREE.PlaneGeometry(width, height), windowMat));
      // Slim vertical mullions dividing the wall into five lites.
      const mullionThin = new THREE.PlaneGeometry(0.014, height);
      for (let i = 1; i < 5; i++) {
        const bar = new THREE.Mesh(mullionThin, mullionMat);
        bar.position.set(-width / 2 + (width * i) / 5, 0, 0.003);
        group.add(bar);
      }
      // One horizontal transom near the top, curtain-wall style.
      const transom = new THREE.Mesh(new THREE.PlaneGeometry(width, 0.014), mullionMat);
      transom.position.set(0, height * 0.32, 0.003);
      group.add(transom);
      return group;
    }
    const frontWindowY = wallH * 0.58;
    const glassWidth = wallW * 0.82;
    const glassHeight = wallH * 0.84;
    const glassWall = makeGlassWall(glassWidth, glassHeight);
    glassWall.position.set(0, wallH / 2, wallD / 2 + paneOffset);
    house.add(glassWall);

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
    // A couple of small garage-style windows on the wing's front face.
    [-0.28, 0.28].forEach((dx) => {
      const win = makeWindow();
      win.position.set(wingX + dx, wingH * 0.55, wingD / 2 + paneOffset);
      house.add(win);
    });

    // ---------------------------------------------------------------
    // Reusable gable-roof builder — standing-seam ribs, edge tracing and a
    // ridge accent, shared by the main volume and the lower wing so both
    // roofs carry identical roofing-system detailing.
    // ---------------------------------------------------------------
    const seamMat = new THREE.MeshStandardMaterial({
      color: GOLD_BRIGHT, roughness: 0.35, metalness: 0.6, transparent: true, opacity: 0.55,
    });
    function buildRoof({ halfW, apex, depth, x, y, seamCount, seamInset, ridgeThickness }) {
      const shape = new THREE.Shape();
      shape.moveTo(-halfW, 0);
      shape.lineTo(halfW, 0);
      shape.lineTo(0, apex);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
      geo.translate(0, 0, -depth / 2);
      const roof = new THREE.Mesh(geo, roofMat);
      roof.position.set(x, y, 0);
      roof.castShadow = true;
      roof.receiveShadow = true;
      house.add(roof);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 20),
        new THREE.LineBasicMaterial({ color: GOLD_BRIGHT, transparent: true, opacity: 0.55 })
      );
      edges.position.set(x, y, 0);
      house.add(edges);

      const ridge = new THREE.Mesh(new THREE.BoxGeometry(ridgeThickness, ridgeThickness, depth - 0.02), accentMat);
      ridge.position.set(x, y + apex, 0);
      house.add(ridge);

      // Standing-seam ribs running ridge-to-eave on each slope.
      const slopeLen = Math.hypot(halfW, apex);
      const seamGeo = new THREE.BoxGeometry(slopeLen - 0.06, 0.012, 0.02);
      const seamSpan = depth - seamInset * 2;
      [-1, 1].forEach((side) => {
        const angle = Math.atan2(-apex, side * halfW);
        const nx = side * apex;
        const ny = halfW;
        const nLen = Math.hypot(nx, ny);
        for (let i = 0; i < seamCount; i++) {
          const z = -seamSpan / 2 + (seamSpan * i) / (seamCount - 1);
          const seam = new THREE.Mesh(seamGeo, seamMat);
          seam.position.set(
            x + (side * halfW) / 2 + (nx / nLen) * 0.018,
            y + apex / 2 + (ny / nLen) * 0.018,
            z
          );
          seam.rotation.z = angle;
          house.add(seam);
        }
      });

      return { topY: y + apex };
    }

    const roofHalfW = wallW / 2 + 0.16;
    const roofApex = 0.92;
    const roofDepth = wallD + 0.32;
    buildRoof({
      halfW: roofHalfW, apex: roofApex, depth: roofDepth, x: 0, y: wallH,
      seamCount: 6, seamInset: 0.14, ridgeThickness: 0.05,
    });

    const wingRoofHalfW = wingW / 2 + 0.12;
    const wingRoofApex = 0.38;
    const wingRoofDepth = wingD + 0.22;
    buildRoof({
      halfW: wingRoofHalfW, apex: wingRoofApex, depth: wingRoofDepth, x: wingX, y: wingH,
      seamCount: 4, seamInset: 0.1, ridgeThickness: 0.04,
    });

    // Small chimney for silhouette interest.
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.16), wallMat);
    chimney.position.set(0.55, wallH + 0.62, -0.22);
    chimney.castShadow = true;
    house.add(chimney);
    const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.2), accentMat);
    chimneyCap.position.set(0.55, wallH + 0.84, -0.22);
    chimneyCap.castShadow = true;
    house.add(chimneyCap);

    // Faint bronze trace around the wall footprint — a quiet "dimension
    // line" echo of the flat illustration's hi-dim/hi-tick marks.
    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(wallW, wallH, wallD)),
      new THREE.LineBasicMaterial({ color: GOLD_BRIGHT, transparent: true, opacity: 0.14 })
    );
    baseEdges.position.y = wallH / 2;
    house.add(baseEdges);

    // ---------------------------------------------------------------
    // Covered terrace — a cantilevered floor slab (no support columns, on
    // purpose, to read as cantilevered) with a gold slat railing and a
    // separate flat cantilever canopy above it that clears the main roof's
    // eave so the two never intersect. A few railing-integrated glow points
    // echo the reference's landscape lighting detail.
    // ---------------------------------------------------------------
    const terraceY = wallH * 0.55;
    const terraceWidth = wallW * 0.72;
    const terraceDepth = 0.5;
    const terraceZOuter = wallD / 2 + terraceDepth;
    const terraceSlab = new THREE.Mesh(
      new THREE.BoxGeometry(terraceWidth, 0.045, terraceDepth),
      wallMat
    );
    terraceSlab.position.set(0, terraceY, wallD / 2 + terraceDepth / 2);
    terraceSlab.castShadow = true;
    terraceSlab.receiveShadow = true;
    house.add(terraceSlab);

    // Cantilever canopy — starts just past the main roof's own eave
    // overhang (roofDepth / 2) so it never intersects the pitched roof
    // solid, and reads as a second, flatter covering plane over the
    // terrace.
    const canopyWidth = terraceWidth * 0.92;
    const canopyZInner = roofDepth / 2 + 0.01;
    const canopyDepth = 0.36;
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(canopyWidth, 0.04, canopyDepth), roofMat);
    canopy.position.set(0, wallH + 0.02, canopyZInner + canopyDepth / 2);
    canopy.castShadow = true;
    canopy.receiveShadow = true;
    house.add(canopy);

    // Slat railing along the terrace's outer edge.
    const railTopY = terraceY + 0.34;
    const railBottomY = terraceY + 0.03;
    const slatGeo = new THREE.BoxGeometry(0.02, railTopY - railBottomY, 0.02);
    const slatCount = 13;
    const slatMargin = 0.06;
    const slatSpan = terraceWidth - slatMargin * 2;
    for (let i = 0; i < slatCount; i++) {
      const x = -slatSpan / 2 + (slatSpan * i) / (slatCount - 1);
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(x, (railTopY + railBottomY) / 2, terraceZOuter);
      slat.castShadow = true;
      house.add(slat);
    }
    const railCapGeo = new THREE.BoxGeometry(terraceWidth - slatMargin * 1.4, 0.03, 0.03);
    const railCapBottom = new THREE.Mesh(railCapGeo, accentMat);
    railCapBottom.position.set(0, railBottomY, terraceZOuter);
    railCapBottom.castShadow = true;
    house.add(railCapBottom);
    const railCapTop = new THREE.Mesh(railCapGeo, accentMat);
    railCapTop.position.set(0, railTopY, terraceZOuter);
    railCapTop.castShadow = true;
    house.add(railCapTop);

    // Railing-integrated warm glow points.
    const pathLightMat = new THREE.MeshBasicMaterial({ color: 0xffb35c });
    const pathLightGeo = new THREE.SphereGeometry(0.02, 6, 5);
    const railLightGeo = new THREE.SphereGeometry(0.014, 6, 5);
    [-0.42, 0, 0.42].forEach((x) => {
      const light = new THREE.Mesh(railLightGeo, pathLightMat);
      light.position.set(x, railTopY, terraceZOuter);
      house.add(light);
    });

    // Landscape path lighting — a handful of small warm glow points along
    // the front approach, echoing the reference photo's walkway lights.
    [
      [-0.22, 0.18], [0.22, 0.34], [-0.3, 0.52],
      [0.3, 0.68], [-0.2, 0.86], [0.2, 1.02],
    ].forEach(([x, zOffset]) => {
      const light = new THREE.Mesh(pathLightGeo, pathLightMat);
      light.position.set(x, 0.012, wallD / 2 + zOffset);
      house.add(light);
    });

    // ---------------------------------------------------------------
    // Landscaping — a ring of very low-poly trees suggesting the reference
    // photo's dense forest backdrop, without pretending to be a forest sim.
    // Placement uses a deterministic sine-hash so the scene is identical on
    // every load. Two trees get a faint warm uplight glow at the base.
    // ---------------------------------------------------------------
    const treeRMin = 1.55;
    const treeRMax = 2.05;
    const treeCount = 12;
    const treeUplightGeo = new THREE.SphereGeometry(0.024, 6, 5);
    const treeUplightMat = new THREE.MeshBasicMaterial({ color: 0xffc077, transparent: true, opacity: 0.85 });
    let treeTopMax = 0;
    for (let i = 0; i < treeCount; i++) {
      const rJit = hash(i * 3.1 + 0.7);
      const aJit = hash(i * 5.3 + 1.9);
      const r = treeRMin + rJit * (treeRMax - treeRMin);
      const angle = (i / treeCount) * Math.PI * 2 + (aJit - 0.5) * 0.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const scale = 0.7 + hash(i * 7.7 + 2.3) * 0.6;

      const trunkH = 0.14 * scale;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.012 * scale, 0.018 * scale, trunkH, 5), trunkMat);
      trunk.position.set(x, trunkH / 2, z);
      trunk.castShadow = true;
      house.add(trunk);

      // Two stacked cones give a slightly fuller silhouette than a single
      // cone, at negligible extra triangle cost.
      const coneBaseY = trunkH;
      const cone1H = 0.32 * scale;
      const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.16 * scale, cone1H, 7), treeMat);
      cone1.position.set(x, coneBaseY + cone1H / 2, z);
      cone1.castShadow = true;
      house.add(cone1);
      const cone2H = 0.24 * scale;
      const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.11 * scale, cone2H, 7), treeMat);
      cone2.position.set(x, coneBaseY + cone1H * 0.68 + cone2H / 2, z);
      cone2.castShadow = true;
      house.add(cone2);

      const treeTopY = coneBaseY + cone1H * 0.68 + cone2H;
      if (treeTopY > treeTopMax) treeTopMax = treeTopY;

      // Faint uplight glow at the base of two trees, echoing the
      // reference's exterior tree uplighting.
      if (i === 2 || i === 8) {
        const glow = new THREE.Mesh(treeUplightGeo, treeUplightMat);
        glow.position.set(x, 0.02, z);
        house.add(glow);
      }
    }

    house.rotation.x = -0.12;
    house.rotation.y = 0.5;
    scene.add(house);

    // ---------------------------------------------------------------
    // Bounding sphere of the whole scene (house + wing + terrace + trees +
    // ground), used by sizeToContainer() below to keep everything fully
    // framed no matter the aspect ratio. All geometry above is centered on
    // the world Y-axis (nothing is offset in x/z at the group level — only
    // individual meshes are, in local coordinates), so the Euclidean
    // distance from a fixed point on that axis to any vertex is rotation-
    // invariant: house.rotation.y changing at render time never moves a
    // vertex closer to or farther from cameraTarget. That lets us compute
    // one static bounding radius from a curated list of the model's
    // farthest extremities instead of re-deriving it every frame.
    // ---------------------------------------------------------------
    const cameraTarget = new THREE.Vector3(0, (wallH + roofApex) / 2, 0);
    function distFromTarget(x, y, z) {
      return Math.sqrt(x * x + (y - cameraTarget.y) * (y - cameraTarget.y) + z * z);
    }
    const extremePoints = [
      [0, wallH + roofApex, roofDepth / 2],                 // main ridge end
      [roofHalfW, wallH, roofDepth / 2],                     // main eave far corner
      [wingX, wingH + wingRoofApex, wingRoofDepth / 2],      // wing ridge end
      [wingX - wingRoofHalfW, wingH, wingRoofDepth / 2],     // wing eave far corner
      [terraceWidth / 2, terraceY, terraceZOuter],           // terrace outer corner
      [canopyWidth / 2, wallH + 0.02, canopyZInner + canopyDepth], // canopy outer corner
      [0.65, wallH + 0.86, -0.32],                           // chimney cap
      [groundRadius, 0, 0],                                  // ground disc edge
      [treeRMax, 0, 0],                                      // farthest tree base
      [treeRMax * 0.7, treeTopMax, treeRMax * 0.7],           // a representative tall tree top
    ];
    const boundRadius = Math.max(...extremePoints.map((p) => distFromTarget(p[0], p[1], p[2])));
    const framingMargin = 1.25;
    const cameraElevation = 0.26; // radians

    // ---------------------------------------------------------------
    // Soft studio lighting: key + hemisphere fill + gold rim + ambient.
    // The key light casts real shadows now — a tight, boundRadius-sized
    // orthographic frustum keeps the 1024px shadow map resolution useful
    // instead of spreading it over empty space.
    // ---------------------------------------------------------------
    const key = new THREE.DirectionalLight(0xfff1de, 2.1);
    key.position.set(3.2, 4.6, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0015;
    key.shadow.normalBias = 0.02;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 16;
    const shadowExtent = boundRadius * 1.15;
    key.shadow.camera.left = -shadowExtent;
    key.shadow.camera.right = shadowExtent;
    key.shadow.camera.top = shadowExtent;
    key.shadow.camera.bottom = -shadowExtent;
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);
    scene.add(key.target);

    const fill = new THREE.HemisphereLight(0x8a97ad, 0x1c1611, 0.55);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(GOLD_BRIGHT, 1.1);
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
