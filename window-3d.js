import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const LUMI = window.LUMI;
let active = false;
let renderer = null;
let scene = null;
let camera = null;
let model = null;
let animationFrame = 0;
let resizeObserver = null;
let drag = null;
let targetRotation = { x: 0.035, y: -0.16 };
let currentRotation = { x: 0.035, y: -0.16 };
let cameraZ = 5.6;

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const root = () => document.getElementById('windowCanvas');
const state = () => LUMI?.state;
const scheme = () => LUMI?.currentScheme?.();

function disposeObject(object) {
  object?.traverse?.((child) => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach((m) => m?.dispose?.());
    else child.material?.dispose?.();
  });
}

function destroy() {
  cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  resizeObserver?.disconnect?.();
  resizeObserver = null;
  if (model) disposeObject(model);
  renderer?.dispose?.();
  renderer = null;
  scene = null;
  camera = null;
  model = null;
  drag = null;
}

function frameMaterial() {
  const s = state();
  const color = s?.material === 'mat_aluminum' ? 0x4b535a : 0xf4f5f3;
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: s?.material === 'mat_aluminum' ? 0.4 : 0.62,
    metalness: s?.material === 'mat_aluminum' ? 0.35 : 0.03,
    clearcoat: 0.18,
    clearcoatRoughness: 0.65
  });
}

function glassMaterial() {
  const comfort = state()?.comfort;
  const color = ['cf_solar', 'cf_yearround'].includes(comfort) ? 0x93b2c1 : 0xbfd9e7;
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: 0.31,
    roughness: 0.06,
    metalness: 0,
    transmission: 0.42,
    thickness: 0.045,
    side: THREE.DoubleSide
  });
}

function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addRectFrame(group, w, h, thickness, depth, material) {
  group.add(box(w, thickness, depth, material, 0, h / 2 - thickness / 2, 0));
  group.add(box(w, thickness, depth, material, 0, -h / 2 + thickness / 2, 0));
  group.add(box(thickness, Math.max(0.01, h - thickness * 2), depth, material, -w / 2 + thickness / 2, 0, 0));
  group.add(box(thickness, Math.max(0.01, h - thickness * 2), depth, material, w / 2 - thickness / 2, 0, 0));
}

function addHandle(group, x, y, side = 1) {
  const material = new THREE.MeshStandardMaterial({ color: 0x87919a, metalness: 0.7, roughness: 0.28 });
  const stem = box(0.028, 0.16, 0.035, material, x, y, 0.105);
  const grip = box(0.1, 0.026, 0.035, material, x + side * 0.038, y + 0.055, 0.105);
  group.add(stem, grip);
}

function addPanel(parent, x, y, w, h, opening, index, frameMat, glassMat) {
  const sash = new THREE.Group();
  const sashT = clamp(Math.min(w, h) * 0.055, 0.045, 0.085);
  const depth = 0.105;

  const glass = box(Math.max(0.05, w - sashT * 2.15), Math.max(0.05, h - sashT * 2.15), 0.025, glassMat, 0, 0, 0);
  glass.castShadow = false;
  sash.add(glass);
  addRectFrame(sash, w, h, sashT, depth, frameMat);

  const opens = opening && opening !== 'op_fixed';
  if (opens && !['op_psk', 'op_lift_slide'].includes(opening)) {
    const handleSide = index % 2 === 0 ? 1 : -1;
    addHandle(sash, handleSide * (w / 2 - sashT * 1.8), 0, -handleSide);
  }

  sash.position.set(x, y, 0.035);

  // Небольшой визуальный намёк на механику открывания: модель остаётся компактной,
  // но выбранный тип створки различим уже в 3D-превью.
  if (opening === 'op_turn') sash.rotation.y = (index % 2 === 0 ? -1 : 1) * 0.075;
  if (opening === 'op_tilt_turn') {
    sash.rotation.y = (index % 2 === 0 ? -1 : 1) * 0.055;
    sash.rotation.x = -0.035;
  }
  if (opening === 'op_tilt') sash.rotation.x = -0.065;
  if (opening === 'op_psk') sash.position.x += index % 2 === 0 ? 0.045 : -0.045;
  if (opening === 'op_lift_slide') sash.position.x += index % 2 === 0 ? 0.08 : -0.08;

  parent.add(sash);
}

