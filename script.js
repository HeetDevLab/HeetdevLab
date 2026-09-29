document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("menuBtn"), links=document.getElementById("navLinks"), backdrop=document.getElementById("menuBackdrop");
  const close=()=>{links.classList.remove("active");backdrop.classList.remove("active");btn.setAttribute("aria-expanded","false")};
  btn?.addEventListener("click",()=>{const open=links.classList.toggle("active");backdrop.classList.toggle("active",open);btn.setAttribute("aria-expanded",open)});
  backdrop?.addEventListener("click",close);
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
});
if(typeof particlesJS!=="undefined"){
  particlesJS("particles-js",{particles:{number:{value:45,density:{enable:true,value_area:900}},color:{value:"#1477ff"},shape:{type:"circle"},opacity:{value:.35},size:{value:2.5},line_linked:{enable:true,distance:155,color:"#1477ff",opacity:.22,width:1},move:{enable:true,speed:.7}},interactivity:{events:{onhover:{enable:true,mode:"grab"}}}});
}

/* =========================================================
   HEETDEVLAB REAL 3D WEBGL HERO
   ========================================================= */
(() => {
  const sceneEl = document.getElementById("hero3d");
  const canvas = document.getElementById("webglCanvas");

  if (!sceneEl || !canvas || typeof THREE === "undefined") {
    return;
  }

  const isMobile = () => window.innerWidth <= 820;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03091d, 0.055);

  const camera = new THREE.PerspectiveCamera(
    42,
    sceneEl.clientWidth / sceneEl.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.15, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile(),
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.35 : 1.8));
  renderer.setSize(sceneEl.clientWidth, sceneEl.clientHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Lighting
  scene.add(new THREE.AmbientLight(0x7fbfff, 1.4));

  const key = new THREE.PointLight(0x16c8ff, 24, 18, 2);
  key.position.set(3, 3, 5);
  scene.add(key);

  const rim = new THREE.PointLight(0x315cff, 18, 14, 2);
  rim.position.set(-4, -1, 2);
  scene.add(rim);

  const topLight = new THREE.PointLight(0x65f2ff, 10, 10, 2);
  topLight.position.set(0, 4, -2);
  scene.add(topLight);

  const world = new THREE.Group();
  scene.add(world);

  // Main 3D shield: extruded custom shape, not a flat CSS polygon.
  const shape = new THREE.Shape();
  shape.moveTo(0, 1.55);
  shape.lineTo(1.18, 1.08);
  shape.lineTo(1.02, -0.48);
  shape.quadraticCurveTo(0.82, -1.25, 0, -1.62);
  shape.quadraticCurveTo(-0.82, -1.25, -1.02, -0.48);
  shape.lineTo(-1.18, 1.08);
  shape.closePath();

  const shieldGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.46,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.10,
    bevelThickness: 0.10,
    curveSegments: 10
  });
  shieldGeo.center();

  const shieldMat = new THREE.MeshStandardMaterial({
    color: 0x087dff,
    metalness: 0.72,
    roughness: 0.19,
    emissive: 0x06366e,
    emissiveIntensity: 0.65
  });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  shield.scale.setScalar(1.02);
  world.add(shield);

  // Cyan edge shell.
  const edgeGeo = new THREE.EdgesGeometry(shieldGeo, 22);
  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x56eaff,
    transparent: true,
    opacity: 0.85
  });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);
  edges.scale.copy(shield.scale);
  world.add(edges);

  // "S" mark as actual 3D text-like geometry using a curve tube.
  const sCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.46, 0.75, 0.30),
    new THREE.Vector3(-0.35, 0.75, 0.36),
    new THREE.Vector3(-0.50, 0.22, 0.39),
    new THREE.Vector3(0.42, -0.18, 0.42),
    new THREE.Vector3(0.50, -0.70, 0.36),
    new THREE.Vector3(-0.35, -0.72, 0.30)
  ]);
  const sGeo = new THREE.TubeGeometry(sCurve, 28, 0.075, 8, false);
  const sMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.2,
    emissive: 0x8feeff,
    emissiveIntensity: 0.28
  });
  const sMark = new THREE.Mesh(sGeo, sMat);
  world.add(sMark);

  // 3D orbit rings.
  const rings = [];
  const ringConfigs = [
    [2.15, 0.025, 0x20d9ff, 0.85],
    [2.65, 0.018, 0x2b7dff, 0.58],
    [1.78, 0.012, 0x75edff, 0.42]
  ];
  ringConfigs.forEach(([radius, tube, color, opacity], i) => {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 100);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = i === 1 ? Math.PI * 0.48 : Math.PI * 0.18;
    ring.rotation.y = i * 0.55;
    world.add(ring);
    rings.push(ring);
  });

  // Small satellites.
  const satellites = new THREE.Group();
  const satGeo = new THREE.IcosahedronGeometry(0.075, 1);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0x5cecff,
    emissive: 0x087dff,
    emissiveIntensity: 1.4,
    metalness: 0.5,
    roughness: 0.18
  });

  for (let i = 0; i < (isMobile() ? 7 : 11); i++) {
    const sat = new THREE.Mesh(satGeo, satMat);
    const a = (i / 11) * Math.PI * 2;
    const r = 2.35 + (i % 3) * 0.18;
    sat.position.set(Math.cos(a) * r, Math.sin(a * 1.4) * 1.15, Math.sin(a) * r);
    satellites.add(sat);
  }
  world.add(satellites);

  // Background particle field.
  const particleCount = isMobile() ? 280 : 650;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 11;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x5bcfff,
    size: isMobile() ? 0.018 : 0.025,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Input smoothing.
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  function setPointer(clientX, clientY) {
    if (isMobile()) return;
    const rect = sceneEl.getBoundingClientRect();
    target.x = ((clientX - rect.left) / rect.width - 0.5) * 2;
    target.y = ((clientY - rect.top) / rect.height - 0.5) * 2;
  }

  sceneEl.addEventListener("pointermove", e => setPointer(e.clientX, e.clientY), { passive: true });
  sceneEl.addEventListener("pointerleave", () => {
    target.x = 0;
    target.y = 0;
  }, { passive: true });

  // Mobile touch: gentle movement, without blocking page scrolling.
  sceneEl.addEventListener("touchmove", e => {
    const t = e.touches[0];
    if (t) {
      const rect = sceneEl.getBoundingClientRect();
      target.x = ((t.clientX - rect.left) / rect.width - 0.5) * 1.1;
      target.y = ((t.clientY - rect.top) / rect.height - 0.5) * 1.1;
    }
  }, { passive: true });

  function resize() {
    const w = sceneEl.clientWidth;
    const h = sceneEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile() ? 1.35 : 1.8));
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize, { passive: true });

  let last = performance.now();
  let raf = 0;

  function animate(now) {
    raf = requestAnimationFrame(animate);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!reduced) {
      current.x += (target.x - current.x) * Math.min(1, dt * 5);
      current.y += (target.y - current.y) * Math.min(1, dt * 5);

      world.rotation.y += dt * 0.22;
      world.rotation.x = current.y * -0.16;
      world.rotation.z = current.x * -0.08;

      shield.rotation.y = current.x * 0.24;
      shield.rotation.x = current.y * -0.14;
      edges.rotation.copy(shield.rotation);
      sMark.rotation.copy(shield.rotation);

      rings[0].rotation.z += dt * 0.75;
      rings[1].rotation.z -= dt * 0.46;
      rings[2].rotation.z += dt * 0.95;

      satellites.rotation.y -= dt * 0.5;
      satellites.rotation.x = current.y * 0.2;

      particles.rotation.y += dt * 0.018;
      particles.rotation.x = current.y * 0.01;

      key.position.x = 3 + current.x * 2;
      key.position.y = 3 - current.y * 1.5;
    }

    renderer.render(scene, camera);
  }

  resize();
  animate(performance.now());

  // Clean up if the page ever removes this scene.
  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(raf);
    renderer.dispose();
    shieldGeo.dispose();
    shieldMat.dispose();
    edgeGeo.dispose();
    edgeMat.dispose();
    sGeo.dispose();
    sMat.dispose();
    ringConfigs.forEach(() => {});
    particleGeo.dispose();
    particleMat.dispose();
  }, { once: true });
})();
