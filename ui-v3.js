(() => {
  'use strict';

  const D = window.LUMI;
  const DATA = window.LUMI_DATA;
  const state = D.state;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const STORAGE_KEY = 'lumi-configurator:v3';

  const FLOW = [
    {id:'construction', title:'Конструкция', short:'Форма и открывание', subtitle:'Выберите формат окна, схему секций и как они будут открываться.'},
    {id:'glass', title:'Материал и стекло', short:'Материал и комфорт', subtitle:'Оставляем только понятные решения — технические ограничения проверяет система.'},
    {id:'system', title:'Подходящее решение', short:'Система', subtitle:'Показываем только совместимые REHAU и ALUMARK и объясняем рекомендацию.'},
    {id:'extras', title:'Комплектация', short:'Опции', subtitle:'Добавьте то, что действительно относится к выбранной конструкции.'}
  ];

  const HELP = {
    construction:{title:'Что такое схема конструкции?', text:'Тип конструкции отвечает на вопрос «что устанавливаем», а схема — из каких секций она состоит и как они расположены.', points:['Двухстворчатое окно может иметь две глухие секции или одну активную.','Панорамная конструкция может быть обычной, PSK или подъёмно-сдвижной.']},
    opening:{title:'Как выбрать открывание?', text:'Открывание задаётся конкретной створке. Мы скрываем механизмы, которые не подходят выбранной схеме.', points:['Глухая — не открывается.','Поворотная — обычное открывание.','Поворотно-откидная — открывание + проветривание.','PSK и подъёмно-сдвижное доступны только в соответствующих портальных схемах.']},
    material:{title:'ПВХ или алюминий?', text:'Материал влияет на внешний вид, диапазон конструкций и доступные профильные системы.', points:['ПВХ — привычное тёплое решение для квартир и домов.','Алюминий — тоньше визуально и лучше подходит для крупных современных конструкций.','Холодный алюминий используется там, где теплоизоляция не нужна.']},
    glazing:{title:'Стеклопакет — это не камеры профиля', text:'Камеры профиля находятся внутри самой рамы. Камеры стеклопакета — пространства между стёклами.', points:['Однокамерный стеклопакет: 2 стекла и 1 камера.','Двухкамерный: 3 стекла и 2 камеры.','Например, у GRAZIO 5 камер профиля, но стеклопакет выбирается отдельно.']},
    comfort:{title:'Что означает «Комфорт»?', text:'Это необязательный пользовательский приоритет, а не отдельный тип окна. Точную формулу стекла подбирает специалист.', points:['«Тише» может сочетаться с однокамерным или двухкамерным стеклопакетом.','«Безопасность» обычно реализуется ламинированным стеклом / триплексом.','«Комфорт круглый год» объединяет тепло- и солнцезащитные свойства.']},
    system:{title:'Почему система подбирается автоматически?', text:'Пользователю не нужно знать профиль заранее. Сначала выбирается задача, затем система проверяет материал, механизм, тип конструкции и совместимость.', points:['PSK приводит к совместимым ПВХ-системам.','Подъёмно-сдвижной портал — к ALUMARK S158.','Холодное алюминиевое остекление — к ALUMARK S50.']},
    dimensions:{title:'Зачем размеры доступны всегда?', text:'Размеры удобно менять в любой момент и сразу видеть пропорции. Но прототип не придумывает инженерные лимиты производителя.', points:['Финальные Ш×В подтверждаются после замера.','Также проверяются статический расчёт, вес створок, фурнитура и формула стеклопакета.']}
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const sprite = id => `<svg viewBox="0 0 160 110" aria-hidden="true"><use href="assets/sprite.svg#${id}"></use></svg>`;
  const roleLabel = role => ({window:'Оконная секция',transom:'Фрамуга',balcony_door:'Балконная дверь',entrance_door:'Входная дверь',portal:'Активная створка',portal_fixed:'Глухая часть'})[role] || 'Секция';

  function persist(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(D.snapshot())); }catch(_){} }
  function restore(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(raw) D.hydrate(JSON.parse(raw));
    }catch(_){}
    state.step=Math.max(0,Math.min(FLOW.length-1,Number(state.step)||0));
    D.normalizeState();
  }
  function act(action,{renderAll=true}={}){ D.dispatch(action); state.step=Math.max(0,Math.min(FLOW.length-1,state.step)); persist(); renderAll?render():renderPreview(); }

  function infoButton(topic,label='Подробнее'){
    return `<button class="info-btn" type="button" data-help="${topic}" aria-label="${esc(label)}" title="${esc(label)}">i</button>`;
  }
  function choiceCard(item,selected,action,category,compact=false){
    return `<button type="button" class="choice-card ${compact?'compact':''} ${selected?'is-selected':''}" data-action="${action}" data-value="${esc(item.id)}">
      <span class="tick">✓</span>${sprite(`${category}__${item.id}`)}<strong>${esc(item.name)}</strong><small>${esc(item.desc||item.short||'')}</small>
    </button>`;
  }
  function sectionHeader(title,desc,help){
    return `<div class="group-head"><div><div class="group-title"><h3>${esc(title)}</h3>${help?infoButton(help):''}</div>${desc?`<p>${esc(desc)}</p>`:''}</div></div>`;
  }

  function renderMacroNav(){
    $('#macroNav').innerHTML=FLOW.map((step,i)=>`<button type="button" class="macro-step ${state.step===i?'is-active':''} ${state.step>i?'is-done':''}" data-go="${i}" ${state.step===i?'aria-current="step"':''}><span class="macro-index">0${i+1}</span><strong>${esc(step.short)}</strong></button>`).join('');
  }

  function renderConstruction(){
    const types=`<section class="group">${sectionHeader('Что устанавливаем?','Сначала выберите формат. Всё остальное отфильтруется автоматически.','construction')}<div class="card-grid">${DATA.types.map(x=>choiceCard(x,state.type===x.id,'type','type')).join('')}</div></section>`;
    const schemes=`<section class="group">${sectionHeader('Схема секций',`Варианты для «${D.currentType()?.name||''}».`,'construction')}<div class="scheme-strip">${D.schemesForType().map(x=>`<button type="button" class="scheme-card ${state.scheme===x.id?'is-selected':''}" data-action="scheme" data-value="${x.id}">${sprite(`scheme__${x.id}`)}<strong>${esc(x.name)}</strong><small>${esc(x.desc)}</small></button>`).join('')}</div></section>`;
    const openings=state.sectionOpenings.map((sec,i)=>{
      const opts=D.allowedOpeningsForSection(sec).map(id=>DATA.openingOptions.find(o=>o.id===id)).filter(Boolean);
      return `<div class="sash-row"><div class="sash-meta"><strong>${esc(sec.label)}</strong><span>${esc(roleLabel(sec.role))}</span></div><div class="pill-row">${opts.map(o=>`<button type="button" class="pill ${sec.opening===o.id?'is-selected':''}" data-action="opening" data-index="${i}" data-value="${o.id}">${esc(o.name)}</button>`).join('')}${opts.length===1?'<span class="auto-note">Определено схемой</span>':''}</div></div>`;
    }).join('');
    const openingBlock=`<section class="group">${sectionHeader('Как открывается?','Настройте только активные створки.','opening')}<div class="sash-list">${openings}</div></section>`;
    return types+schemes+openingBlock;
  }

  function renderGlass(){
    const mats=D.allowedMaterials();
    const material=`<section class="group">${sectionHeader('Материал','Выберите материал — бренды и системы покажем позже.','material')}<div class="card-grid ${mats.length===2?'two':''}">${mats.map(x=>choiceCard(x,state.material===x.id,'material','material')).join('')}</div>${mats.length===1?`<div class="inline-note">Материал определён выбранной схемой: ${esc(mats[0].name)}.</div>`:''}</section>`;
    let thermal='';
    if(state.material==='mat_aluminum'){
      const modes=D.availableThermalModes();
      thermal=`<section class="group">${sectionHeader('Тёплое или холодное?','Показываем этот выбор только для алюминия, когда доступны оба сценария.','material')}${modes.length>1?`<div class="segment"><button type="button" class="${state.thermalMode==='mode_warm'?'is-active':''}" data-action="thermal" data-value="mode_warm">Тёплое</button><button type="button" class="${state.thermalMode==='mode_cold'?'is-active':''}" data-action="thermal" data-value="mode_cold">Холодное</button></div>`:`<div class="inline-note">${modes[0]==='mode_warm'?'Для этой конструкции используется тёплое алюминиевое остекление.':'Для этой конструкции используется холодное остекление.'}</div>`}</section>`;
    }
    const gl=D.allowedGlazing();
    const glazingBlock=`<section class="group">${sectionHeader(gl.some(x=>x.id==='gl_single_glass')?'Стекло / стеклопакет':'Стеклопакет','Количество камер стеклопакета выбирается отдельно от профиля.','glazing')}<div class="glass-grid">${gl.map(x=>choiceCard(x,state.glazing===x.id,'glazing','glazing',true)).join('')}</div></section>`;
    const comfortList=D.allowedComfort();
    const comfortBlock=`<section class="group">${sectionHeader('Комфорт — по желанию','Выберите один понятный приоритет или оставьте стандарт.','comfort')}<div class="comfort-grid">${comfortList.map(x=>`<button type="button" class="comfort-chip ${state.comfort===x.id?'is-selected':''}" data-action="comfort" data-value="${x.id}">${sprite(`comfort__${x.id}`)}<div><strong>${esc(x.name==='Без дополнительных свойств'?'Стандарт':x.name)}</strong><span>${esc(x.short||x.desc||'')}</span></div></button>`).join('')}</div></section>`;
    return material+thermal+glazingBlock+comfortBlock;
  }

  function techDetails(s){
    return `<details class="tech-details"><summary>Технические характеристики</summary><div class="tech-grid"><span><b>Глубина системы</b>${esc(s.depth)}</span><span><b>Профиль</b>${esc(s.detail)}</span><span><b>Заполнение</b>${esc(s.filling)}</span><span><b>Теплотехника</b>${esc(s.thermal)}</span><span><b>Шумоизоляция</b>${esc(s.acoustic)}</span><span><b>Назначение</b>${esc(s.tag)}</span></div></details>`;
  }
  function renderSystem(){
    const ranked=D.rankedSystems();
    if(!ranked.length) return `<section class="group"><div class="issue error">Для выбранной комбинации пока нет решения в текущем ассортименте. Вернитесь к материалу или схеме.</div></section>`;
    const recommended=ranked[0].system;
    const selected=D.currentSystem()||recommended;
    const hero=`<article class="system-hero">${sprite(`system__${recommended.id}`)}<div><span class="badge">Рекомендуем</span><h3>${esc(recommended.name)}</h3><p>${esc(recommended.desc)}</p><div class="system-meta"><span class="meta">${esc(recommended.depth)}</span><span class="meta">${esc(recommended.detail)}</span><span class="meta">заполнение ${esc(recommended.filling)}</span></div><div class="why">${esc(D.explainRecommendation(recommended.id))}</div></div><div><button class="select-btn" type="button" data-action="system" data-value="${recommended.id}">${selected.id===recommended.id?'Выбрано ✓':'Выбрать'}</button></div></article>`;
    const alternatives=ranked.slice(1).map(({system:s})=>`<article class="system-alt ${selected.id===s.id?'is-selected':''}">${sprite(`system__${s.id}`)}<div><h4>${esc(s.name)}</h4><p>${esc(s.tag)} · ${esc(s.depth)}</p></div><button type="button" data-action="system" data-value="${s.id}">${selected.id===s.id?'Выбрано':'Выбрать'}</button></article>`).join('');
    return `<section class="group"><div class="result-intro"><div><div class="group-title"><h3>Подходящие системы</h3>${infoButton('system')}</div><p>Не показываем каталог из семи профилей. Система уже отфильтровала несовместимые варианты и поставила лучший сценарий первым.</p></div></div><div class="result-stack">${hero}${alternatives?`<div class="alt-systems">${alternatives}</div>`:''}${techDetails(selected)}</div>${state.systemSelectionMode==='manual'&&selected.id!==recommended.id?'<div class="inline-note"><button class="topbar-btn" type="button" data-action="auto-system">Вернуть автоматическую рекомендацию</button></div>':''}<div class="issue info">Точные габариты, статический расчёт, вес створок, фурнитура и итоговая формула стеклопакета подтверждаются инженером.</div></section>`;
  }

  function renderExtras(){
    const extras=D.allowedExtras();
    const list=`<section class="group">${sectionHeader('Добавьте нужное','Нерелевантные опции уже скрыты.')}<div class="extra-grid">${extras.map(x=>`<button type="button" class="extra ${state.extras.has(x.id)?'is-selected':''}" data-action="extra" data-value="${x.id}">${sprite(`extra__${x.id}`)}<div><strong>${esc(x.name)}</strong><small>${esc(x.price)} · ${esc(x.desc)}</small></div><span class="switch" aria-hidden="true"></span></button>`).join('')}</div></section>`;
    const selectedExtras=extras.filter(x=>state.extras.has(x.id));
    const final=`<section class="group"><div class="group-head"><div><div class="group-title"><h3>Готово к расчёту</h3></div><p>Мы передадим специалисту уже собранную конфигурацию — не придётся повторять всё по телефону.</p></div></div><div class="issue info"><strong>${esc(D.currentType()?.name||'Конструкция')} · ${esc(D.currentSystem()?.name||'Система')}</strong><br>${esc(D.currentGlazing()?.name||'')} · ${esc(D.currentComfort()?.name||'Стандарт')}${selectedExtras.length?` · ${selectedExtras.map(x=>esc(x.name)).join(', ')}`:''}</div></section>`;
    return list+final;
  }

  function renderBody(){
    const flow=FLOW[state.step];
    $('#activeTitle').textContent=flow.title;
    $('#activeSubtitle').textContent=flow.subtitle;
    $('#stepCount').textContent=`0${state.step+1} / 04`;
    const views={construction:renderConstruction,glass:renderGlass,system:renderSystem,extras:renderExtras};
    $('#editorBody').innerHTML=views[flow.id]();
  }

  function glassTint(){
    if(['cf_solar','cf_yearround'].includes(state.comfort)) return '#9fb5c0';
    if(state.comfort==='cf_crystal') return '#e9fbff';
    if(state.comfort==='cf_safe'||state.comfort==='cf_quiet_safe') return '#bfd7dc';
    return '#c8e2e7';
  }
  function openingGlyph(opening,x,y,w,h){
    const c='#315bff';
    if(opening==='op_turn') return `<path d="M${x+8} ${y+8} L${x+w-13} ${y+h/2} L${x+8} ${y+h-8}" fill="none" stroke="${c}" stroke-width="2.5" opacity=".92"/>`;
    if(opening==='op_tilt_turn') return `<path d="M${x+8} ${y+8} L${x+w-13} ${y+h/2} L${x+8} ${y+h-8} M${x+8} ${y+8} L${x+w/2} ${y+27} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5" opacity=".92"/>`;
    if(opening==='op_tilt') return `<path d="M${x+8} ${y+8} L${x+w/2} ${y+28} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5" opacity=".92"/>`;
    if(['op_psk','op_lift_slide'].includes(opening)) return `<path d="M${x+17} ${y+h/2} H${x+w-20} M${x+w-32} ${y+h/2-8} L${x+w-20} ${y+h/2} L${x+w-32} ${y+h/2+8}" fill="none" stroke="${c}" stroke-width="3.5"/>`;
    return '';
  }
  function panel(sec,x,y,w,h,frame,stroke){
    const inset=8;
    const handle=sec.opening!=='op_fixed'&&!['op_psk','op_lift_slide'].includes(sec.opening)?`<rect x="${x+w-15}" y="${y+h/2-13}" width="3.5" height="26" rx="2" fill="#666"/>`:'';
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${frame}"/><rect x="${x+inset}" y="${y+inset}" width="${Math.max(12,w-inset*2)}" height="${Math.max(12,h-inset*2)}" rx="1" fill="${glassTint()}" stroke="${stroke}" stroke-width="1.5" opacity=".9"/>${openingGlyph(sec.opening,x,y,w,h)}${handle}</g>`;
  }
  function previewPanels(){
    const scheme=D.currentScheme();
    const secs=state.sectionOpenings;
    const frame=state.material==='mat_pvc'?'#f7f7f2':'#242628';
    const stroke=state.material==='mat_pvc'?'#c8ccca':'#121314';
    const tall=state.type==='ct_entrance'||state.type==='ct_balcony_block';
    const maxW=470,maxH=tall?350:285;
    const aspect=Math.max(.45,Math.min(4.5,state.width/state.height));
    let w=Math.min(maxW,maxH*aspect),h=Math.min(maxH,maxW/aspect);
    w=Math.max(220,w);h=Math.max(150,h);
    const x=(760-w)/2,y=94+(350-h)/2;
    if(scheme?.layout==='transom'&&secs.length===2){
      const topH=Math.max(52,h*.22),gap=7;
      return {markup:panel(secs[1],x,y,w,topH,frame,stroke)+panel(secs[0],x,y+topH+gap,w,h-topH-gap,frame,stroke),x,y,w,h};
    }
    const gap=7,totalRatio=secs.reduce((a,s)=>a+(s.ratio||1),0)||1;
    let cursor=x; let out='';
    secs.forEach((sec,i)=>{
      const pw=(w-gap*(secs.length-1))*(sec.ratio||1)/totalRatio;
      out+=panel(sec,cursor,y,pw,h,frame,stroke); cursor+=pw+gap;
    });
    return {markup:out,x,y,w,h};
  }
  function previewSVG(){
    const {markup,x,y,w,h}=previewPanels();
    const system=D.currentSystem();
    const outside=state.view==='outside', schemeView=state.view==='scheme';
    const bg=schemeView?`<rect width="760" height="520" fill="#f7f8f6"/><path d="M70 438 H690" stroke="#d8d9d6" stroke-width="1"/>`:`<defs><linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${outside?'#cbdcdf':'#c7e3e8'}"/><stop offset="1" stop-color="#eef4ed"/></linearGradient></defs><rect width="760" height="520" fill="#e8e7e2"/><rect x="68" y="48" width="624" height="420" rx="28" fill="#f7f5ef"/><rect x="92" y="70" width="576" height="350" rx="18" fill="url(#sky3)"/><path d="M92 337 C176 280 250 330 322 276 C396 220 466 309 552 250 C602 217 634 231 668 219 V420 H92 Z" fill="#809c7c" opacity=".5"/><g fill="#9aaeb3" opacity=".5"><rect x="165" y="210" width="27" height="83"/><rect x="208" y="165" width="38" height="128"/><rect x="515" y="193" width="34" height="100"/><rect x="562" y="226" width="24" height="67"/></g>`;
    return `<svg viewBox="0 0 760 520" role="img" aria-label="Предпросмотр выбранной конструкции">${bg}<g>${markup}</g><g stroke="#315bff" stroke-width="1.3" fill="none"><path d="M${x} ${y-24} H${x+w}"/><path d="M${x-24} ${y} V${y+h}"/></g><g fill="#315bff" font-family="Inter,Arial" font-size="10"><text x="${x+w/2-25}" y="${y-30}">${state.width} мм</text><text transform="translate(${x-31},${y+h/2+24}) rotate(-90)">${state.height} мм</text></g><g font-family="Inter,Arial"><text x="28" y="32" font-size="11" font-weight="700" fill="#0b0c0d">${esc(system?.name||'Подбор системы')}</text><text x="28" y="49" font-size="9" fill="#64686d">${esc(D.currentType()?.name||'')} · ${esc(D.currentMaterial()?.short||'')}</text></g></svg>`;
  }

  function summaryChips(){
    const items=[D.currentScheme()?.name,D.currentGlazing()?.name,state.comfort!=='cf_none'?D.currentComfort()?.name:null,...state.sectionOpenings.filter(s=>s.opening!=='op_fixed').slice(0,2).map(s=>DATA.openingOptions.find(o=>o.id===s.opening)?.name)].filter(Boolean);
    return items.map(x=>`<span class="summary-chip">${esc(x)}</span>`).join('');
  }
  function renderPreview(){
    $('#windowCanvas').innerHTML=previewSVG();
    $('#widthInput').value=state.width;
    $('#heightInput').value=state.height;
    $('#summaryTitle').textContent=D.currentType()?.name||'Конструкция';
    $('#summarySub').textContent=`${state.width} × ${state.height} мм · ${D.currentMaterial()?.short||''}`;
    $('#summaryChips').innerHTML=summaryChips();
    const s=D.currentSystem();
    $('#summarySystem').innerHTML=s?`<div><span>Выбранная система</span><strong>${esc(s.name)}</strong><p>${esc(D.explainRecommendation(s.id))}</p></div>`:`<div><span>Система</span><strong>Подбираем</strong></div>`;
    $$('.view-tabs button').forEach(b=>b.classList.toggle('is-active',b.dataset.view===state.view));
  }

  function renderActions(){
    const nextLabel=state.step===0?'Материал и стекло →':state.step===1?'Показать решения →':state.step===2?'К комплектации →':'Получить расчёт →';
    $('#prevBtn').disabled=state.step===0;
    $('#nextBtn').textContent=nextLabel;
    $('#nextBtn').classList.toggle('accent',state.step===FLOW.length-1);
    $('#miniProgress').innerHTML=FLOW.map((_,i)=>`<i class="${i<=state.step?'is-active':''}"></i>`).join('');
  }

  function render(){
    state.step=Math.max(0,Math.min(FLOW.length-1,state.step));
    D.normalizeState();
    renderMacroNav();
    renderBody();
    renderPreview();
    renderActions();
  }

  function openHelp(topic){
    const h=HELP[topic]||HELP.construction;
    $('#helpTitle').textContent=h.title;
    $('#helpText').textContent=h.text;
    $('#helpPoints').innerHTML=(h.points||[]).map(x=>`<div class="help-point">${esc(x)}</div>`).join('');
    $('#helpDialog').showModal();
  }
  function openLead(kind='quote'){
    const map={quote:['Получить расчёт','Оставьте телефон — специалист получит выбранную конфигурацию и уточнит детали.'],measure:['Бесплатный замер','Оставьте телефон — согласуем удобное время замера.'],call:['Заказать звонок','Перезвоним и поможем с выбором.']};
    const c=map[kind]||map.quote;
    $('#leadTitle').textContent=c[0];
    $('#leadText').textContent=c[1];
    const s=D.currentSystem();
    $('#leadSummary').value=`${D.currentType()?.name||''}; ${state.width}×${state.height} мм; ${D.currentMaterial()?.short||''}; ${D.currentGlazing()?.name||''}; ${D.currentComfort()?.name||''}; ${s?.name||''}`;
    $('#leadDialog').showModal();
  }

  function handleAction(el){
    const action=el.dataset.action,value=el.dataset.value;
    if(action==='type'){act({type:'SELECT_TYPE',value});return;}
    if(action==='scheme'){act({type:'SELECT_SCHEME',value});return;}
    if(action==='opening'){act({type:'SELECT_OPENING',index:+el.dataset.index,value});return;}
    if(action==='material'){act({type:'SELECT_MATERIAL',value});return;}
    if(action==='thermal'){act({type:'SELECT_THERMAL',value});return;}
    if(action==='glazing'){act({type:'SELECT_GLAZING',value});return;}
    if(action==='comfort'){act({type:'SELECT_COMFORT',value});return;}
    if(action==='system'){act({type:'SELECT_SYSTEM',value});return;}
    if(action==='auto-system'){act({type:'AUTO_SYSTEM'});return;}
    if(action==='extra'){act({type:'TOGGLE_EXTRA',value});return;}
  }

  document.addEventListener('click',e=>{
    const action=e.target.closest('[data-action]'); if(action){handleAction(action);return;}
    const go=e.target.closest('[data-go]'); if(go){state.step=+go.dataset.go;persist();render();return;}
    const help=e.target.closest('[data-help]'); if(help){openHelp(help.dataset.help);return;}
    const lead=e.target.closest('[data-lead]'); if(lead){openLead(lead.dataset.lead);return;}
    const view=e.target.closest('[data-view]'); if(view){act({type:'SET_VIEW',value:view.dataset.view},{renderAll:false});return;}
  });

  $('#prevBtn').addEventListener('click',()=>{if(state.step>0){state.step--;persist();render();if(innerWidth<861)$('#editor').scrollIntoView({behavior:'smooth',block:'start'});}});
  $('#nextBtn').addEventListener('click',()=>{
    if(state.step<FLOW.length-1){state.step++;persist();render();if(innerWidth<861)$('#editor').scrollIntoView({behavior:'smooth',block:'start'});} else openLead('quote');
  });
  $('#widthInput').addEventListener('change',e=>act({type:'SET_DIMENSION',field:'width',value:Math.max(1,+e.target.value||1400)}));
  $('#heightInput').addEventListener('change',e=>act({type:'SET_DIMENSION',field:'height',value:Math.max(1,+e.target.value||1500)}));
  $('#resetBtn').addEventListener('click',()=>{D.reset();state.step=0;try{localStorage.removeItem(STORAGE_KEY)}catch(_){}render();});
  $('#fullscreenPreview').addEventListener('click',()=>$('#previewStage').requestFullscreen?.());
  $('#summaryEdit').addEventListener('click',()=>{state.step=0;persist();render();$('#editor').scrollIntoView({behavior:'smooth',block:'start'});});
  $('#dimensionHelp').addEventListener('click',()=>openHelp('dimensions'));

  $('#leadForm').addEventListener('submit',e=>{e.preventDefault();$('#leadDialog').close();const t=$('#toast');t.textContent='Спасибо. В прототипе форма не отправляет данные на сервер.';t.classList.add('is-visible');setTimeout(()=>t.classList.remove('is-visible'),2600);});

  restore();
  render();
})();
