const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const rules = require('../scenario-rules.js');
const { createEngine } = require('../core-v3.js');

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i=0; i<text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i+1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else {
      if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field=''; }
      else if (ch === '\n') { row.push(field); rows.push(row); row=[]; field=''; }
      else if (ch !== '\r') field += ch;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift();
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i] ?? ''])));
}

const split = value => String(value || '').split('|').filter(Boolean);
const normalizeRule = row => ({
  rule_id:row.rule_id,
  construction_type_id:row.construction_type_id,
  scheme_ids:split(row.scheme_ids),
  opening_options:split(row.opening_options),
  material:row.material,
  thermal_mode:row.thermal_mode,
  glazing_options:split(row.glazing_options),
  comfort_options:split(row.comfort_options),
  compatible_systems:split(row.compatible_systems),
  recommended_logic:row.recommended_logic,
  extra_options:split(row.extra_options),
  ui_note:row.ui_note,
  engineering_validation:row.engineering_validation
});

test('runtime scenario rules exactly mirror 03_LUMI_scenario_rules.csv', () => {
  const csv = fs.readFileSync(path.join(__dirname,'../data/03_LUMI_scenario_rules.csv'),'utf8');
  const fromCsv = parseCsv(csv).map(normalizeRule);
  const runtime = rules.map(r=>JSON.parse(JSON.stringify(r)));
  assert.deepEqual(runtime, fromCsv);
  assert.equal(runtime.length, 19);
});

test('all 19 scenario rows drive engine systems, glazing and comfort', () => {
  for (const rule of rules) {
    for (const scheme of rule.scheme_ids) {
      const e = createEngine();
      e.dispatch({type:'SELECT_TYPE', value:rule.construction_type_id});
      e.dispatch({type:'SELECT_SCHEME', value:scheme});
      e.dispatch({type:'SELECT_MATERIAL', value:rule.material});
      const thermalMode = rule.thermal_mode === 'warm' ? 'mode_warm' : rule.thermal_mode;
      if (e.availableThermalModes().includes(thermalMode)) e.dispatch({type:'SELECT_THERMAL', value:thermalMode});

      assert.equal(e.currentScenarioRule()?.rule_id, rule.rule_id, `${rule.rule_id}/${scheme}: wrong matched rule`);
      assert.deepEqual(e.allowedGlazing().map(x=>x.id), rule.glazing_options, `${rule.rule_id}/${scheme}: glazing drift`);
      assert.deepEqual(e.allowedComfort().map(x=>x.id), rule.comfort_options, `${rule.rule_id}/${scheme}: comfort drift`);
      assert.deepEqual(e.compatibleSystems().map(x=>x.id), rule.compatible_systems, `${rule.rule_id}/${scheme}: systems drift`);

      const actualExtras = new Set(e.allowedExtras().map(x=>x.id));
      const ruleExtras = new Set(rule.extra_options);
      for (const id of actualExtras) assert.ok(ruleExtras.has(id), `${rule.rule_id}/${scheme}: extra ${id} is outside scenario allowlist`);
      assert.ok(!e.validationIssues().some(x=>x.severity==='error'), `${rule.rule_id}/${scheme}: normalized state must be valid`);
    }
  }
});

test('scenario table controls material and thermal availability', () => {
  const cases = [
    ['ct_panoramic','sc_pan_psk',['mat_pvc']],
    ['ct_panoramic','sc_pan_lift_slide',['mat_aluminum']],
    ['ct_entrance','sc_en_single',['mat_aluminum']],
    ['ct_entrance','sc_en_psk',['mat_pvc']],
    ['ct_balcony_block','sc_bb_window_left',['mat_pvc','mat_aluminum']]
  ];
  for (const [type,scheme,expected] of cases) {
    const e=createEngine();
    e.dispatch({type:'SELECT_TYPE',value:type});
    e.dispatch({type:'SELECT_SCHEME',value:scheme});
    assert.deepEqual(e.allowedMaterials().map(x=>x.id),expected);
  }
  const e=createEngine();
  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_2'});
  e.dispatch({type:'SELECT_MATERIAL',value:'mat_aluminum'});
  assert.deepEqual(e.availableThermalModes(),['mode_warm','mode_cold']);
});

test('fixed and active semantics are enforced inside schemes', () => {
  const e=createEngine();
  e.dispatch({type:'SELECT_TYPE',value:'ct_double'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_double_fixed_left'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_fixed']);
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[1]),['op_turn','op_tilt_turn','op_tilt']);
  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_fixed'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_fixed']);
  e.dispatch({type:'SELECT_TYPE',value:'ct_entrance'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_en_side'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]),['op_turn']);
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[1]),['op_fixed']);
});

test('extras are restricted first by scenario rule and then by current opening', () => {
  const e=createEngine();
  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_2'});
  e.dispatch({type:'SELECT_MATERIAL',value:'mat_aluminum'});
  e.dispatch({type:'SELECT_THERMAL',value:'mode_cold'});
  assert.deepEqual(e.allowedExtras().map(x=>x.id),['ex_drip','ex_install','ex_delivery']);

  e.dispatch({type:'SELECT_TYPE',value:'ct_balcony_glazing'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_bg_straight_2'});
  e.dispatch({type:'SELECT_MATERIAL',value:'mat_aluminum'});
  e.dispatch({type:'SELECT_THERMAL',value:'mode_cold'});
  assert.ok(e.allowedExtras().map(x=>x.id).includes('ex_mosquito'));
  assert.ok(!e.allowedExtras().map(x=>x.id).includes('ex_sill'));
  assert.ok(!e.allowedExtras().map(x=>x.id).includes('ex_slopes'));

  e.dispatch({type:'SELECT_TYPE',value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME',value:'sc_pan_psk'});
  assert.deepEqual(e.allowedExtras().map(x=>x.id),['ex_install','ex_delivery','ex_slopes']);
});
