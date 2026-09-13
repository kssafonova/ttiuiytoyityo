(() => {
  'use strict';
  const D=window.LUMI, DATA=window.LUMI_DATA, state=D.state;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORAGE_KEY='lumi-configurator:v6';
  let step=0;
  const FLOW=[
    {title:'Тип конструкции и размеры',short:'Конструкция + размеры',subtitle:'Сначала выберите, что устанавливаем. После этого укажите размеры именно этой конструкции.'},
    {title:'Схема и открывание',short:'Схема + открывание',subtitle:'Выберите геометрию, затем настройте только допустимые способы открывания.'},
    {title:'Материал, стекло и комфорт',short:'Материал + стекло',subtitle:'Совместимые материалы и системы уже отфильтрованы предыдущими решениями.'}
  ];
  const HELP={
    type:['Тип конструкции','Четыре продуктовых сценария: обычное окно, панорамное окно, балконный блок и панорамная дверь. Каждый имеет собственную матрицу схем и совместимости.'],
    dimensions:['Размеры','Размеры относятся к выбранной конструкции. Точные min/max не выдумываются: финальные ограничения должны поступать из конкретной профильной системы и фурнитуры.'],
    scheme:['Схема и секции','Сначала выбирается геометрия: количество секций, импост, штульп, фрамуга или портальная схема. Только затем — открывание.'],
    opening:['Открывание','Недопустимые варианты не показываются. У штульпа пассивная створка ограничена, PSK и подъёмно-сдвижной портал имеют фиксированный механизм.'],
    material:['Материал','ПВХ / REHAU или алюминий / ALUMARK показываются только если подходят выбранной схеме. Для алюминия тёплый/холодный режим также сценарный.'],
    glazing:['Стеклопакет','Камеры стеклопакета и камеры профиля — разные вещи. Здесь выбирается базовая конструкция стеклопакета; требование по теплу/тишине задаётся отдельно.'],
    comfort:['Что важнее?','Необязательный приоритет. Он влияет на рекомендацию системы и формулу стеклопакета, но не заставляет пользователя разбираться в технических составах.'],
    extras:['Дополнительные опции','В интерфейсе оставлены только подоконник и москитная сетка. Они появляются только когда допустимы текущим сценарием.']
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sprite=id=>`<svg viewBox="0 0 160 110" aria-hidden="true"><use href="assets/sprite.svg#${id}"></use></svg>`;
  const roleLabel=r=>({window:'Оконная секция',transom:'Фрамуга',shtulp_active:'Основная створка',shtulp_passive:'Пассивная створка',balcony_door:'Балконная дверь',entrance_door:'Панорамная дверь',portal:'Активная створка',portal_fixed:'Глухая секция'})[r]||'Секция';
  const openingShort=id=>({op_fixed:'FIX',op_turn:'TURN',op_tilt_turn:'TT',op_tilt:'TILT',op_psk:'PSK',op_lift_slide:'HST'})[id]||id;

  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(D.snapshot()));}catch(_){}}
  function restore(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)D.hydrate(JSON.parse(raw));}catch(_){}D.normalizeState();}
  function act(action){D.dispatch(action);persist();render();}
  function info(topic){const [title,text]=HELP[topic];return `<button type="button" class="info-dot" data-help="${topic}" data-tip="${esc(text)}" aria-label="${esc(title)}">i</button>`;}
  function block(title,subtitle,body,topic){return `<section class="field-block"><div class="field-head"><div><h3>${esc(title)} ${topic?info(topic):''}</h3>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></div>${body}</section>`;}
  function typeCard(item){const selected=state.type===item.id;return `<button class="visual-card ${selected?'is-selected':''}" type="button" data-action="type" data-value="${item.id}"><span class="select-mark">✓</span><div class="visual-media">${sprite(item.asset||`type__${item.id}`)}</div><strong>${esc(item.name)}</strong><small>${esc(item.desc)}</small><em class="card-price">${esc(item.priceLabel||'по расчёту')}</em></button>`;}
  function typeContent(){return `<div class="type-grid product-type-grid">${DATA.types.map(typeCard).join('')}</div>`;}

  function dimensionLabels(){
    if(state.type==='ct_balcony_block')return['Общая ширина блока, мм','Максимальная высота блока, мм'];
    if(state.type==='ct_panoramic_door')return['Ширина проёма, мм','Высота проёма, мм'];
    if(state.type==='ct_panoramic')return['Ширина проёма, мм','Высота проёма, мм'];
    return['Ширина окна, мм','Высота окна, мм'];
  }
  function dimensionsContent(){const [wl,hl]=dimensionLabels();return `<div class="dimension-grid"><label><span>${esc(wl)}</span><div class="number-box"><button type="button" data-nudge="width:-10">−</button><input id="widthInput" type="number" min="1" step="10" inputmode="numeric" value="${state.width}"><button type="button" data-nudge="width:10">+</button></div></label><label><span>${esc(hl)}</span><div class="number-box"><button type="button" data-nudge="height:-10">−</button><input id="heightInput" type="number" min="1" step="10" inputmode="numeric" value="${state.height}"><button type="button" data-nudge="height:10">+</button></div></label><button class="measure-cta" type="button" data-lead="measure"><span class="measure-icon">⌁</span><span>Не знаете размеры?<strong>Бесплатный замер →</strong></span></button></div><p class="engineering-note">Точные допустимые размеры будут проверяться по выбранной системе и фурнитуре — без выдуманных универсальных ограничений.</p>`;}

  function schemeMini(s){
    const sec=s.sections||[];
    if(s.layout==='transom') return `<div class="mini-window mini-transom"><i>ФРАМУГА</i><div>${sec.filter(x=>x.role!=='transom').map(x=>`<span>${openingShort(x.defaultOpening)}</span>`).join('')}</div></div>`;
    if(s.disabled) return `<div class="mini-window mini-disabled"><span>SLIDE</span><span>FIX</span></div>`;
    return `<div class="mini-window ${s.uxMode==='shtulp'?'mini-shtulp':''}">${sec.map(x=>`<span>${openingShort(x.defaultOpening)}</span>`).join('')}</div>`;
  }
  function genericSchemeContent(){return `<div class="scheme-grid">${D.schemesForType().map(s=>`<button class="visual-card ${state.scheme===s.id?'is-selected':''} ${s.disabled?'is-disabled':''}" ${s.disabled?'disabled':''} type="button" data-action="scheme" data-value="${s.id}"><span class="select-mark">✓</span><div class="visual-media">${schemeMini(s)}</div><strong>${esc(s.name)}</strong><small>${esc(s.disabled?s.disabledReason:s.desc)}</small></button>`).join('')}</div>`;}

  function windowSchemeContent(){
    const s=D.currentScheme();
    const count=s?.uxGroup||String(s?.sectionCount||1);
    const countMap={1:'sc_win_1',2:'sc_win_2_mullion',3:'sc_win_3',other:'sc_win_transom'};
    let html=`<div class="choice-caption">Количество секций</div><div class="segment-row">${[['1','1 секция'],['2','2 секции'],['3','3 секции'],['other','Другие варианты']].map(([id,label])=>`<button type="button" class="segment ${count===id?'is-active':''}" data-window-count="${id}" data-value="${countMap[id]}">${label}</button>`).join('')}</div>`;
    if(count==='2'){
      const shtulp=s?.uxMode==='shtulp';
      html+=`<div class="choice-caption">Как устроено окно?</div><div class="construction-modes">
        <button type="button" class="mode-card ${s?.id==='sc_win_2_mullion'?'is-selected':''}" data-action="scheme" data-value="sc_win_2_mullion">${schemeMini(DATA.schemes.ct_window.find(x=>x.id==='sc_win_2_mullion'))}<strong>С импостом</strong><small>Постоянная стойка между секциями</small></button>
        <button type="button" class="mode-card ${shtulp?'is-selected':''}" data-action="scheme" data-value="${shtulp?s.id:'sc_win_2_shtulp_right'}">${schemeMini(DATA.schemes.ct_window.find(x=>x.id==='sc_win_2_shtulp_right'))}<strong>Без стойки по центру</strong><small>Штульповое окно</small></button>
        <button type="button" class="mode-card is-disabled" disabled>${schemeMini(DATA.schemes.ct_window.find(x=>x.id==='sc_win_2_slide'))}<strong>Раздвижное</strong><small>Появится после подтверждения совместимой оконной системы</small></button>
      </div>`;
      if(shtulp) html+=`<div class="inline-question"><span>Какая створка основная?</span><div class="thermal-switch"><button type="button" class="${s.primarySide==='left'?'is-active':''}" data-action="scheme" data-value="sc_win_2_shtulp_left">Левая</button><button type="button" class="${s.primarySide==='right'?'is-active':''}" data-action="scheme" data-value="sc_win_2_shtulp_right">Правая</button></div><small>При открытых створках в центре не остаётся вертикальной стойки.</small></div>`;
    } else if(count==='other'){
      html+=`<div class="construction-modes single-mode"><button type="button" class="mode-card is-selected" data-action="scheme" data-value="sc_win_transom">${schemeMini(DATA.schemes.ct_window.find(x=>x.id==='sc_win_transom'))}<strong>Добавить верхнюю фрамугу</strong><small>Фрамуга настраивается отдельно от основной части</small></button></div>`;
    } else {
      html+=`<div class="scheme-focus">${schemeMini(s)}<div><strong>${esc(s?.name||'')}</strong><small>${esc(s?.desc||'')}</small></div></div>`;
    }
    return html;
  }
  function schemeContent(){return state.type==='ct_window'?windowSchemeContent():genericSchemeContent();}

  function openingPresets(){const s=D.currentScheme();if(!s?.presets?.length)return'';return `<div class="preset-block"><div class="choice-caption">Быстрые варианты</div><div class="preset-row">${s.presets.map(p=>`<button type="button" class="preset" data-preset="${p.values.join('|')}">${esc(p.name)}</button>`).join('')}<button type="button" class="preset is-soft">Настроить самостоятельно</button></div></div>`;}
  function fixedWarning(){
    if(!D.allFixed())return'';
    return `<div class="ux-warning"><strong>Проверьте возможность безопасного обслуживания</strong><p>Полностью глухое окно подходит не для всех помещений. Возможность зависит от расположения окна и доступа к наружному стеклу.</p><span>Где устанавливается окно?</span><div class="context-row">${DATA.installationContexts.map(x=>`<button type="button" class="${state.installationContext===x.id?'is-selected':''}" data-context="${x.id}">${esc(x.name)}</button>`).join('')}</div></div>`;
  }
  function openingContent(){
    const rows=state.sectionOpenings.map((sec,i)=>{const opts=D.allowedOpeningsForSection(sec).map(id=>DATA.openingOptions.find(o=>o.id===id)).filter(Boolean);return `<div class="opening-row"><div class="opening-meta"><strong>${esc(sec.label)}</strong><span>${esc(roleLabel(sec.role))}</span></div><div class="opening-options">${opts.map(o=>`<button type="button" class="opening-pill ${sec.opening===o.id?'is-selected':''}" data-action="opening" data-index="${i}" data-value="${o.id}"><strong>${esc(o.name)}${o.recommended?' · рекомендуем':''}</strong><small>${esc(o.short)}</small></button>`).join('')}${opts.length===1?'<em>Определено конструкцией</em>':''}</div></div>`;}).join('');
    return openingPresets()+`<div class="opening-list">${rows}</div>`+fixedWarning();
  }

  function compactCard(item,selected,action,category){return `<button class="compact-card ${selected?'is-selected':''}" type="button" data-action="${action}" data-value="${item.id}">${sprite(`${category}__${item.id}`)}<span><strong>${esc(item.name)}</strong><small>${esc(item.short||item.desc||'')}</small></span><b>✓</b></button>`;}
  function materialContent(){const list=D.allowedMaterials();let thermal='';if(state.material==='mat_aluminum'){const modes=D.availableThermalModes();thermal=modes.length>1?`<div class="thermal-row"><span>Алюминиевое остекление</span><div class="thermal-switch"><button class="${state.thermalMode==='mode_warm'?'is-active':''}" data-action="thermal" data-value="mode_warm">Тёплое</button><button class="${state.thermalMode==='mode_cold'?'is-active':''}" data-action="thermal" data-value="mode_cold">Холодное</button></div></div>`:`<div class="auto-strip">${modes[0]==='mode_cold'?'Холодное':'Тёплое'} остекление определено выбранной конструкцией.</div>`;}return `<div class="material-grid">${list.map(x=>compactCard(x,state.material===x.id,'material','material')).join('')}</div>${thermal}`;}
  function glazingContent(){return `<div class="glass-grid">${D.allowedGlazing().map(x=>compactCard(x,state.glazing===x.id,'glazing','glazing')).join('')}</div>`;}
  function comfortContent(){const primary=['cf_none','cf_warm','cf_quiet','cf_solar'];const all=D.allowedComfort();const first=all.filter(x=>primary.includes(x.id)),rest=all.filter(x=>!primary.includes(x.id));const card=x=>`<button type="button" class="comfort-option ${state.comfort===x.id?'is-selected':''}" data-action="comfort" data-value="${x.id}">${sprite(`comfort__${x.id}`)}<span><strong>${esc(x.id==='cf_none'?'Без приоритета':x.name)}</strong><small>${esc(x.short||x.desc)}</small></span><b>✓</b></button>`;return `<div class="comfort-grid">${first.map(card).join('')}</div>${rest.length?`<details class="more-comfort"><summary>Другие свойства</summary><div class="comfort-grid">${rest.map(card).join('')}</div></details>`:''}`;}

  function renderStep(){
    const root=$('#editor'),current=FLOW[step];if(!root)return;
    $('#stepTitle').textContent=current.title;$('#stepSubtitle').textContent=current.subtitle;$('#stepCount').textContent=`0${step+1} / 03`;
    if(step===0)root.innerHTML=block('Тип конструкции','Выберите продуктовый сценарий. От него зависят все следующие варианты.',typeContent(),'type')+block('Размеры',`Размеры для «${D.currentType()?.name||''}». Можно указать примерные.`,dimensionsContent(),'dimensions');
    else if(step===1)root.innerHTML=block('Схема окна / секций',state.type==='ct_window'?'Сначала геометрия, затем открывание — без длинного списка комбинаций.':`Доступные схемы для «${D.currentType()?.name||''}».`,schemeContent(),'scheme')+block('Открывание','Настройте только те секции, которые конструкция позволяет менять.',openingContent(),'opening');
    else root.innerHTML=block('Материал','Доступны только совместимые с выбранной конструкцией материалы.',materialContent(),'material')+block('Стеклопакет','Базовая конструкция стеклопакета. Точную формулу подберём по системе.',glazingContent(),'glazing')+block('Что для вас важнее?','Необязательно. Приоритет сразу влияет на рекомендацию справа.',comfortContent(),'comfort');
    $('#prevBtn').disabled=step===0;$('#nextBtn').textContent=step===2?'Готово ✓':`${FLOW[step+1].title} →`;$('#nextBtn').classList.toggle('is-final',step===2);
    $('#stepNav').innerHTML=FLOW.map((s,i)=>`<button type="button" class="${i===step?'is-active':''} ${i<step?'is-done':''}" data-go-step="${i}"><span>0${i+1}</span><strong>${esc(s.short)}</strong></button>`).join('');
  }

  function frameColor(){return state.material==='mat_aluminum'?'#4d5358':'#f7f7f5';}
  function glyph(opening,x,y,w,h){const c='#2780f8';if(opening==='op_turn')return `<path d="M${x+7} ${y+7} L${x+w-10} ${y+h/2} L${x+7} ${y+h-7}" fill="none" stroke="${c}" stroke-width="2"/>`;if(opening==='op_tilt_turn')return `<path d="M${x+7} ${y+7} L${x+w-10} ${y+h/2} L${x+7} ${y+h-7} M${x+7} ${y+7} L${x+w/2} ${y+22} L${x+w-7} ${y+7}" fill="none" stroke="${c}" stroke-width="2"/>`;if(opening==='op_tilt')return `<path d="M${x+7} ${y+7} L${x+w/2} ${y+22} L${x+w-7} ${y+7}" fill="none" stroke="${c}" stroke-width="2"/>`;if(['op_psk','op_lift_slide'].includes(opening))return `<path d="M${x+15} ${y+h/2} H${x+w-18} M${x+w-30} ${y+h/2-8} L${x+w-18} ${y+h/2} L${x+w-30} ${y+h/2+8}" fill="none" stroke="${c}" stroke-width="3"/>`;return'';}
  function renderPreview(){
    const root=$('#windowCanvas');if(!root)return;const s=D.currentScheme();if(!s)return;
    const maxW=530,maxH=330,aspect=Math.max(.5,Math.min(4,state.width/state.height));let w=Math.min(maxW,maxH*aspect),h=Math.min(maxH,maxW/aspect);w=Math.max(220,w);h=Math.max(170,h);const x=(620-w)/2,y=(385-h)/2;
    const fc=frameColor(),glass=['cf_solar','cf_yearround'].includes(state.comfort)?'#bdd3df':'#dceff8';let inner='';
    if(s.layout==='transom'){
      const transH=h*.24,mainH=h-transH-8;const main=state.sectionOpenings.find(q=>q.role!=='transom'),trans=state.sectionOpenings.find(q=>q.role==='transom');
      inner+=`<rect x="${x+10}" y="${y+10}" width="${w-20}" height="${transH-10}" rx="2" fill="${glass}" stroke="#55616a"/>${glyph(trans?.opening,x+10,y+10,w-20,transH-10)}<rect x="${x+10}" y="${y+transH+5}" width="${w-20}" height="${mainH-10}" rx="2" fill="${glass}" stroke="#55616a"/>${glyph(main?.opening,x+10,y+transH+5,w-20,mainH-10)}`;
    }else{
      const total=state.sectionOpenings.reduce((a,b)=>a+(b.ratio||1),0);let cursor=x+10;state.sectionOpenings.forEach((sec,i)=>{const sw=(w-20)*(sec.ratio||1)/total;const gap=s.uxMode==='shtulp'?1:5;inner+=`<rect x="${cursor}" y="${y+10}" width="${Math.max(20,sw-gap)}" height="${h-20}" rx="2" fill="${glass}" stroke="#55616a"/>${glyph(sec.opening,cursor,y+10,Math.max(20,sw-gap),h-20)}`;cursor+=sw;});
    }
    root.innerHTML=`<svg viewBox="0 0 620 385" role="img" aria-label="Предварительная схема"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#cfeaff"/><stop offset="1" stop-color="#eef8fb"/></linearGradient></defs><rect width="620" height="385" fill="url(#sky)"/><circle cx="500" cy="70" r="34" fill="#fff" opacity=".7"/><path d="M0 300 Q120 260 230 300 T450 290 T620 305 V385 H0Z" fill="#b9d6bb"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${fc}" stroke="#8a9197" stroke-width="7"/>${inner}<text x="310" y="372" text-anchor="middle" font-size="12" fill="#5e6c78">${esc(D.currentType()?.name||'')} · ${state.width} × ${state.height} мм</text></svg>`;
    $$('.view-tabs button').forEach(b=>b.classList.toggle('is-active',b.dataset.view===state.view));
  }

  function renderSolution(){
    const type=D.currentType(),scheme=D.currentScheme(),system=D.currentSystem(),glass=D.currentGlazing(),comfort=D.currentComfort(),mat=D.currentMaterial();
    $('#solutionTitle').textContent=type?.name||'Ваше решение';
    $('#solutionMeta').innerHTML=`<strong>${esc(type?.priceLabel||'по расчёту')}</strong> · ориентир до замера`;
    const openingText=state.sectionOpenings.map(x=>`${x.label}: ${DATA.openingOptions.find(o=>o.id===x.opening)?.name||x.opening}`).join(' · ');
    $('#solutionChips').innerHTML=[`${state.width} × ${state.height} мм`,scheme?.name,openingText,mat?.short,glass?.name,comfort?.id==='cf_none'?null:comfort?.name].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
    const issues=D.validationIssues().filter(x=>x.severity==='warning');
    $('#solutionSystem').innerHTML=system?`<div class="system-result"><div><span>Рекомендуем</span><strong>${esc(system.name)}</strong><small>${esc(system.tag)} · ${esc(system.depth)} · ${esc(system.detail)}</small></div><p>${esc(D.explainRecommendation())}</p></div>${issues.map(x=>`<div class="solution-warning">${esc(x.message)}</div>`).join('')}`:`<div class="solution-warning">Для комбинации нужна дополнительная инженерная проверка.</div>`;
  }

  function sillConfig(){const s=state.extraConfig.sill||{};return `<div class="extra-config"><label>Глубина, мм<input type="number" min="50" step="10" value="${esc(s.depth||250)}" data-extra-field="depth"></label><label>Длина, мм<input type="number" min="100" step="10" value="${esc(s.length||state.width)}" data-extra-field="length"></label><label>Цвет<input value="Белый" disabled></label></div>`;}
  function mosquitoConfig(){const eligible=D.eligibleMosquitoSections();if(!eligible.length)return'<div class="extra-note">Недоступна: в конструкции нет подходящей открывающейся створки.</div>';const selected=new Set(state.extraConfig.mosquitoSections||[]);return `<div class="extra-config mosquito-config"><span>На какую створку?</span><div>${eligible.map(({section,index})=>`<button type="button" class="${selected.has(index)?'is-selected':''}" data-mosquito-index="${index}">${esc(section.label)}</button>`).join('')}</div></div>`;}
  function renderOptions(){
    const root=$('#rightExtras');if(!root)return;const allowed=D.allowedExtras(),ids=new Set(allowed.map(x=>x.id));const options=['ex_sill','ex_mosquito'].map(id=>DATA.extras.find(x=>x.id===id)).filter(Boolean);
    root.innerHTML=options.map(x=>{const allowedNow=ids.has(x.id),selected=state.extras.has(x.id);const note=!allowedNow?(x.id==='ex_mosquito'?'В конструкции нет подходящей открывающейся створки.':'Недоступно для выбранной конструкции.'):(x.price||'');return `<div class="extra-shell ${!allowedNow?'is-disabled':''}"><button type="button" class="right-extra ${selected?'is-selected':''}" ${!allowedNow?'disabled':''} data-action="extra" data-value="${x.id}">${sprite(`extra__${x.id}`)}<span><strong>${selected?'✓ ':''}${esc(x.name)}</strong><small>${esc(note)}</small></span><i></i></button>${selected&&allowedNow?(x.id==='ex_sill'?sillConfig():mosquitoConfig()):''}</div>`;}).join('');
  }

  function render(){D.normalizeState();renderStep();renderPreview();renderSolution();renderOptions();}
  function showHelp(topic){const d=$('#helpDialog'),item=HELP[topic];if(!d||!item)return;$('#helpTitle').textContent=item[0];$('#helpText').textContent=item[1];d.showModal();}
  function openLead(kind){const d=$('#leadDialog');if(!d)return;$('#leadTitle').textContent=kind==='measure'?'Вызвать замерщика':kind==='call'?'Заказать звонок':'Получить расчёт';$('#leadSummary').value=JSON.stringify(D.snapshot());d.showModal();}

  document.addEventListener('click',e=>{
    const help=e.target.closest('[data-help]');if(help){showHelp(help.dataset.help);return;}
    const lead=e.target.closest('[data-lead]');if(lead){openLead(lead.dataset.lead);return;}
    const go=e.target.closest('[data-go-step]');if(go){step=Math.max(0,Math.min(2,+go.dataset.goStep));render();return;}
    const count=e.target.closest('[data-window-count]');if(count){act({type:'SELECT_SCHEME',value:count.dataset.value});return;}
    const preset=e.target.closest('[data-preset]');if(preset){act({type:'APPLY_OPENING_PRESET',values:preset.dataset.preset.split('|')});return;}
    const context=e.target.closest('[data-context]');if(context){act({type:'SET_INSTALLATION_CONTEXT',value:context.dataset.context});return;}
    const mosquito=e.target.closest('[data-mosquito-index]');if(mosquito){const index=+mosquito.dataset.mosquitoIndex,current=new Set(state.extraConfig.mosquitoSections||[]);current.has(index)?current.delete(index):current.add(index);act({type:'SET_EXTRA_CONFIG',extra:'mosquito',value:[...current]});return;}
    const nudge=e.target.closest('[data-nudge]');if(nudge){const [field,delta]=nudge.dataset.nudge.split(':');act({type:'SET_DIMENSION',field,value:Number(state[field])+Number(delta)});return;}
    const view=e.target.closest('[data-view]');if(view){act({type:'SET_VIEW',value:view.dataset.view});return;}
    const btn=e.target.closest('[data-action]');if(btn){const map={type:'SELECT_TYPE',scheme:'SELECT_SCHEME',opening:'SELECT_OPENING',material:'SELECT_MATERIAL',thermal:'SELECT_THERMAL',glazing:'SELECT_GLAZING',comfort:'SELECT_COMFORT',extra:'TOGGLE_EXTRA'};const action={type:map[btn.dataset.action],value:btn.dataset.value};if(btn.dataset.index!==undefined)action.index=+btn.dataset.index;if(action.type)act(action);return;}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='widthInput')act({type:'SET_DIMENSION',field:'width',value:e.target.value});
    if(e.target.id==='heightInput')act({type:'SET_DIMENSION',field:'height',value:e.target.value});
    if(e.target.matches('[data-extra-field]'))act({type:'SET_EXTRA_CONFIG',extra:'sill',field:e.target.dataset.extraField,value:e.target.dataset.extraField==='color'?e.target.value:Number(e.target.value)});
  });
  $('#prevBtn')?.addEventListener('click',()=>{step=Math.max(0,step-1);render();});
  $('#nextBtn')?.addEventListener('click',()=>{if(step<2){step++;render();}else openLead('quote');});
  $('#resetBtn')?.addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY);D.reset();step=0;persist();render();});
  $('#leadForm')?.addEventListener('submit',e=>{e.preventDefault();$('#leadDialog').close();const t=$('#toast');t.textContent='Спасибо! Данные конфигурации сохранены в заявке.';t.classList.add('is-visible');setTimeout(()=>t.classList.remove('is-visible'),2600);});
  restore();render();
})();