import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const LUMI = window.LUMI;
const ASSETS = {
  ct_window: 'assets/models/ordinary_window.json',
  ct_panoramic: 'assets/models/panoramic_window.json',
  ct_balcony_block: 'assets/models/balcony_block.json',
  ct_panoramic_door: 'assets/models/hs_portal.json'
};

let active = false;
let renderer = null;
let scene = null;
let camera = null;
let model = null;
let frameId = 0;
let resizeObserver = null;
let drag = null;
let cameraZ = 5.5;
let targetRotation = {x: 0.04, y: -0.18};
let currentRotation = {...targetRotation};
let mountToken = 0;
const cache = new Map();

const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
const root = ()=>document.getElementById('windowCanvas');
const state = ()=>LUMI?.state;

function disposeObject(obj){
  obj?.traverse?.(child=>{
    child.geometry?.dispose?.();
    if(Array.isArray(child.material)) child.material.forEach(m=>m?.dispose?.());
    else child.material?.dispose?.();
  });
}

function destroy(){
  cancelAnimationFrame(frameId); frameId=0;
  resizeObserver?.disconnect?.(); resizeObserver=null;
  if(model) disposeObject(model);
  renderer?.dispose?.();
  renderer=null;scene=null;camera=null;model=null;drag=null;
}

function materials(){
  const s=state();
  const aluminum=s?.material==='mat_aluminum';
  const solar=['cf_solar','cf_yearround'].includes(s?.comfort);
  return {
    frame:new THREE.MeshPhysicalMaterial({
      color:aluminum?0x3c4348:0xf1f3f2,
      roughness:aluminum?0.34:0.58,
      metalness:aluminum?0.62:0.03,
      clearcoat:0.18
    }),
    glass:new THREE.MeshPhysicalMaterial({color:solar?0x8faebb:0xb9d8e7,transparent:true,opacity:.34,roughness:.06,metalness:0,transmission:.38,thickness:.04,side:THREE.DoubleSide}),
    metal:new THREE.MeshStandardMaterial({color:0x858e94,metalness:.82,roughness:.25}),
    sill:new THREE.MeshStandardMaterial({color:0xd7dbde,roughness:.78})
  };
}

function addBox(group,p,mats){
  const mat=mats[p.material]||mats.frame;
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(p.w,p.h,p.d),mat);
  mesh.position.set(p.x||0,p.y||0,p.z||0);
  if(p.rx) mesh.rotation.x=p.rx;
  if(p.ry) mesh.rotation.y=p.ry;
  if(p.rz) mesh.rotation.z=p.rz;
  mesh.castShadow=p.material!=='glass';
  mesh.receiveShadow=true;
  mesh.userData.role=p.role||'';
  group.add(mesh);
}

function addFrame(group,p,mats){
  const x=p.x||0,y=p.y||0,z=p.z||0,w=p.w,h=p.h,t=p.t,d=p.d;
  addBox(group,{x,y:y+h/2-t/2,z,w,h:t,d,material:p.material||'frame',role:p.role},mats);
  addBox(group,{x,y:y-h/2+t/2,z,w,h:t,d,material:p.material||'frame',role:p.role},mats);
  addBox(group,{x:x-w/2+t/2,y,z,w:t,h:Math.max(.01,h-2*t),d,material:p.material||'frame',role:p.role},mats);
  addBox(group,{x:x+w/2-t/2,y,z,w:t,h:Math.max(.01,h-2*t),d,material:p.material||'frame',role:p.role},mats);
}

function addHandle(group,p,mats){
  const side=p.side||1;
  addBox(group,{x:p.x||0,y:p.y||0,z:p.z||.13,w:.032,h:.20,d:.045,material:'metal',role:'handle'},mats);
  addBox(group,{x:(p.x||0)+side*.043,y:(p.y||0)+.062,z:p.z||.13,w:.115,h:.026,d:.045,material:'metal',role:'handle'},mats);
}

function buildFromDefinition(def){
  const group=new THREE.Group();
  const mats=materials();
  (def.parts||[]).forEach(p=>{
    if(p.kind==='frame') addFrame(group,p,mats);
    else if(p.kind==='handle') addHandle(group,p,mats);
    else addBox(group,p,mats);
  });
  const s=state();
  const targetW=Math.max(.4,Number(s?.width||1400)/1000);
  const targetH=Math.max(.4,Number(s?.height||1500)/1000);
  group.scale.set(clamp(targetW/def.baseWidth,.45,2.4),clamp(targetH/def.baseHeight,.45,2.4),1);
  group.userData.displayWidth=targetW;
  group.userData.displayHeight=targetH;
  return group;
}

async function loadDefinition(url){
  if(cache.has(url)) return cache.get(url);
  const res=await fetch(url,{cache:'no-store'});
  if(!res.ok) throw new Error(`Model asset ${res.status}`);
  const data=await res.json();
  cache.set(url,data);
  return data;
}

