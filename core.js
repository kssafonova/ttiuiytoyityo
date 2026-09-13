(() => {
  const state = {
    step:0, width:1400, height:1500, type:'ct_double', scheme:'sc_double_fixed_left',
    sectionOpenings:[], material:'mat_pvc', thermalMode:'mode_warm', glazing:'gl_2ch', comfort:'cf_none',
    system:'sys_grazio', extras:new Set(['ex_mosquito']), view:'inside'
  };

  const lookup = (arr,id) => arr.find(x=>x.id===id);
  const currentScheme = () => (schemes[state.type]||[]).find(s=>s.id===state.scheme) || schemes[state.type]?.[0];
  const currentType = () => lookup(types,state.type);
  const currentMaterial = () => lookup(materials,state.material);
  const currentGlazing = () => lookup(glazing,state.glazing);
  const currentComfort = () => lookup(comfort,state.comfort);
  const currentSystem = () => lookup(systems,state.system);

  function cloneSectionsFromScheme(){
    state.sectionOpenings = (currentScheme()?.sections||[]).map(x=>({...x}));
  }

  function allowedMaterials(){
    if(['sc_pan_psk','sc_en_psk'].includes(state.scheme)) return materials.filter(m=>m.id==='mat_pvc');
    if(['sc_pan_lift_slide','sc_en_lift_slide'].includes(state.scheme)) return materials.filter(m=>m.id==='mat_aluminum');
    if(state.type==='ct_entrance' && !['sc_en_psk','sc_en_lift_slide'].includes(state.scheme)) return materials.filter(m=>m.id==='mat_aluminum');
    return materials;
  }

  function supportsColdAndWarm(){
    return state.material==='mat_aluminum' && ['ct_single','ct_double','ct_panoramic','ct_balcony_glazing'].includes(state.type) && state.scheme!=='sc_pan_lift_slide';
  }

  function allowedOpeningsForSection(sec){
    if(sec.role==='door') return ['op_turn'];
    if(sec.role==='portal') return sec.opening==='op_psk' ? ['op_psk','op_fixed'] : sec.opening==='op_lift_slide' ? ['op_lift_slide','op_fixed'] : ['op_fixed'];
    if(sec.role==='transom') return ['op_fixed','op_tilt'];
    if(['sc_pan_psk','sc_en_psk'].includes(state.scheme)) return ['op_psk','op_fixed'];
    if(['sc_pan_lift_slide','sc_en_lift_slide'].includes(state.scheme)) return ['op_lift_slide','op_fixed'];
    return ['op_fixed','op_turn','op_tilt_turn','op_tilt'];
  }

  function allowedGlazing(){
    if(state.material==='mat_aluminum' && state.thermalMode==='mode_cold') return glazing;
    return glazing.filter(x=>x.id!=='gl_single_glass');
  }

  function allowedComfort(){
    if(state.material==='mat_aluminum' && state.thermalMode==='mode_cold') return comfort.filter(c=>['cf_none','cf_solar','cf_safe','cf_crystal'].includes(c.id));
    return comfort;
  }

  function compatibleSystems(){
    if(state.material==='mat_pvc') return systems.filter(s=>['sys_blitz','sys_grazio','sys_intelio80'].includes(s.id));
    if(['sc_pan_lift_slide','sc_en_lift_slide'].includes(state.scheme)) return systems.filter(s=>s.id==='sys_s158');
    if(state.thermalMode==='mode_cold') return systems.filter(s=>s.id==='sys_s50');
    return systems.filter(s=>['sys_s60','sys_s70'].includes(s.id));
  }

  function recommendedSystemId(list=compatibleSystems()){
    if(!list.length) return null;
    if(list.length===1) return list[0].id;
    if(state.material==='mat_pvc'){
      if(['cf_quiet','cf_quiet_safe'].includes(state.comfort)) return 'sys_intelio80';
      if(state.type==='ct_panoramic' && state.width>=2200) return 'sys_intelio80';
      return 'sys_grazio';
    }
    if(state.type==='ct_panoramic' || state.width>=2200 || ['cf_quiet','cf_quiet_safe','cf_safe'].includes(state.comfort)) return list.some(s=>s.id==='sys_s70')?'sys_s70':list[0].id;
    return list.some(s=>s.id==='sys_s60')?'sys_s60':list[0].id;
  }

  function allowedExtras(){
    const activeWindow = state.sectionOpenings.some(s=>['op_turn','op_tilt_turn','op_tilt'].includes(s.opening));
    const portal = state.sectionOpenings.some(s=>['op_psk','op_lift_slide'].includes(s.opening));
    return extras.filter(x=>{
      if(x.id==='ex_mosquito') return activeWindow && !portal;
      if(x.id==='ex_sill') return state.type!=='ct_entrance' && !portal;
      if(['ex_child_lock','ex_limiter'].includes(x.id)) return activeWindow;
      return true;
    });
  }

  function normalizeState(){
    const scs=schemes[state.type]||[];
    if(!scs.some(x=>x.id===state.scheme)) state.scheme=scs[0]?.id;
    if(!state.sectionOpenings.length || state.sectionOpenings.length!==(currentScheme()?.sections.length||0)) cloneSectionsFromScheme();
    const mats=allowedMaterials(); if(!mats.some(x=>x.id===state.material)) state.material=mats[0]?.id;
    if(!supportsColdAndWarm()) state.thermalMode='mode_warm';
    const gl=allowedGlazing(); if(!gl.some(x=>x.id===state.glazing)) state.glazing=gl[0]?.id;
    const cf=allowedComfort(); if(!cf.some(x=>x.id===state.comfort)) state.comfort='cf_none';
    const ss=compatibleSystems(); if(!ss.some(x=>x.id===state.system)) state.system=recommendedSystemId(ss);
    [...state.extras].forEach(id=>{if(!allowedExtras().some(x=>x.id===id)) state.extras.delete(id)});
  }

  function reset(){
    Object.assign(state,{step:0,width:1400,height:1500,type:'ct_double',scheme:'sc_double_fixed_left',material:'mat_pvc',thermalMode:'mode_warm',glazing:'gl_2ch',comfort:'cf_none',system:'sys_grazio',view:'inside'});
    state.extras=new Set(['ex_mosquito']); cloneSectionsFromScheme(); normalizeState();
  }

  window.LUMI = {state,lookup,currentScheme,currentType,currentMaterial,currentGlazing,currentComfort,currentSystem,cloneSectionsFromScheme,allowedMaterials,supportsColdAndWarm,allowedOpeningsForSection,allowedGlazing,allowedComfort,compatibleSystems,recommendedSystemId,allowedExtras,normalizeState,reset};
})();
