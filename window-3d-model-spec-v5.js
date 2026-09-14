(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.LUMI3D_SPEC=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const OPENING_LABELS={
    op_fixed:'Глухая',
    op_turn:'Поворотное открывание',
    op_tilt_turn:'Поворотно-откидное',
    op_tilt:'Откидное',
    op_psk:'PSK · параллельно-сдвижное',
    op_lift_slide:'HS · подъёмно-сдвижное'
  };
  const SCENARIO_LABELS={
    sc_pan_lift_slide:'HS-портал / подъёмно-сдвижная система',
    sc_pd_lift_slide:'HS-портал / подъёмно-сдвижная система',
    sc_pan_psk:'PSK-портал / параллельно-сдвижная система',
    sc_pd_psk:'PSK-портал / параллельно-сдвижная система',
    sc_pd_swing:'Распашная панорамная дверь',
    sc_bb_window_left:'Балконный блок · окно слева + дверь справа',
    sc_bb_window_right:'Балконный блок · дверь слева + окно справа',
    sc_bb_double_window:'Балконный блок · 2 окна + дверь'
  };
  function kindFor(scheme){
    if(!scheme)return 'window';
    if(scheme.mechanism==='lift_slide')return 'hs';
    if(scheme.mechanism==='psk')return 'psk';
    if(scheme.id==='sc_pd_swing')return 'panoramic-door';
    if(String(scheme.id||'').startsWith('sc_bb_'))return 'balcony';
    if(String(scheme.id||'').startsWith('sc_pan_'))return 'panoramic-window';
    return 'window';
  }
  function sectionHeight(role){
    return role==='window'?0.72:1;
  }
  function resolve(state,scheme){
    const sections=(state?.sectionOpenings||[]).map((s,i)=>({
      index:i,
      label:s.label||`Секция ${i+1}`,
      role:s.role||'window',
      ratio:Number(s.ratio)||1,
      heightRatio:sectionHeight(s.role),
      opening:s.opening||'op_fixed',
      openingLabel:OPENING_LABELS[s.opening]||s.opening||'Глухая'
    }));
    return {
      id:scheme?.id||'unknown',
      kind:kindFor(scheme),
      label:SCENARIO_LABELS[scheme?.id]||scheme?.name||'Конструкция',
      mechanism:scheme?.mechanism||'standard',
      sections,
      material:state?.material||'mat_pvc',
      widthMm:Number(state?.width)||1400,
      heightMm:Number(state?.height)||1500
    };
  }
  return {OPENING_LABELS,SCENARIO_LABELS,kindFor,resolve};
});