function fitRenderer(host){
  if(!renderer||!camera)return;
  const width=Math.max(260,host.clientWidth||620);
  const height=Math.max(250,host.clientHeight||385);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(width,height,false);
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
}

function updateTabs(){
  document.querySelectorAll('.view-tabs button').forEach(button=>{
    button.classList.toggle('is-active',active?button.hasAttribute('data-view3d'):button.dataset.view===state()?.view);
  });
}

function setupInteraction(host,viewport,biggest){
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{
    canvas.setPointerCapture?.(e.pointerId);
    drag={x:e.clientX,y:e.clientY,rx:targetRotation.x,ry:targetRotation.y};
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag)return;
    targetRotation.y=drag.ry+(e.clientX-drag.x)*.008;
    targetRotation.x=clamp(drag.rx+(e.clientY-drag.y)*.005,-.42,.42);
  });
  const release=()=>{drag=null;canvas.classList.remove('is-dragging');};
  canvas.addEventListener('pointerup',release);
  canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('wheel',e=>{e.preventDefault();cameraZ=clamp(cameraZ+e.deltaY*.004,2.8,11);},{passive:false});
  host.querySelector('.window3d-reset')?.addEventListener('click',e=>{
    e.stopPropagation();
    targetRotation={x:.04,y:-.18};
    cameraZ=clamp(biggest*1.75,4.0,8.8);
  });
  resizeObserver=new ResizeObserver(()=>fitRenderer(viewport));
  resizeObserver.observe(viewport);
  fitRenderer(viewport);
}

async function mount(){
  if(!active||!LUMI)return;
  const token=++mountToken;
  const host=root(); if(!host)return;
  destroy();
  host.innerHTML=`<div class="window3d-shell"><div class="window3d-viewport"><div class="window3d-loading">Загружаем 3D-модель…</div></div><div class="window3d-hint"><span>↔</span> Поверните модель мышью или пальцем <b>·</b> колесо — масштаб</div><button class="window3d-reset" type="button">Сбросить вид</button><div class="window3d-dimensions"></div></div>`;
  const viewport=host.querySelector('.window3d-viewport');
  const s=state();
  host.querySelector('.window3d-dimensions').textContent=`${LUMI.currentType?.()?.name||'Конструкция'} · ${s.width} × ${s.height} мм`;
  updateTabs();

  try{
    const url=ASSETS[s.type]||ASSETS.ct_window;
    const def=await loadDefinition(url);
    if(token!==mountToken||!active)return;

    viewport.innerHTML='';
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(34,1,.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.className='window3d-canvas';
    viewport.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xf8fcff,0x84909a,2.05));
    const key=new THREE.DirectionalLight(0xffffff,2.8); key.position.set(3.5,4.8,5.6); key.castShadow=true; scene.add(key);
    const rim=new THREE.DirectionalLight(0xb9d9ff,1.15); rim.position.set(-4,2,-2); scene.add(rim);

    model=buildFromDefinition(def);
    model.rotation.order='YXZ';
    scene.add(model);
    const biggest=Math.max(model.userData.displayWidth,model.userData.displayHeight);
    cameraZ=clamp(biggest*1.75,4.0,8.8);
    camera.position.set(0,.12,cameraZ);

    const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,9),new THREE.ShadowMaterial({color:0x355066,opacity:.10}));
    floor.rotation.x=-Math.PI/2;
    floor.position.y=-(model.userData.displayHeight/2)-.14;
    floor.receiveShadow=true;
    scene.add(floor);

    targetRotation={x:.04,y:-.18}; currentRotation={...targetRotation};
    setupInteraction(host,viewport,biggest);
    const animate=()=>{
      if(!active||!renderer||!scene||!camera||!model)return;
      currentRotation.x+=(targetRotation.x-currentRotation.x)*.12;
      currentRotation.y+=(targetRotation.y-currentRotation.y)*.12;
      model.rotation.x=currentRotation.x;
      model.rotation.y=currentRotation.y;
      camera.position.z+=(cameraZ-camera.position.z)*.12;
      renderer.render(scene,camera);
      frameId=requestAnimationFrame(animate);
    };
    animate();
  }catch(err){
    console.error(err);
    if(token!==mountToken)return;
    viewport.innerHTML='<div class="window3d-error"><strong>3D-модель не загрузилась</strong><span>Обычная схема конфигуратора продолжает работать.</span></div>';
  }
}

function queueMount(){setTimeout(()=>{if(active)mount();},0);}

document.addEventListener('click',e=>{
  const view3d=e.target.closest('[data-view3d]');
  if(view3d){active=true;mount();return;}
  const regular=e.target.closest('[data-view]');
  if(regular&&active){active=false;++mountToken;destroy();updateTabs();return;}
  if(active&&!e.target.closest('.window3d-shell'))queueMount();
});
document.addEventListener('change',()=>{if(active)queueMount();});
window.addEventListener('beforeunload',destroy);
