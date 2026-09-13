const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const DATA=require('../data-v3.js');
const RULES=require('../scenario-rules-v2.js');
const {createEngine}=require('../core-v4.js');
const ids=list=>list.map(x=>x.id);

function parseCsv(text){
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(quoted){if(ch==='"'&&text[i+1]==='"'){field+='"';i++;}else if(ch==='"')quoted=false;else field+=ch;}
    else if(ch==='"')quoted=true;else if(ch===','){row.push(field);field='';}else if(ch==='\n'){row.push(field);rows.push(row);row=[];field='';}else if(ch!=='\r')field+=ch;
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  const h=rows.shift();return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]??''])));
}
const split=v=>String(v||'').split('|').filter(Boolean);
const normalizeCsv=r=>({rule_id:r.rule_id,construction_type_id:r.construction_type_id,scheme_ids:split(r.scheme_ids),opening_options:split(r.opening_options),material:r.material,thermal_mode:r.thermal_mode,glazing_options:split(r.glazing_options),comfort_options:split(r.comfort_options),compatible_systems:split(r.compatible_systems),recommended_logic:r.recommended_logic,extra_options:split(r.extra_options),ui_note:r.ui_note,engineering_validation:r.engineering_validation});
const logicalRule=r=>({
  rule_id:r.rule_id,
  construction_type_id:r.construction_type_id,
  scheme_ids:[...r.scheme_ids],
  opening_options:[...r.opening_options],
  material:r.material,
  thermal_mode:r.thermal_mode,
  glazing_options:[...r.glazing_options],
  comfort_options:[...r.comfort_options],
  compatible_systems:[...r.compatible_systems],
  extra_options:[...r.extra_options]
});

test('top level contains exactly four product scenarios',()=>{
  assert.deepEqual(ids(DATA.types),['ct_window','ct_panoramic','ct_balcony_block','ct_panoramic_door']);
});

test('runtime rule logic mirrors canonical scenario CSV',()=>{
  const csv=fs.readFileSync(path.join(__dirname,'../data/03_LUMI_scenario_rules.csv'),'utf8');
  const canonical=parseCsv(csv).map(normalizeCsv);
  const runtime=JSON.parse(JSON.stringify(RULES));
  assert.deepEqual(runtime.map(logicalRule),canonical.map(logicalRule));
  for(const rule of runtime){
    assert.ok(rule.recommended_logic?.trim(),`${rule.rule_id}: recommendation copy is required`);
    assert.ok(rule.ui_note?.trim(),`${rule.rule_id}: UX note is required`);
    assert.ok(rule.engineering_validation?.trim(),`${rule.rule_id}: engineering validation copy is required`);
  }
});

test('ordinary single window never exposes slide opening',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_1'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_fixed','op_turn','op_tilt_turn','op_tilt']);
  assert.ok(!e.allowedOpeningsForSection(e.state.sectionOpenings[0]).includes('op_psk'));
  assert.ok(!e.allowedOpeningsForSection(e.state.sectionOpenings[0]).includes('op_lift_slide'));
});

test('two-section mullion supports presets and individual opening configuration',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_2_mullion'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_fixed','op_turn','op_tilt_turn','op_tilt']);
  e.dispatch({type:'APPLY_OPENING_PRESET',values:['op_turn','op_tilt_turn']});
  assert.deepEqual(e.state.sectionOpenings.map(x=>x.opening),['op_turn','op_tilt_turn']);
});

test('shtulp constrains passive and active sash independently',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_2_shtulp_right'});
  assert.equal(e.state.sectionOpenings[0].role,'shtulp_passive');
  assert.equal(e.state.sectionOpenings[1].role,'shtulp_active');
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_turn']);
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[1]),['op_turn','op_tilt_turn']);
  e.dispatch({type:'SELECT_MATERIAL',value:'mat_aluminum'});
  assert.deepEqual(e.availableThermalModes(),['mode_warm']);
});

test('ordinary generic slide is visible in domain but blocked until a real compatible system is confirmed',()=>{
  const e=createEngine();
  const slide=DATA.schemes.ct_window.find(x=>x.id==='sc_win_2_slide');
  assert.equal(slide.disabled,true);
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_2_slide'});
  assert.notEqual(e.state.scheme,'sc_win_2_slide');
  assert.ok(!RULES.some(r=>r.scheme_ids.includes('sc_win_2_slide')));
});

test('three-section ordinary window can be fully customized',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_3'});
  e.dispatch({type:'APPLY_OPENING_PRESET',values:['op_tilt_turn','op_fixed','op_tilt_turn']});
  assert.deepEqual(e.state.sectionOpenings.map(x=>x.opening),['op_tilt_turn','op_fixed','op_tilt_turn']);
});

test('transom only allows fixed or tilt while main sash stays configurable',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_transom'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_fixed','op_turn','op_tilt_turn','op_tilt']);
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[1]),['op_fixed','op_tilt']);
});

test('fully fixed window produces serviceability warning and removes mosquito net',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_SCHEME',value:'sc_win_2_mullion'});
  e.dispatch({type:'APPLY_OPENING_PRESET',values:['op_fixed','op_fixed']});
  assert.equal(e.allFixed(),true);
  assert.ok(e.validationIssues().some(x=>x.code==='fully_fixed'&&x.severity==='warning'));
  assert.ok(!ids(e.allowedExtras()).includes('ex_mosquito'));
});

test('ordinary window material choices are scenario-driven',()=>{
  const e=createEngine();
  assert.deepEqual(ids(e.allowedMaterials()),['mat_pvc','mat_aluminum']);
  e.dispatch({type:'SELECT_MATERIAL',value:'mat_aluminum'});
  assert.deepEqual(e.availableThermalModes(),['mode_warm','mode_cold']);
  e.dispatch({type:'SELECT_THERMAL',value:'mode_cold'});
  assert.deepEqual(ids(e.compatibleSystems()),['sys_s50']);
  assert.deepEqual(ids(e.allowedComfort()),['cf_none','cf_solar','cf_safe','cf_crystal']);
});

test('panoramic PSK and lift-slide filter material and systems before result',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_psk'});
  assert.deepEqual(ids(e.allowedMaterials()),['mat_pvc']);
  assert.deepEqual(ids(e.compatibleSystems()),['sys_blitz','sys_grazio','sys_intelio80']);
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_lift_slide'});
  assert.deepEqual(ids(e.allowedMaterials()),['mat_aluminum']);
  assert.deepEqual(ids(e.compatibleSystems()),['sys_s158']);
});

test('panoramic door has swing aluminum, PSK PVC and lift-slide S158 branches',()=>{
  const e=createEngine();
  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic_door'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pd_swing'});
  assert.deepEqual(ids(e.allowedMaterials()),['mat_aluminum']);
  assert.deepEqual(ids(e.compatibleSystems()),['sys_s60','sys_s70']);
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pd_psk'});
  assert.deepEqual(ids(e.allowedMaterials()),['mat_pvc']);
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pd_lift_slide'});
  assert.deepEqual(ids(e.compatibleSystems()),['sys_s158']);
});

test('no fabricated dimension limits are used until production constraints exist',()=>{
  const e=createEngine();
  e.dispatch({type:'SET_DIMENSION',field:'width',value:5000});
  e.dispatch({type:'SET_DIMENSION',field:'height',value:3000});
  assert.ok(e.validationIssues().some(x=>x.code==='size_limits'));
  assert.ok(!e.validationIssues().some(x=>x.code==='width'&&x.severity==='error'));
});