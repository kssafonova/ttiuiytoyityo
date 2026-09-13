(function(root,factory){
  let D=root.LUMI_DATA,R=root.LUMI_SCENARIO_RULES;
  if(typeof module==='object'&&module.exports){D=D||require('./data-v3.js');R=R||require('./scenario-rules-v2.js');}
  const api=factory(D,R);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.LUMI=api.createEngine();
})(typeof globalThis!=='undefined'?globalThis:this,function(D,R){
  'use strict';
  if(!D||!Array.isArray(R)) throw new Error('LUMI data and scenario rules are required');
  const byId=a=>Object.fromEntries(a.map(x=>[x.id,x]));
  const T=byId(D.types),M=byId(D.materials),G=byId(D.glazing),C=byId(D.comfort),S=byId(D.systems),E=byId(D.extras),O=byId(D.openingOptions);
  const STD=['op_fixed','op_turn','op_tilt_turn','op_tilt'];
  const ACTIVE=['op_turn','op_tilt_turn','op_tilt'];
  const LOCK={
    sc_pan_fixed:{0:['op_fixed']},
    sc_pan_2:{0:['op_fixed'],1:ACTIVE},
    sc_pan_3:{0:['op_fixed'],1:ACTIVE,2:['op_fixed']},
    sc_pan_psk:{0:['op_psk'],1:['op_fixed']},
    sc_pan_lift_slide:{0:['op_lift_slide'],1:['op_fixed']},
    sc_bb_double_window:{0:['op_fixed'],1:STD,2:['op_turn','op_tilt_turn']},
    sc_pd_swing:{0:['op_turn']},
    sc_pd_psk:{0:['op_psk'],1:['op_fixed']},
    sc_pd_lift_slide:{0:['op_lift_slide'],1:['op_fixed']}
  };
  const DEFAULT=Object.freeze({
    step:0,width:1400,height:1500,type:'ct_window',scheme:'sc_win_2_mullion',sectionOpenings:[],material:'mat_pvc',thermalMode:'mode_warm',glazing:'gl_2ch',comfort:'cf_none',system:'sys_grazio',systemSelectionMode:'auto',extras:['ex_mosquito'],extraConfig:{sill:{depth:250,length:1400,color:'Белый'},mosquitoSections:[]},installationContext:null,view:'inside'
  });
  const uniq=a=>[...new Set(a)];

  function createEngine(initial){
    const state={...DEFAULT,...(initial||{}),sectionOpenings:Array.isArray(initial?.sectionOpenings)?initial.sectionOpenings.map(x=>({...x})):[],extras:new Set(Array.isArray(initial?.extras)?initial.extras:DEFAULT.extras),extraConfig:JSON.parse(JSON.stringify(initial?.extraConfig||DEFAULT.extraConfig))};
    const schemesForType=(typeId=state.type)=>D.schemes[typeId]||[];
    const selectableSchemesForType=(typeId=state.type)=>schemesForType(typeId).filter(x=>!x.disabled);
    const currentType=()=>T[state.type]||D.types[0];
    const currentScheme=()=>schemesForType().find(x=>x.id===state.scheme)||selectableSchemesForType()[0]||null;
    const currentMaterial=()=>M[state.material]||null;
    const currentGlazing=()=>G[state.glazing]||null;
    const currentComfort=()=>C[state.comfort]||null;
    const currentSystem=()=>S[state.system]||null;
    const rulesFor=(typeId=state.type,schemeId=state.scheme)=>R.filter(r=>r.construction_type_id===typeId&&r.scheme_ids.includes(schemeId));
    const mode=x=>x==='warm'?'mode_warm':x;
    const currentScenarioRule=()=>rulesFor().find(r=>r.material===state.material&&mode(r.thermal_mode)===state.thermalMode)||null;

    function cloneSections(){
      const s=currentScheme();
      state.sectionOpenings=(s?.sections||[]).map((x,i)=>({key:`${s.id}:${i}`,label:x.label,role:x.role,ratio:x.ratio||1,opening:x.defaultOpening||'op_fixed'}));
    }
    function allowedMaterials(){
      return uniq(rulesFor().map(r=>r.material)).map(id=>M[id]).filter(Boolean);
    }
    function availableThermalModes(){
      return uniq(rulesFor().filter(r=>r.material===state.material).map(r=>mode(r.thermal_mode)));
    }
    const supportsColdAndWarm=()=>state.material==='mat_aluminum'&&availableThermalModes().length>1;

    function allowedOpeningsForSection(sec){
      const s=currentScheme(); if(!s||!sec) return [];
      const index=state.sectionOpenings.indexOf(sec);
      const locked=LOCK[s.id]?.[index];
      if(locked) return locked.filter(id=>O[id]);
      let semantic;
      if(sec.role==='portal_fixed') semantic=['op_fixed'];
      else if(sec.role==='portal') semantic=s.mechanism==='psk'?['op_psk']:s.mechanism==='lift_slide'?['op_lift_slide']:['op_fixed'];
      else if(sec.role==='entrance_door') semantic=['op_turn'];
      else if(sec.role==='balcony_door') semantic=['op_turn','op_tilt_turn'];
      else if(sec.role==='transom') semantic=['op_fixed','op_tilt'];
      else if(sec.role==='shtulp_passive') semantic=['op_turn'];
      else if(sec.role==='shtulp_active') semantic=['op_turn','op_tilt_turn'];
      else semantic=STD;
      const ruleOpenings=currentScenarioRule()?.opening_options||uniq(rulesFor().flatMap(r=>r.opening_options));
      const filtered=semantic.filter(x=>ruleOpenings.includes(x));
      return filtered.length?filtered:semantic.filter(x=>x==='op_fixed');
    }

    const allowedGlazing=()=> (currentScenarioRule()?.glazing_options||[]).map(id=>G[id]).filter(Boolean);
    const allowedComfort=()=> (currentScenarioRule()?.comfort_options||[]).map(id=>C[id]).filter(Boolean);
    const compatibleSystems=()=> (currentScenarioRule()?.compatible_systems||[]).map(id=>S[id]).filter(Boolean);

    function recommendationScore(system){
      const props=currentComfort()?.properties||[];
      let score=(system.scores?.value||0)+(system.scores?.thermal||0);
      if(props.includes('thermal')) score+=(system.scores?.thermal||0)*2.5;
      if(props.includes('acoustic')) score+=(system.scores?.acoustic||0)*2.8;
      if(['ct_panoramic','ct_panoramic_door'].includes(state.type)) score+=(system.scores?.panoramic||0)*1.4;
      return score;
    }
    const rankedSystems=()=>compatibleSystems().map(system=>({system,score:recommendationScore(system)})).sort((a,b)=>b.score-a.score||D.systems.indexOf(a.system)-D.systems.indexOf(b.system));
    const recommendedSystemId=(list=compatibleSystems())=>list.map(system=>({system,score:recommendationScore(system)})).sort((a,b)=>b.score-a.score||D.systems.indexOf(a.system)-D.systems.indexOf(b.system))[0]?.system.id||null;
    function explainRecommendation(id=state.system){
      const p=S[id],r=currentScenarioRule(),props=currentComfort()?.properties||[];
      if(!p||!r) return 'Нужен инженерный расчёт.';
      if(id==='sys_s158') return 'Выбрана подъёмно-сдвижная конструкция — в текущем ассортименте ей соответствует ALUMARK S158.';
      if(id==='sys_s50') return 'Выбрано холодное алюминиевое остекление без требований к теплоизоляции.';
      if(props.includes('acoustic')&&id==='sys_intelio80') return 'При приоритете «Тишина» INTELIO 80 ранжируется выше среди совместимых REHAU.';
      if(props.includes('thermal')&&['sys_intelio80','sys_s70'].includes(id)) return 'При приоритете «Тепло» выше ранжируется более тёплая совместимая система.';
      return `${p.name} — рекомендуемый вариант среди систем, разрешённых сценарием ${r.rule_id}.`;
    }

    const allFixed=()=>state.sectionOpenings.length>0&&state.sectionOpenings.every(x=>x.opening==='op_fixed');
    const eligibleMosquitoSections=()=>state.sectionOpenings.map((x,i)=>({section:x,index:i})).filter(({section})=>['window','shtulp_active'].includes(section.role)&&['op_turn','op_tilt_turn','op_tilt'].includes(section.opening));
    function extraSemanticallyAllowed(id){
      const portal=state.sectionOpenings.some(x=>['op_psk','op_lift_slide'].includes(x.opening));
      if(id==='ex_mosquito') return eligibleMosquitoSections().length>0&&!portal;
      if(id==='ex_sill') return state.type!=='ct_panoramic_door'&&!portal&&state.sectionOpenings.some(x=>['window','transom','shtulp_active','shtulp_passive','balcony_door'].includes(x.role));
      if(id==='ex_child_lock'||id==='ex_limiter') return state.sectionOpenings.some(x=>['op_turn','op_tilt_turn'].includes(x.opening)&&['window','shtulp_active'].includes(x.role));
      return true;
    }
    const allowedExtras=()=> (currentScenarioRule()?.extra_options||[]).filter(extraSemanticallyAllowed).map(id=>E[id]).filter(Boolean);

    function reconcileSections(){
      const s=currentScheme(); if(!s){state.sectionOpenings=[];return;}
      const expected=s.sections||[];
      if(state.sectionOpenings.length!==expected.length||state.sectionOpenings.some((x,i)=>x.role!==expected[i].role)){cloneSections();return;}
      state.sectionOpenings.forEach((sec,i)=>{
        const src=expected[i]; sec.label=src.label;sec.role=src.role;sec.ratio=src.ratio||1;sec.key=`${s.id}:${i}`;
        const allowed=allowedOpeningsForSection(sec);
        if(!allowed.includes(sec.opening)) sec.opening=allowed.includes(src.defaultOpening)?src.defaultOpening:(allowed[0]||'op_fixed');
      });
    }

    function normalizeState(){
      const ss=selectableSchemesForType();
      if(!ss.some(x=>x.id===state.scheme)) state.scheme=ss[0]?.id||null;
      const mats=allowedMaterials();
      if(!mats.some(x=>x.id===state.material)) state.material=mats[0]?.id||'mat_pvc';
      const modes=availableThermalModes();
      if(!modes.includes(state.thermalMode)) state.thermalMode=modes[0]||'mode_warm';
      reconcileSections();
      const gl=allowedGlazing();
      if(!gl.some(x=>x.id===state.glazing)) state.glazing=gl.find(x=>x.id==='gl_2ch')?.id||gl[0]?.id||null;
      const cf=allowedComfort();
      if(!cf.some(x=>x.id===state.comfort)) state.comfort=cf.find(x=>x.id==='cf_none')?.id||cf[0]?.id||null;
      const systems=compatibleSystems(),systemIds=new Set(systems.map(x=>x.id));
      if(!(state.systemSelectionMode==='manual'&&systemIds.has(state.system))){state.systemSelectionMode='auto';state.system=recommendedSystemId(systems);}
      const exIds=new Set(allowedExtras().map(x=>x.id));
      [...state.extras].forEach(id=>{if(!exIds.has(id))state.extras.delete(id);});
      const eligible=new Set(eligibleMosquitoSections().map(x=>x.index));
      state.extraConfig.mosquitoSections=(state.extraConfig.mosquitoSections||[]).filter(i=>eligible.has(i));
      if(state.extras.has('ex_mosquito')&&!state.extraConfig.mosquitoSections.length&&eligible.size) state.extraConfig.mosquitoSections=[...eligible][0]!==undefined?[[...eligible][0]]:[];
      state.extraConfig.sill=state.extraConfig.sill||{depth:250,length:state.width,color:'Белый'};
      if(!state.extraConfig.sill.length) state.extraConfig.sill.length=state.width;
      state.width=Number(state.width)||DEFAULT.width;state.height=Number(state.height)||DEFAULT.height;
      if(!['inside','outside','scheme'].includes(state.view))state.view='inside';
      return state;
    }

    function validationIssues(){
      const issues=[],r=currentScenarioRule();
      if(!Number.isFinite(+state.width)||+state.width<=0) issues.push({severity:'error',code:'width',message:'Укажите ширину конструкции.'});
      if(!Number.isFinite(+state.height)||+state.height<=0) issues.push({severity:'error',code:'height',message:'Укажите высоту конструкции.'});
      if(!currentScheme()) issues.push({severity:'error',code:'scheme',message:'Выберите схему.'});
      if(!r) issues.push({severity:'error',code:'scenario',message:'Для выбранной комбинации нет подтверждённого сценария.'});
      if(allFixed()) issues.push({severity:'warning',code:'fully_fixed',message:'Полностью глухое окно подходит не для всех помещений. Проверьте возможность безопасного обслуживания наружного стекла.'});
      if(r) issues.push({severity:'info',code:'engineering',message:r.engineering_validation});
      if(!currentSystem()?.engineeringLimits) issues.push({severity:'info',code:'size_limits',message:'Числовые ограничения по ширине/высоте не зашиты без производственных данных. После их загрузки движок сможет предложить 2/3 секции или панорамное решение вместо generic error.'});
      return issues;
    }
    const canProceed=()=>!validationIssues().some(x=>x.severity==='error');

    function applyOpenings(values){
      if(!Array.isArray(values)||values.length!==state.sectionOpenings.length)return;
      values.forEach((value,i)=>{const sec=state.sectionOpenings[i];if(allowedOpeningsForSection(sec).includes(value))sec.opening=value;});
      state.systemSelectionMode='auto';
    }
    function reset(){Object.assign(state,{...DEFAULT});state.sectionOpenings=[];state.extras=new Set(DEFAULT.extras);state.extraConfig=JSON.parse(JSON.stringify(DEFAULT.extraConfig));cloneSections();return normalizeState();}
    function dispatch(a){
      if(!a?.type)return state;
      switch(a.type){
        case'SET_DIMENSION':if(['width','height'].includes(a.field))state[a.field]=+a.value;break;
        case'SELECT_TYPE':if(T[a.value]){state.type=a.value;state.scheme=selectableSchemesForType(a.value)[0]?.id||null;cloneSections();state.systemSelectionMode='auto';state.installationContext=null;}break;
        case'SELECT_SCHEME':{const s=schemesForType().find(x=>x.id===a.value);if(s&&!s.disabled){state.scheme=s.id;cloneSections();state.systemSelectionMode='auto';state.installationContext=null;}break;}
        case'SELECT_OPENING':{const sec=state.sectionOpenings[+a.index];if(sec&&allowedOpeningsForSection(sec).includes(a.value)){sec.opening=a.value;state.systemSelectionMode='auto';}break;}
        case'APPLY_OPENING_PRESET':applyOpenings(a.values);break;
        case'SELECT_MATERIAL':if(allowedMaterials().some(x=>x.id===a.value)){state.material=a.value;state.systemSelectionMode='auto';}break;
        case'SELECT_THERMAL':if(availableThermalModes().includes(a.value)){state.thermalMode=a.value;state.systemSelectionMode='auto';}break;
        case'SELECT_GLAZING':if(allowedGlazing().some(x=>x.id===a.value)){state.glazing=a.value;state.systemSelectionMode='auto';}break;
        case'SELECT_COMFORT':if(allowedComfort().some(x=>x.id===a.value)){state.comfort=a.value;state.systemSelectionMode='auto';}break;
        case'SELECT_SYSTEM':if(compatibleSystems().some(x=>x.id===a.value)){state.system=a.value;state.systemSelectionMode='manual';}break;
        case'TOGGLE_EXTRA':if(allowedExtras().some(x=>x.id===a.value)){state.extras.has(a.value)?state.extras.delete(a.value):state.extras.add(a.value);}break;
        case'SET_EXTRA_CONFIG':if(a.extra==='sill'&&['depth','length','color'].includes(a.field))state.extraConfig.sill[a.field]=a.value;else if(a.extra==='mosquito')state.extraConfig.mosquitoSections=Array.isArray(a.value)?a.value.map(Number):[];break;
        case'SET_INSTALLATION_CONTEXT':state.installationContext=D.installationContexts.some(x=>x.id===a.value)?a.value:null;break;
        case'SET_VIEW':state.view=a.value;break;
        case'RESET':return reset();
      }
      return normalizeState();
    }
    const snapshot=()=>({...state,sectionOpenings:state.sectionOpenings.map(x=>({...x})),extras:[...state.extras],extraConfig:JSON.parse(JSON.stringify(state.extraConfig))});
    function hydrate(saved){if(!saved||typeof saved!=='object')return state;Object.assign(state,saved);state.sectionOpenings=Array.isArray(saved.sectionOpenings)?saved.sectionOpenings.map(x=>({...x})):[];state.extras=new Set(Array.isArray(saved.extras)?saved.extras:[]);state.extraConfig=JSON.parse(JSON.stringify(saved.extraConfig||DEFAULT.extraConfig));return normalizeState();}
    cloneSections();normalizeState();
    return {state,DATA:D,SCENARIO_RULES:R,currentType,currentScheme,currentMaterial,currentGlazing,currentComfort,currentSystem,currentScenarioRule,rulesFor,schemesForType,selectableSchemesForType,allowedMaterials,availableThermalModes,supportsColdAndWarm,allowedOpeningsForSection,allowedGlazing,allowedComfort,compatibleSystems,rankedSystems,recommendedSystemId,explainRecommendation,allowedExtras,eligibleMosquitoSections,allFixed,validationIssues,canProceed,dispatch,normalizeState,reset,snapshot,hydrate};
  }
  return {createEngine,DATA:D,SCENARIO_RULES:R};
});