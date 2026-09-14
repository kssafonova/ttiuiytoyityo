(()=>{
  'use strict';
  const LUMI=window.LUMI;
  const ASSETS={
    ct_window:'assets/models/ordinary_window.json',
    ct_panoramic:'assets/models/panoramic_window.json',
    ct_balcony_block:'assets/models/balcony_block.json',
    ct_panoramic_door:'assets/models/hs_portal.json'
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const root=()=>document.getElementById('windowCanvas');
  const state=()=>LUMI&&LUMI.state;
  let active=false,renderer=null,scene=null,camera=null,model=null,raf=0,resizeObserver=null,drag=null,mountToken=0;
  let target={x:.04,y:-.18},current={...target},cameraZ=5.5;
  const cache=new Map();

  function updateTabs(){
    document.querySelectorAll('.view-tabs button').forEach(b=>b.classList.toggle('is-active',active?b.hasAttribute('data-view3d'):b.dataset.view===state()?.view));
  }
  function dispose(){
    cancelAnimationFrame(raf);raf=0;
    resizeObserver?.disconnect?.();resizeObserver=null;
    if(model&&model.traverse)model.traverse(c=>{c.geometry?.dispose?.();if(Array.isArray(c.material))c.material.forEach(m=>m?.dispose?.());else c.material?.dispose?.();});
    renderer?.dispose?.();renderer=null;scene=null;camera=null;model=null;drag=null;
  }
  function shell(){
    const s=state()||{};
    return `<div class="window3d-shell"><div class="window3d-viewport"><div class="window3d-loading">Загружаем 3D-модель…</div></div><div class="window3d-hint"><span>↔</span> Поверните модель мышью или пальцем <b>·</b> колесо — масштаб</div><button class="window3d-reset" type="button">Сбросить вид</button><div class="window3d-dimensions">${LUMI?.currentType?.()?.name||'Конструкция'} · ${s.width||''} × ${s.height||''} мм</div></div>`;
  }
  function fallbackMarkup(type){
    const cls={ct_window:'fallback-window',ct_panoramic:'fallback-panoramic',ct_balcony_block:'fallback-balcony',ct_panoramic_door:'fallback-portal'}[type]||'fallback-window';
    if(type==='ct_balcony_block')return `<div class="fallback3d-object ${cls}"><div class="fb-frame"><div class="fb-pane fb-window-pane"></div><div class="fb-pane fb-door-pane"></div></div><div class="fb-sill"></div></div>`;
    const count=type==='ct_panoramic'?3:type==='ct_panoramic_door'?2:2;
    return `<div class="fallback3d-object ${cls}"><div class="fb-frame">${Array.from({length:count},(_,i)=>`<div class="fb-pane ${i===0?'fb-active':''}"></div>`).join('')}</div><div class="fb-sill"></div></div>`;
  }
  function mountFallback(reason){
    const host=root();if(!host)return;
    const s=state()||{};
    host.innerHTML=shell();
    const vp=host.querySelector('.window3d-viewport');
    vp.innerHTML=`<div class="fallback3d-stage">${fallbackMarkup(s.type)}<div class="fallback3d-note">Интерактивный 3D · совместимый режим</div></div>`;
    const obj=vp.querySelector('.fallback3d-object');
    let rx=-5,ry=-18,start=null;
    const apply=()=>obj.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`;
    apply();
    vp.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY,rx,ry};vp.setPointerCapture?.(e.pointerId);});
    vp.addEventListener('pointermove',e=>{if(!start)return;ry=start.ry+(e.clientX-start.x)*.28;rx=clamp(start.rx-(e.clientY-start.y)*.18,-28,28);apply();});
    const end=()=>start=null;vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);
    host.querySelector('.window3d-reset')?.addEventListener('click',e=>{e.stopPropagation();rx=-5;ry=-18;apply();});
    if(reason)console.warn('3D fallback:',reason);
    updateTabs();
  }
  async function loadDefinition(url){
    if(cache.has(url))return cache.get(url);
    const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`asset ${r.status}`);
    const d=await r.json();cache.set(url,d);return d;
  }
  function mats(THREE){
    const s=state()||{},al=s.material==='mat_aluminum',solar=['cf_solar','cf_yearround'].includes(s.comfort);
    return {
      frame:new THREE.MeshPhysicalMaterial({color:al?0x3c4348:0xf1f3f2,roughness:al?0.34:0.58,metalness:al?0.62:0.03,clearcoat:0.18}),
      glass:new THREE.MeshPhysicalMaterial({color:solar?0x8faebb:0xb9d8e7,transparent:true,opacity:0.34,roughness:0.08,metalness:0,side:THREE.DoubleSide}),
      metal:new THREE.MeshStandardMaterial({color:0x858e94,metalness:0.8,roughness:0.28}),
      sill:new THREE.MeshStandardMaterial({color:0xd7dbde,roughness:0.8})
    };
  }
  function addBox(THREE,g,p,m){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(p.w,p.h,p.d),m[p.material]||m.frame);
    mesh.position.set(p.x||0,p.y||0,p.z||0);if(p.rx)mesh.rotation.x=p.rx;if(p.ry)mesh.rotation.y=p.ry;if(p.rz)mesh.rotation.z=p.rz;
    mesh.castShadow=p.material!=='glass';mesh.receiveShadow=true;g.add(mesh);
  }
  function addFrame(THREE,g,p,m){
    const x=p.x||0,y=p.y||0,z=p.z||0,w=p.w,h=p.h,t=p.t,d=p.d,material=p.material||'frame';
    addBox(THREE,g,{x,y:y+h/2-t/2,z,w,h:t,d,material},m);addBox(THREE,g,{x,y:y-h/2+t/2,z,w,h:t,d,material},m);
    addBox(THREE,g,{x:x-w/2+t/2,y,z,w:t,h:Math.max(0.01,h-2*t),d,material},m);addBox(THREE,g,{x:x+w/2-t/2,y,z,w:t,h:Math.max(0.01,h-2*t),d,material},m);
  }
  function build(THREE,def){
    const g=new THREE.Group(),m=mats(THREE);
    (def.parts||[]).forEach(p=>{if(p.kind==='frame')addFrame(THREE,g,p,m);else if(p.kind==='handle'){addBox(THREE,g,{x:p.x||0,y:p.y||0,z:p.z||0.13,w:0.032,h:0.20,d:0.045,material:'metal'},m);addBox(THREE,g,{x:(p.x||0)+(p.side||1)*0.043,y:(p.y||0)+0.062,z:p.z||0.13,w:0.115,h:0.026,d:0.045,material:'metal'},m);}else addBox(THREE,g,p,m);});
    const s=state()||{},tw=Math.max(0.4,Number(s.width||1400)/1000),th=Math.max(0.4,Number(s.height||1500)/1000);
    g.scale.set(clamp(tw/def.baseWidth,0.45,2.4),clamp(th/def.baseHeight,0.45,2.4),1);g.userData.displayWidth=tw;g.userData.displayHeight=th;return g;
  }
  function fit(vp){if(!renderer||!camera)return;const w=Math.max(260,vp.clientWidth||620),h=Math.max(250,vp.clientHeight||385);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  async function mountWebGL(){
    const THREE=window.THREE;if(!THREE)throw new Error('Three.js not loaded');
    const token=++mountToken,host=root();if(!host)return;dispose();host.innerHTML=shell();updateTabs();
    const vp=host.querySelector('.window3d-viewport'),s=state()||{};
    const def=await loadDefinition(ASSETS[s.type]||ASSETS.ct_window);if(token!==mountToken||!active)return;
    vp.innerHTML='';scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,0.1,100);renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    if('outputEncoding' in renderer&&THREE.sRGBEncoding)renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.domElement.className='window3d-canvas';vp.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf8fcff,0x84909a,2));const key=new THREE.DirectionalLight(0xffffff,2.7);key.position.set(3.5,4.8,5.6);key.castShadow=true;scene.add(key);
    model=build(THREE,def);model.rotation.order='YXZ';scene.add(model);const biggest=Math.max(model.userData.displayWidth,model.userData.displayHeight);cameraZ=clamp(biggest*1.75,4,8.8);camera.position.set(0,0.12,cameraZ);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,9),new THREE.ShadowMaterial({color:0x355066,opacity:0.10}));floor.rotation.x=-Math.PI/2;floor.position.y=-(model.userData.displayHeight/2)-0.14;floor.receiveShadow=true;scene.add(floor);
    target={x:0.04,y:-0.18};current={...target};const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture?.(e.pointerId);drag={x:e.clientX,y:e.clientY,rx:target.x,ry:target.y};canvas.classList.add('is-dragging');});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;target.y=drag.ry+(e.clientX-drag.x)*0.008;target.x=clamp(drag.rx+(e.clientY-drag.y)*0.005,-0.42,0.42);});
    const release=()=>{drag=null;canvas.classList.remove('is-dragging');};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('wheel',e=>{e.preventDefault();cameraZ=clamp(cameraZ+e.deltaY*0.004,2.8,11);},{passive:false});
    host.querySelector('.window3d-reset')?.addEventListener('click',e=>{e.stopPropagation();target={x:0.04,y:-0.18};cameraZ=clamp(biggest*1.75,4,8.8);});
    if(window.ResizeObserver){resizeObserver=new ResizeObserver(()=>fit(vp));resizeObserver.observe(vp);}fit(vp);
    const animate=()=>{if(!active||!renderer||!scene||!camera||!model)return;current.x+=(target.x-current.x)*0.12;current.y+=(target.y-current.y)*0.12;model.rotation.x=current.x;model.rotation.y=current.y;camera.position.z+=(cameraZ-camera.position.z)*0.12;renderer.render(scene,camera);raf=requestAnimationFrame(animate);};animate();
  }
  async function mount(){
    if(!active||!LUMI)return;
    try{await mountWebGL();}catch(err){dispose();mountFallback(err?.message||String(err));}
  }
  function queue(){setTimeout(()=>active&&mount(),0);}
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-view3d]')){active=true;mount();return;}
    if(e.target.closest('[data-view]')&&active){active=false;++mountToken;dispose();updateTabs();return;}
    if(active&&!e.target.closest('.window3d-shell'))queue();
  });
  document.addEventListener('change',()=>{if(active)queue();});
  window.addEventListener('beforeunload',dispose);
})();