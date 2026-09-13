const test = require('node:test');
const assert = require('node:assert/strict');
const { createEngine } = require('../core-v2.js');
const ids = list => list.map(x=>x.id);

test('default PVC scenario recommends GRAZIO as balanced choice', () => {
  const e = createEngine();
  assert.deepEqual(ids(e.compatibleSystems()), ['sys_blitz','sys_grazio','sys_intelio80']);
  assert.equal(e.recommendedSystemId(), 'sys_grazio');
});

test('quiet PVC scenario recommends INTELIO 80', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_COMFORT', value:'cf_quiet'});
  assert.equal(e.recommendedSystemId(), 'sys_intelio80');
});

test('PSK forces PVC and REHAU-compatible systems', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_TYPE', value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_pan_psk'});
  assert.deepEqual(ids(e.allowedMaterials()), ['mat_pvc']);
  assert.equal(e.state.material, 'mat_pvc');
  assert.deepEqual(ids(e.compatibleSystems()), ['sys_blitz','sys_grazio','sys_intelio80']);
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]), ['op_psk']);
});

test('lift-slide forces aluminum and S158', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_TYPE', value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_pan_lift_slide'});
  assert.deepEqual(ids(e.allowedMaterials()), ['mat_aluminum']);
  assert.equal(e.state.material, 'mat_aluminum');
  assert.equal(e.state.thermalMode, 'mode_warm');
  assert.deepEqual(ids(e.compatibleSystems()), ['sys_s158']);
  assert.equal(e.state.system, 'sys_s158');
});

test('cold aluminum leaves only S50 and limits comfort', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_MATERIAL', value:'mat_aluminum'});
  e.dispatch({type:'SELECT_THERMAL', value:'mode_cold'});
  assert.deepEqual(ids(e.compatibleSystems()), ['sys_s50']);
  assert.deepEqual(ids(e.allowedComfort()), ['cf_none','cf_solar','cf_safe','cf_crystal']);
  assert.ok(ids(e.allowedGlazing()).includes('gl_single_glass'));
});

test('standard entrance group is warm aluminum S60/S70 only', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_TYPE', value:'ct_entrance'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_en_single'});
  assert.deepEqual(ids(e.allowedMaterials()), ['mat_aluminum']);
  assert.deepEqual(e.availableThermalModes(), ['mode_warm']);
  assert.deepEqual(ids(e.compatibleSystems()), ['sys_s60','sys_s70']);
});

test('balcony door can be turn or tilt-turn, entrance door only turn', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_TYPE', value:'ct_balcony_block'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_bb_window_left'});
  const door = e.state.sectionOpenings.find(x=>x.role==='balcony_door');
  assert.deepEqual(e.allowedOpeningsForSection(door), ['op_turn','op_tilt_turn']);
  e.dispatch({type:'SELECT_TYPE', value:'ct_entrance'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_en_single'});
  assert.deepEqual(e.allowedOpeningsForSection(e.state.sectionOpenings[0]), ['op_turn']);
});

test('manual system selection persists only while compatible', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_SYSTEM', value:'sys_blitz'});
  assert.equal(e.state.systemSelectionMode, 'manual');
  assert.equal(e.state.system, 'sys_blitz');
  e.dispatch({type:'SELECT_MATERIAL', value:'mat_aluminum'});
  assert.equal(e.state.systemSelectionMode, 'auto');
  assert.notEqual(e.state.system, 'sys_blitz');
});

test('portal hides ordinary mosquito net', () => {
  const e = createEngine();
  e.dispatch({type:'SELECT_TYPE', value:'ct_panoramic'});
  e.dispatch({type:'SELECT_SCHEME', value:'sc_pan_psk'});
  assert.ok(!ids(e.allowedExtras()).includes('ex_mosquito'));
});

test('dimensions do not hard-code a manufacturer system decision', () => {
  const e = createEngine();
  e.dispatch({type:'SET_DIMENSION', field:'width', value:5000});
  e.dispatch({type:'SET_DIMENSION', field:'height', value:3000});
  assert.equal(e.recommendedSystemId(), 'sys_grazio');
  assert.ok(e.validationIssues().some(x=>x.code==='engineering'));
});