function buildModel() {
  const s = state();
  const sc = scheme();
  const group = new THREE.Group();
  if (!s || !sc) return group;

  const ratio = clamp(Number(s.width || 1400) / Number(s.height || 1500), 0.48, 3.8);
  const H = 2.45;
  const W = clamp(H * ratio, 1.18, 5.25);
  const outerT = clamp(Math.min(W, H) * 0.065, 0.09, 0.15);
  const outerD = s.material === 'mat_aluminum' ? 0.18 : 0.21;
  const frameMat = frameMaterial();
  const glassMat = glassMaterial();

  addRectFrame(group, W, H, outerT, outerD, frameMat);

  const innerW = Math.max(0.2, W - outerT * 2.2);
  const innerH = Math.max(0.2, H - outerT * 2.2);
  const sections = Array.isArray(s.sectionOpenings) && s.sectionOpenings.length
    ? s.sectionOpenings
    : [{ role: 'window', ratio: 1, opening: 'op_fixed' }];

  if (sc.layout === 'transom') {
    const transomH = innerH * 0.24;
    const gap = outerT * 0.7;
    const mainH = innerH - transomH - gap;
    const trans = sections.find((x) => x.role === 'transom') || sections[0];
    const main = sections.find((x) => x.role !== 'transom') || sections[0];
    const dividerY = innerH / 2 - transomH - gap / 2;
    group.add(box(innerW, outerT * 0.72, outerD * 0.95, frameMat, 0, dividerY, 0));
    addPanel(group, 0, innerH / 2 - transomH / 2, innerW - 0.025, transomH - gap * 0.35, trans.opening, 0, frameMat, glassMat);
    addPanel(group, 0, -innerH / 2 + mainH / 2, innerW - 0.025, mainH - gap * 0.35, main.opening, 1, frameMat, glassMat);
  } else {
    const total = sections.reduce((sum, sec) => sum + Number(sec.ratio || 1), 0) || 1;
    const mullion = sc.uxMode === 'shtulp' ? outerT * 0.28 : outerT * 0.72;
    const usable = innerW - mullion * Math.max(0, sections.length - 1);
    let cursor = -innerW / 2;

    sections.forEach((sec, index) => {
      const panelW = usable * Number(sec.ratio || 1) / total;
      const cx = cursor + panelW / 2;
      addPanel(group, cx, 0, Math.max(0.12, panelW - 0.018), innerH - 0.018, sec.opening, index, frameMat, glassMat);
      cursor += panelW;
      if (index < sections.length - 1) {
        const mx = cursor + mullion / 2;
        group.add(box(mullion, innerH, outerD * 0.95, frameMat, mx, 0, 0));
        cursor += mullion;
      }
    });
  }

  // Небольшая нижняя опора помогает считывать глубину профиля.
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(W * 1.07, 0.055, 0.46),
    new THREE.MeshStandardMaterial({ color: 0xd9dde0, roughness: 0.8 })
  );
  sill.position.set(0, -H / 2 - 0.065, 0.055);
  sill.receiveShadow = true;
  group.add(sill);

  group.userData.dimensions = { W, H };
  return group;
}

