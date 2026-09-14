(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.LUMI3D_GEOMETRY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function materials(THREE,spec,state){
    const aluminum=spec.material==='mat_aluminum';
    const solar=['cf_solar','cf_yearround'].includes(state?.comfort);
    return {
      frame:new THREE.MeshPhysicalMaterial({color:aluminum?0x343a3f:0xf4f5f2,roughness:aluminum?0.32:0.58,metalness:aluminum?0.68:0.02,clearcoat:0.14}),
      glass:new THREE.MeshPhysicalMaterial({color:solar?0x799aaa:0xa9cddd,transparent:true,opacity:0.38,roughness:0.08,metalness:0,side:THREE.DoubleSide}),
      metal:new THREE.MeshStandardMaterial({color:0x7d878e,metalness:0.88,roughness:0.22}),
      gasket:new THREE.MeshStandardMaterial({color:0x30363a,metalness:0.05,roughness:0.72}),
      wall:new THREE.MeshStandardMaterial({color:0xe8edf0,roughness:0.92})
    };
  }
  function box(THREE,g,w,h,d,x,y,z,mat){
    const m=new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.008,w),Math.max(0.008,h),Math.max(0.008,d)),mat);
    m.position.set(x||0,y||0,z||0);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;
  }
  function frame(THREE,g,w,h,t,d,mat){
    box(THREE,g,w,t,d,0,h/2-t/2,0,mat);box(THREE,g,w,t,d,0,-h/2+t/2,0,mat);
    box(THREE,g,t,h-2*t,d,-w/2+t/2,0,0,mat);box(THREE,g,t,h-2*t,d,w/2-t/2,0,0,mat);
  }
  function handle(THREE,g,w,h,hinge,mat){
    const x=hinge==='left'?w/2-0.055:-w/2+0.055;
    box(THREE,g,0.028,clamp(h*0.14,0.14,0.25),0.035,x,0,0.075,mat);
    box(THREE,g,0.105,0.024,0.035,x+(hinge==='left'?-0.035:0.035),0.055,0.075,mat);
  }
  function makeLeaf(THREE,w,h,profile,depth,mats,opening,hinge,role){
    const leaf=new THREE.Group();
    frame(THREE,leaf,w,h,profile,depth,mats.frame);
    const glassW=Math.max(0.08,w-profile*2.25),glassH=Math.max(0.08,h-profile*2.25);
    box(THREE,leaf,glassW,glassH,0.018,0,0,0.006,mats.glass);
    const gasketT=Math.max(0.012,profile*0.18);
    frame(THREE,leaf,glassW+gasketT*1.5,glassH+gasketT*1.5,gasketT,0.023,mats.gasket);
    if(opening!=='op_fixed')handle(THREE,leaf,w,h,hinge,mats.metal);
    leaf.userData={opening,role,w,h,hinge};
    return leaf;
  }
  function addLeafWithOpening(THREE,parent,cfg,mats){
    const {x,y,w,h,opening,role,index}=cfg;
    const profile=cfg.profile,depth=cfg.depth;
    const hinge=(index===0||x<0)?'left':'right';
    const leaf=makeLeaf(THREE,w,h,profile,depth,mats,opening,hinge,role);
    const pivot=new THREE.Group();
    if(opening==='op_turn'){
      const hx=hinge==='left'?x-w/2:x+w/2;pivot.position.set(hx,y,0.03);
      leaf.position.x=hinge==='left'?w/2:-w/2;pivot.rotation.y=hinge==='left'?-0.50:0.50;
    }else if(opening==='op_tilt'){
      pivot.position.set(x,y-h/2,0.03);leaf.position.y=h/2;pivot.rotation.x=-0.11;
    }else if(opening==='op_tilt_turn'){
      pivot.position.set(x,y-h/2,0.03);leaf.position.y=h/2;pivot.rotation.x=-0.19;
    }else if(opening==='op_psk'){
      pivot.position.set(x+w*0.34,y,0.17);leaf.position.set(0,0,0);
    }else if(opening==='op_lift_slide'){
      pivot.position.set(x+w*0.48,y+0.035,0.07);leaf.position.set(0,0,0);
    }else{
      pivot.position.set(x,y,0.015);
    }
    pivot.userData={opening,role,index};pivot.add(leaf);parent.add(pivot);return pivot;
  }
  function build(THREE,spec,state){
    const g=new THREE.Group(),mats=materials(THREE,spec,state);
    const W=clamp(spec.widthMm/1000,0.65,6.5),H=clamp(spec.heightMm/1000,0.65,3.4);
    const aluminum=spec.material==='mat_aluminum'||['hs','panoramic-door'].includes(spec.kind);
    const outerT=aluminum?0.065:0.09,depth=aluminum?0.095:0.13,sashT=aluminum?0.052:0.068;
    frame(THREE,g,W,H,outerT,depth,mats.frame);
    const sections=spec.sections.length?spec.sections:[{index:0,label:'Секция',role:'window',ratio:1,heightRatio:1,opening:'op_fixed'}];
    const gap=Math.max(0.045,outerT*0.72),innerW=Math.max(0.3,W-2*outerT),innerH=Math.max(0.3,H-2*outerT);
    const usableW=Math.max(0.22,innerW-gap*(sections.length-1)),sum=sections.reduce((a,s)=>a+Math.max(0.1,s.ratio),0);
    let cursor=-innerW/2;
    sections.forEach((s,i)=>{
      const sw=usableW*(Math.max(0.1,s.ratio)/sum),sh=innerH*((s.role==='window'&&spec.kind==='balcony')?0.70:1);
      const x=cursor+sw/2,y=(spec.kind==='balcony'&&s.role==='window')?innerH/2-sh/2:0;
      addLeafWithOpening(THREE,g,{x,y,w:Math.max(0.16,sw-0.018),h:Math.max(0.25,sh-0.018),opening:s.opening,role:s.role,index:i,profile:sashT,depth:depth*0.82},mats);
      if(spec.kind==='balcony'&&s.role==='window'){
        const wallH=Math.max(0.08,innerH-sh-0.03),wallY=-innerH/2+wallH/2;
        box(THREE,g,sw-0.01,wallH,0.055,x,wallY,-0.025,mats.wall);
      }
      if(i<sections.length-1){const mx=cursor+sw+gap/2;box(THREE,g,gap,innerH,depth*0.95,mx,0,0,mats.frame);}
      cursor+=sw+gap;
    });
    if(['hs','psk'].includes(spec.kind)){
      box(THREE,g,innerW,0.045,depth*1.85,0,-H/2+outerT+0.012,0.015,mats.metal);
      if(spec.kind==='hs')box(THREE,g,innerW,0.018,depth*1.25,0,-H/2+outerT+0.045,0.02,mats.gasket);
    }
    if(spec.kind==='panoramic-door')box(THREE,g,0.022,H*0.44,0.035,W/2-outerT*1.8,0,0.085,mats.metal);
    g.userData={displayWidth:W,displayHeight:H,kind:spec.kind,label:spec.label};
    return g;
  }
  return {build};
});