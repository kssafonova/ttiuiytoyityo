const test=require('node:test');
const assert=require('node:assert/strict');
const S=require('../window-3d-model-spec-v5.js');

const cases=[
  ['sc_pan_lift_slide','lift_slide','hs'],
  ['sc_pan_psk','psk','psk'],
  ['sc_pd_swing','swing_door','panoramic-door'],
  ['sc_bb_window_left','standard','balcony'],
  ['sc_bb_window_right','standard','balcony'],
  ['sc_bb_double_window','standard','balcony']
];

test('all requested base 3D constructions resolve correctly',()=>{
  for(const [id,mechanism,kind] of cases){
    const spec=S.resolve({width:2400,height:2200,material:'mat_pvc',sectionOpenings:[]},{id,name:id,mechanism});
    assert.equal(spec.kind,kind,id);
    assert.ok(spec.label.length>3,id);
  }
});

test('window and balcony door opening states have readable labels',()=>{
  const openings=['op_fixed','op_turn','op_tilt_turn','op_tilt','op_psk','op_lift_slide'];
  for(const opening of openings)assert.ok(S.OPENING_LABELS[opening],opening);
  const spec=S.resolve({width:2100,height:2200,sectionOpenings:[
    {label:'Окно',role:'window',ratio:.55,opening:'op_tilt_turn'},
    {label:'Балконная дверь',role:'balcony_door',ratio:.45,opening:'op_turn'}
  ]},{id:'sc_bb_window_left',name:'Балконный блок',mechanism:'standard'});
  assert.equal(spec.sections[0].openingLabel,'Поворотно-откидное');
  assert.equal(spec.sections[1].openingLabel,'Поворотное открывание');
});