function fitRenderer(host) {
  if (!renderer || !camera) return;
  const width = Math.max(260, host.clientWidth || 620);
  const height = Math.max(250, host.clientHeight || 385);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function updateTabs() {
  document.querySelectorAll('.view-tabs button').forEach((button) => {
    button.classList.toggle('is-active', active ? button.hasAttribute('data-view3d') : button.dataset.view === state()?.view);
  });
}

function mount() {
  if (!active) return;
  const host = root();
  if (!host || !LUMI) return;

  destroy();
  host.innerHTML = `
    <div class="window3d-shell">
      <div class="window3d-viewport" aria-label="Интерактивная 3D-модель окна"></div>
      <div class="window3d-hint"><span>↔</span> Поверните модель мышью или пальцем <b>·</b> колесо — масштаб</div>
      <button class="window3d-reset" type="button" aria-label="Сбросить положение 3D-модели">Сбросить вид</button>
      <div class="window3d-dimensions"></div>
    </div>`;

  const viewport = host.querySelector('.window3d-viewport');
  const dimensions = host.querySelector('.window3d-dimensions');
  const s = state();
  dimensions.textContent = `${LUMI.currentType?.()?.name || 'Конструкция'} · ${s.width} × ${s.height} мм`;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.18, cameraZ);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 'window3d-canvas';
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xf5fbff, 0x8b969e, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.7);
  key.position.set(3.2, 4.8, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb8d8ff, 1.25);
  rim.position.set(-4.5, 1.8, -1.5);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    new THREE.ShadowMaterial({ color: 0x355066, opacity: 0.11 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.34;
  floor.receiveShadow = true;
  scene.add(floor);

  model = buildModel();
  model.rotation.order = 'YXZ';
  scene.add(model);

  const dims = model.userData.dimensions || { W: 2.5, H: 2.5 };
  const biggest = Math.max(dims.W, dims.H);
  cameraZ = clamp(biggest * 1.72, 4.2, 8.2);
  camera.position.z = cameraZ;

  targetRotation = { x: 0.035, y: -0.16 };
  currentRotation = { ...targetRotation };

  const onPointerDown = (event) => {
    renderer.domElement.setPointerCapture?.(event.pointerId);
    drag = { x: event.clientX, y: event.clientY, ry: targetRotation.y, rx: targetRotation.x };
    renderer.domElement.classList.add('is-dragging');
  };
  const onPointerMove = (event) => {
    if (!drag) return;
    targetRotation.y = drag.ry + (event.clientX - drag.x) * 0.008;
    targetRotation.x = clamp(drag.rx + (event.clientY - drag.y) * 0.005, -0.42, 0.42);
  };
  const onPointerUp = () => {
    drag = null;
    renderer?.domElement?.classList.remove('is-dragging');
  };
  const onWheel = (event) => {
    event.preventDefault();
    cameraZ = clamp(cameraZ + event.deltaY * 0.004, 3.1, 10.5);
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointercancel', onPointerUp);
  renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

  host.querySelector('.window3d-reset')?.addEventListener('click', (event) => {
    event.stopPropagation();
    targetRotation = { x: 0.035, y: -0.16 };
    cameraZ = clamp(biggest * 1.72, 4.2, 8.2);
  });

  resizeObserver = new ResizeObserver(() => fitRenderer(viewport));
  resizeObserver.observe(viewport);
  fitRenderer(viewport);
  updateTabs();

  const animate = () => {
    if (!active || !renderer || !scene || !camera || !model) return;
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;
    model.rotation.x = currentRotation.x;
    model.rotation.y = currentRotation.y;
    camera.position.z += (cameraZ - camera.position.z) * 0.12;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  };
  animate();
}

function scheduleMount() {
  if (!active) return;
  window.setTimeout(() => {
    if (active) mount();
  }, 0);
}

document.addEventListener('click', (event) => {
  const threeButton = event.target.closest('[data-view3d]');
  if (threeButton) {
    event.preventDefault();
    active = true;
    mount();
    return;
  }

  if (event.target.closest('[data-view]')) {
    active = false;
    destroy();
    window.setTimeout(updateTabs, 0);
    return;
  }

  if (event.target.closest('[data-action],[data-nudge],[data-window-count],[data-preset],[data-context],[data-mosquito-index],[data-go-step],#resetBtn')) {
    scheduleMount();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.matches('#widthInput,#heightInput,[data-extra-field]')) scheduleMount();
});

window.addEventListener('beforeunload', destroy);
