(()=>{
  'use strict';
  const L=window.LUMI,S=window.LUMI3D_SPEC,G=window.LUMI3D_GEOMETRY;
  if(!L||!S||!G)return;
  const root=()=>document.getElementById('windowCanvas');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  let active=false,renderer=null,scene=null,camera=null,model=null,raf=0,ro=null,drag=null;
  let rot={x:.035,y:-.20},target={...rot},cameraZ=5;
  function disposeObject(obj){obj?.traverse?.(c=>{c.geometry?.dispose?.();if(Array.isArray(c.material))c.material.forEach(m=>m?.dispose?.());else c.material?.dispose?.();});}
  function destroy(){cancelAnimationFrame(raf);raf=0;ro?.disconnect?.();ro=null;disposeObject(model);model=null;renderer?.dispose?.();renderer=null;scene=null;camera=null;drag=null;}
  function spec(){return S.resolve(L.state,L.currentScheme?.());}
  function badges(sp){return sp.sections.map(x=>`<span><b>${x.label}</b>${x.openingLabel}</span>`).join('');}
  function shell(sp){return `<div class="l3d-shell"><div class="l3d-stage"><div class="l3d-loading">Строим 3D-модель…</div></div><div class="l3d-top"><strong>${sp.label}</strong><em>${sp.widthMm} × ${sp.heightMm} мм</em></div><div class="l3d-badges">${badges(sp)}</div><div class="l3d-help">Потяните — повернуть · колесо — приблизить</div><button class="l3d-reset" type="button">Сбросить вид</button></div>`;}
  function fallback(sp){
    const total=sp.sections.reduce((a,s)=>a+s.ratio,0)||1;
    const parts=sp.sections.map(s=>{const cls=['l3d-fb-pane',s.role==='balcony_door'||s.role==='entrance_door'?'is-door':'',`op-${s.opening}`].join(' ');return `<div class="${cls}" style="flex:${s.ratio/total}"><i></i></div>`;}).join('');
    return `<div class="l3d-fallback"><div class="l3d-fb-model kind-${sp.kind}"><div class="l3d-fb-frame">${parts}</div></div><small>Совместимый режим визуализации</small></div>`;
  }
  function updateTabs(){document.querySelectorAll('.view-tabs button').forEach(b=>b.classList.toggle('is-active',active?b.hasAttribute('data-view3d'):b.dataset.view===L.state.view));}
  function fit(stage){if(!renderer||!camera)return;const w=Math.max(280,stage.clientWidth||620),h=Math.max(280,stage.clientHeight||390);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function fitCamera(sp){if(!camera||!model)return;const biggest=Math.max(model.userData.displayWidth||1,model.userData.displayHeight||1);cameraZ=clamp(biggest*1.72,3.1,10.5);camera.position.set(0,.06,cameraZ);camera.lookAt(0,0,0);}
  function rebuildModel(){
    if(!active||!scene||!window.THREE)return;
    disposeObject(model);if(model)scene.remove(model);
    const sp=spec();model=G.build(window.THREE,sp,L.state);model.rotation.order='YXZ';model.rotation.x=rot.x;model.rotation.y=rot.y;scene.add(model);fitCamera(sp);
    const host=root();if(host){const top=host.querySelector('.l3d-top');if(top)top.innerHTML=`<strong>${sp.label}</strong><em>${sp.widthMm} × ${sp.heightMm} мм</em>`;const b=host.querySelector('.l3d-badges');if(b)b.innerHTML=badges(sp);}
  }
  function setupScene(stage,sp){
    const T=window.THREE;if(!T)throw new Error('Three.js unavailable');
    scene=new T.Scene();camera=new T.PerspectiveCamera(33,1,.1,100);
    renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.domElement.className='l3d-canvas';stage.innerHTML='';stage.appendChild(renderer.domElement);
    scene.add(new T.HemisphereLight(0xf7fbff,0x7a8791,1.9));
    const key=new T.DirectionalLight(0xffffff,2.6);key.position.set(4,5,6);key.castShadow=true;scene.add(key);
    const fill=new T.DirectionalLight(0xbdd8eb,.85);fill.position.set(-4,2,2);scene.add(fill);
    const back=new T.DirectionalLight(0xffffff,.55);back.position.set(0,2,-5);scene.add(back);
    const floor=new T.Mesh(new T.PlaneGeometry(14,9),new T.ShadowMaterial({color:0x27445c,opacity:.11}));floor.rotation.x=-Math.PI/2;floor.position.y=-(Math.max(.7,sp.heightMm/1000)/2)-.12;floor.receiveShadow=true;scene.add(floor);
    rebuildModel();
    const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture?.(e.pointerId);drag={x:e.clientX,y:e.clientY,rx:target.x,ry:target.y};canvas.classList.add('dragging');});
    canvas.addEventListener('pointermove',e=>{if(!drag)return;target.y=drag.ry+(e.clientX-drag.x)*.008;target.x=clamp(drag.rx+(e.clientY-drag.y)*.005,-.40,.40);});
    const up=()=>{drag=null;canvas.classList.remove('dragging');};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    canvas.addEventListener('wheel',e=>{e.preventDefault();cameraZ=clamp(cameraZ+e.deltaY*.004,2.4,12);},{passive:false});
    root()?.querySelector('.l3d-reset')?.addEventListener('click',e=>{e.stopPropagation();target={x:.035,y:-.20};rot={...target};fitCamera(spec());});
    if(window.ResizeObserver){ro=new ResizeObserver(()=>fit(stage));ro.observe(stage);}fit(stage);
    const animate=()=>{if(!active||!renderer||!scene||!camera)return;rot.x+=(target.x-rot.x)*.12;rot.y+=(target.y-rot.y)*.12;if(model){model.rotation.x=rot.x;model.rotation.y=rot.y;}camera.position.z+=(cameraZ-camera.position.z)*.12;renderer.render(scene,camera);raf=requestAnimationFrame(animate);};animate();
  }
  function mount(){
    const host=root();if(!host)return;destroy();const sp=spec();host.innerHTML=shell(sp);updateTabs();const stage=host.querySelector('.l3d-stage');
    try{setupScene(stage,sp);}catch(err){console.warn('3D fallback',err);stage.innerHTML=fallback(sp);}
  }
  const originalDispatch=L.dispatch.bind(L);
  L.dispatch=function(action){const result=originalDispatch(action);window.dispatchEvent(new CustomEvent('lumi:statechange',{detail:action}));return result;};
  window.addEventListener('lumi:statechange',()=>{if(active)setTimeout(()=>{if(scene&&window.THREE)rebuildModel();else mount();},0);});
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-view3d]')){active=true;mount();return;}
    if(e.target.closest('[data-view]')&&active){active=false;destroy();updateTabs();return;}
  });
  window.addEventListener('beforeunload',destroy);
})();