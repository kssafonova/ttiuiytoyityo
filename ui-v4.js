(() => {
  'use strict';

  const D = window.LUMI;
  const DATA = window.LUMI_DATA;
  const state = D.state;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const STORAGE_KEY='lumi-configurator:v4';
  const MOBILE_FLOW=['Конструкция','Размеры','Материал и стекло','Решение','Комплектация'];
  let mobileStep=0;

  const HELP={
    type:['Тип конструкции','Выберите, что именно устанавливаем. После этого мы покажем только подходящие схемы.'],
    scheme:['Схема секций','Схема отвечает за количество и расположение секций. Открывание задаётся отдельно каждой активной створке.'],
    opening:['Открывание','Глухая секция не открывается. Поворотно-откидная умеет и открываться, и работать в режиме проветривания. PSK и подъёмно-сдвижное доступны только для соответствующих порталов.'],
    material:['ПВХ или алюминий','ПВХ — универсальное тёплое решение. Алюминий визуально тоньше и подходит для крупных конструкций. Холодный алюминий используется там, где теплоизоляция не требуется.'],
    glazing:['Стеклопакет','Однокамерный стеклопакет — 2 стекла и 1 камера. Двухкамерный — 3 стекла и 2 камеры. Это не то же самое, что камеры внутри профиля.'],
    comfort:['Комфорт','Это необязательный пользовательский приоритет: теплее, тише, солнцезащита, безопасность и т. п. Точную формулу стекла подбирает специалист.'],
    system:['Почему подбираем систему автоматически','Пользователю не нужно разбираться в REHAU и ALUMARK заранее. Система проверяет материал, механизм и тип конструкции и показывает только совместимые варианты.'],
    dimensions:['Размеры','Ширина и высота нужны для визуализации и заявки. Точные инженерные пределы, статика, вес створок и фурнитура проверяются после замера.'],
    extras:['Комплектация','Мы скрываем опции, которые не относятся к выбранной конструкции. Например, обычная москитная сетка не предлагается для портала.']
  };

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sprite=id=>`<svg viewBox="0 0 160 110" aria-hidden="true"><use href="assets/sprite.svg#${id}"></use></svg>`;
  const roleLabel=r=>({window:'Оконная секция',transom:'Фрамуга',balcony_door:'Балконная дверь',entrance_door:'Входная дверь',portal:'Активная створка',portal_fixed:'Глухая секция'})[r]||'Секция';

  function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(D.snapshot()))}catch(_){}}
  function restore(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)D.hydrate(JSON.parse(raw))}catch(_){} D.normalizeState();}
  function act(action){D.dispatch(action);persist();render();}

  function info(topic){const [title,text]=HELP[topic];return `<button type="button" class="info-dot" data-help="${topic}" data-tip="${esc(text)}" aria-label="${esc(title)}">i</button>`;}
  function section(num,title,subtitle,body,topic){return `<section class="cfg-section"><div class="cfg-label"><span>${num}</span><div><h3>${esc(title)} ${topic?info(topic):''}</h3>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></div><div class="cfg-content">${body}</div></section>`;}

  function imageCard(item,selected,action,category){return `<button class="visual-card ${selected?'is-selected':''}" type="button" data-action="${action}" data-value="${esc(item.id)}"><span class="select-mark">✓</span><div class="visual-media">${sprite(`${category}__${item.id}`)}</div><strong>${esc(item.name)}</strong><small>${esc(item.desc||item.short||'')}</small></button>`;}
  function miniCard(item,selected,action,category){return `<button class="mini-card ${selected?'is-selected':''}" type="button" data-action="${action}" data-value="${esc(item.id)}">${sprite(`${category}__${item.id}`)}<div><strong>${esc(item.name)}</strong><span>${esc(item.short||item.desc||'')}</span></div><b>✓</b></button>`;}

  function typeContent(){return `<div class="type-grid">${DATA.types.map(x=>imageCard(x,state.type===x.id,'type','type')).join('')}</div>`;}
  function schemeOpeningContent(){
    const schemes=`<div class="subhead"><strong>Схема окна / секций</strong><span>Доступно для «${esc(D.currentType()?.name||'')}»</span></div><div class="scheme-grid">${D.schemesForType().map(x=>imageCard(x,state.scheme===x.id,'scheme','scheme')).join('')}</div>`;
    const openings=state.sectionOpenings.map((sec,i)=>{const opts=D.allowedOpeningsForSection(sec).map(id=>DATA.openingOptions.find(o=>o.id===id)).filter(Boolean);return `<div class="opening-row"><div class="opening-meta"><strong>${esc(sec.label)}</strong><span>${esc(roleLabel(sec.role))}</span></div><div class="opening-options">${opts.map(o=>`<button type="button" class="opening-pill ${sec.opening===o.id?'is-selected':''}" data-action="opening" data-index="${i}" data-value="${o.id}">${esc(o.name)}</button>`).join('')}${opts.length===1?'<em>Определено схемой</em>':''}</div></div>`}).join('');
    return `${schemes}<div class="subhead opening-title"><strong>Открывание</strong>${info('opening')}</div><div class="opening-list">${openings}</div>`;
  }
  function dimensionsContent(){return `<div class="dimension-inline"><label><span>Ширина, мм</span><div class="number-box"><button type="button" data-nudge="width:-10">−</button><input id="widthInputDesktop" type="number" min="1" step="10" value="${state.width}"><button type="button" data-nudge="width:10">+</button></div></label><label><span>Высота, мм</span><div class="number-box"><button type="button" data-nudge="height:-10">−</button><input id="heightInputDesktop" type="number" min="1" step="10" value="${state.height}"><button type="button" data-nudge="height:10">+</button></div></label><button class="measure-cta" type="button" data-lead="measure"><b>⌁</b><span>Не знаете размеры?<strong>Вызвать замерщика →</strong></span></button></div>`;}
  function materialContent(){
    const materials=D.allowedMaterials();
    let modes='';
    if(state.material==='mat_aluminum'){
      const available=D.availableThermalModes();
      modes=available.length>1?`<div class="thermal-switch"><button class="${state.thermalMode==='mode_warm'?'is-active':''}" type="button" data-action="thermal" data-value="mode_warm">Тёплое</button><button class="${state.thermalMode==='mode_cold'?'is-active':''}" type="button" data-action="thermal" data-value="mode_cold">Холодное</button></div>`:`<div class="auto-strip">${available[0]==='mode_warm'?'Тёплое остекление':'Холодное остекление'} определено выбранной конструкцией.</div>`;
    }
    return `<div class="material-grid">${materials.map(x=>miniCard(x,state.material===x.id,'material','material')).join('')}</div>${modes}`;
  }
  function glassContent(){
    const gl=D.allowedGlazing();
    const comfort=D.allowedComfort();
    return `<div class="subhead"><strong>Стеклопакет</strong>${info('glazing')}</div><div class="glass-grid">${gl.map(x=>miniCard(x,state.glazing===x.id,'glazing','glazing')).join('')}</div><div class="subhead comfort-head"><strong>Комфорт <span>необязательно</span></strong>${info('comfort')}</div><div class="comfort-grid">${comfort.map(x=>`<button type="button" class="comfort-option ${state.comfort===x.id?'is-selected':''}" data-action="comfort" data-value="${x.id}">${sprite(`comfort__${x.id}`)}<span><strong>${esc(x.name==='Без дополнительных свойств'?'Стандарт':x.name)}</strong><small>${esc(x.short||x.desc||'')}</small></span><b>✓</b></button>`).join('')}</div>`;
  }
  function systemsContent(){
    const ranked=D.rankedSystems();
    if(!ranked.length)return `<div class="no-result"><strong>Нет совместимого решения</strong><span>Измените материал или схему конструкции.</span></div>`;
    const selected=D.currentSystem();
    return `<div class="system-grid">${ranked.map(({system:s},i)=>`<article class="system-card ${selected?.id===s.id?'is-selected':''} ${i===0?'is-recommended':''}"><div class="system-visual">${sprite(`system__${s.id}`)}</div><div class="system-copy"><div class="system-badges">${i===0?'<span>Рекомендуем</span>':''}<em>${esc(s.tag)}</em></div><h4>${esc(s.name)}</h4><p>${esc(s.desc)}</p><div class="system-specs"><span>${esc(s.depth)}</span><span>${esc(s.detail)}</span><span>${esc(s.filling)}</span></div><details><summary>Характеристики</summary><div><b>Теплотехника</b><span>${esc(s.thermal)}</span><b>Шумоизоляция</b><span>${esc(s.acoustic)}</span></div></details></div><button type="button" class="choose-system" data-action="system" data-value="${s.id}">${selected?.id===s.id?'Выбрано ✓':'Выбрать'}</button></article>`).join('')}</div><div class="system-reason">${info('system')}<span>${esc(D.explainRecommendation(selected?.id))}</span></div>`;
  }
  function extrasContent(){return `<div class="extras-grid">${D.allowedExtras().map(x=>`<button type="button" class="extra-option ${state.extras.has(x.id)?'is-selected':''}" data-action="extra" data-value="${x.id}">${sprite(`extra__${x.id}`)}<span><strong>${esc(x.name)}</strong><small>${esc(x.price||'')} ${x.price?'·':''} ${esc(x.desc||'')}</small></span><i></i></button>`).join('')}</div>`;}

  function renderDesktop(){
    const root=$('#desktopEditor');
    if(!root)return;
    root.innerHTML=[
      section('1','Тип конструкции','Выберите формат — остальные варианты перестроятся автоматически.',typeContent(),'type'),
      section('2','Схема и открывание','Сначала схема секций, затем открывание каждой активной створки.',schemeOpeningContent(),'scheme'),
      section('3','Размеры','Можно изменить в любой момент.',dimensionsContent(),'dimensions'),
      section('4','Материал','Выберите материал, а профильную систему мы подберём позже.',materialContent(),'material'),
      section('5','Стеклопакет и комфорт','Сначала базовая конструкция стеклопакета, затем один необязательный приоритет.',glassContent(),'glazing'),
      section('6','Подходящая система','Только совместимые REHAU / ALUMARK.',systemsContent(),'system'),
      section('7','Комплектация','Добавьте только нужные опции.',extrasContent(),'extras')
    ].join('');
  }

  function mobileStepContent(){
    if(mobileStep===0)return section('1','Конструкция','Тип, схема и открывание.',typeContent()+schemeOpeningContent(),'type');
    if(mobileStep===1)return section('2','Размеры','Укажите примерные размеры.',dimensionsContent(),'dimensions');
    if(mobileStep===2)return section('3','Материал и стекло','Материал, стеклопакет и комфорт.',materialContent()+glassContent(),'material');
    if(mobileStep===3)return section('4','Подходящее решение','Мы уже отфильтровали несовместимые системы.',systemsContent(),'system');
    return section('5','Комплектация','Последние опции перед расчётом.',extrasContent(),'extras');
  }
  function renderMobile(){
    const nav=$('#mobileProgress'); if(nav)nav.innerHTML=MOBILE_FLOW.map((x,i)=>`<button type="button" class="${i===mobileStep?'is-active':''} ${i<mobileStep?'is-done':''}" data-mobile-step="${i}"><span>${i+1}</span><strong>${esc(x)}</strong></button>`).join('');
    const root=$('#mobileEditor');if(root)root.innerHTML=mobileStepContent();
    const prev=$('#mobilePrev'),next=$('#mobileNext');if(prev)prev.disabled=mobileStep===0;if(next){next.textContent=mobileStep===MOBILE_FLOW.length-1?'Получить расчёт':'Далее →';next.classList.toggle('final',mobileStep===MOBILE_FLOW.length-1)}
  }

  function geometry(){const scheme=D.currentScheme(),maxW=500,maxH=(state.type==='ct_entrance'||state.type==='ct_balcony_block')?330:300,aspect=Math.max(.45,Math.min(4.2,state.width/state.height));let w=Math.min(maxW,maxH*aspect),h=Math.min(maxH,maxW/aspect);w=Math.max(220,w);h=Math.max(150,h);return{scheme,w,h,x:(620-w)/2,y:(370-h)/2+22};}
  function tint(){if(['cf_solar','cf_yearround'].includes(state.comfort))return'#b9cedb';if(state.comfort==='cf_crystal')return'#effcff';return'#d9eef8'}
  function glyph(o,x,y,w,h){const c='#3384ff';if(o==='op_turn')return`<path d="M${x+8} ${y+8} L${x+w-12} ${y+h/2} L${x+8} ${y+h-8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;if(o==='op_tilt_turn')return`<path d="M${x+8} ${y+8} L${x+w-12} ${y+h/2} L${x+8} ${y+h-8} M${x+8} ${y+8} L${x+w/2} ${y+26} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;if(o==='op_tilt')return`<path d="M${x+8} ${y+8} L${x+w/2} ${y+25} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;if(['op_psk','op_lift_slide'].includes(o))return`<path d="M${x+18} ${y+h/2} H${x+w-22} M${x+w-35} ${y+h/2-9} L${x+w-22} ${y+h/2} L${x+w-35} ${y+h/2+9}" fill="none" stroke="${c}" stroke-width="3.5"/>`;return''}
  function panel(sec,x,y,w,h,frame){const inset=9;const handle=sec.opening!=='op_fixed'&&!['op_psk','op_lift_slide'].includes(sec.opening)?`<rect x="${x+w-17}" y="${y+h/2-13}" width="4" height="26" rx="2" fill="#7d8792"/>`:'';return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${frame}"/><rect x="${x+inset}" y="${y+inset}" width="${Math.max(12,w-inset*2)}" height="${Math.max(12,h-inset*2)}" fill="${tint()}" stroke="${state.material==='mat_pvc'?'#d6e0e6':'#28343e'}" stroke-width="2"/>${glyph(sec.opening,x,y,w,h)}${handle}</g>`}
  function renderWindowSvg(){const {scheme,w,h,x,y}=geometry(),secs=state.sectionOpenings,frame=state.material==='mat_pvc'?'#f8fafb':'#4f5b65',gap=7;let body='';if(scheme?.layout==='transom'&&secs.length===2){const top=Math.max(44,h*(secs[1].ratio||.22));body=panel(secs[1],x,y,w,top,frame)+panel(secs[0],x,y+top+gap,w,h-top-gap,frame)}else{const total=secs.reduce((a,b)=>a+(b.ratio||1),0);let xx=x;secs.forEach((s,i)=>{const ww=(w-gap*(secs.length-1))*(s.ratio||1)/total;body+=panel(s,xx,y,ww,h,frame);xx+=ww+gap})}
    return `<svg viewBox="0 0 620 390" role="img" aria-label="Предпросмотр конструкции"><defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c9e8ff"/><stop offset="1" stop-color="#f7fbff"/></linearGradient></defs><rect width="620" height="390" fill="url(#sky)"/><path d="M0 300 C90 260 135 300 210 266 C280 236 350 280 430 248 C510 218 560 256 620 228 V390 H0Z" fill="#d7e6df"/><g opacity=".42" fill="#8ca6b8"><rect x="58" y="220" width="35" height="110"/><rect x="100" y="190" width="45" height="140"/><rect x="152" y="242" width="34" height="88"/><rect x="430" y="184" width="48" height="146"/><rect x="487" y="222" width="32" height="108"/><rect x="526" y="204" width="43" height="126"/></g><g filter="drop-shadow(0 16px 22px rgba(20,39,55,.16))">${body}</g><text x="310" y="377" text-anchor="middle" font-size="11" fill="#5b7182">${state.width} × ${state.height} мм</text></svg>`;
  }

  function renderPreview(){
    const canvas=$('#windowCanvas');if(canvas)canvas.innerHTML=renderWindowSvg();
    const mobile=$('#mobilePreviewCanvas');if(mobile)mobile.innerHTML=renderWindowSvg();
    const type=D.currentType(),mat=D.currentMaterial(),gl=D.currentGlazing(),cf=D.currentComfort(),sys=D.currentSystem();
    const title=$('#summaryTitle');if(title)title.textContent=type?.name||'Ваше окно';
    const sub=$('#summarySub');if(sub)sub.textContent=`${state.width} × ${state.height} мм · ${mat?.short||mat?.name||''}`;
    const chips=$('#summaryChips');if(chips)chips.innerHTML=[D.currentScheme()?.name,gl?.name,cf?.id!=='cf_none'?cf?.name:null].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
    const sysbox=$('#summarySystem');if(sysbox)sysbox.innerHTML=sys?`<div><span>Подходящая система</span><strong>${esc(sys.name)}</strong><p>${esc(D.explainRecommendation(sys.id))}</p></div><button type="button" data-jump-system>Изменить</button>`:`<div><span>Подходящая система</span><strong>Подбираем…</strong></div>`;
    const mobileSummary=$('#mobileSummary');if(mobileSummary)mobileSummary.innerHTML=`<div><span>Ваш вариант</span><strong>${esc(type?.name||'')} · ${state.width}×${state.height}</strong></div><div>${esc(sys?.name||'')}</div>`;
  }

  function render(){renderDesktop();renderMobile();renderPreview();}

  function openHelp(topic){const data=HELP[topic];if(!data)return;$('#helpTitle').textContent=data[0];$('#helpText').textContent=data[1];$('#helpDialog').showModal();}
  function openLead(kind){const title=kind==='measure'?'Вызвать замерщика':kind==='call'?'Задать вопрос':'Получить расчёт';$('#leadTitle').textContent=title;$('#leadSummary').value=JSON.stringify(D.snapshot());$('#leadDialog').showModal();}

  document.addEventListener('click',e=>{
    const help=e.target.closest('[data-help]');if(help){openHelp(help.dataset.help);return}
    const lead=e.target.closest('[data-lead]');if(lead){openLead(lead.dataset.lead);return}
    const jump=e.target.closest('[data-jump-system]');if(jump){if(innerWidth<900){mobileStep=3;renderMobile();scrollTo({top:$('#mobileConfigurator').offsetTop-70,behavior:'smooth'})}else{$('#section-systems')?.scrollIntoView({behavior:'smooth',block:'start'})}return}
    const ms=e.target.closest('[data-mobile-step]');if(ms){mobileStep=+ms.dataset.mobileStep;renderMobile();return}
    const nudge=e.target.closest('[data-nudge]');if(nudge){const [field,delta]=nudge.dataset.nudge.split(':');act({type:'SET_DIMENSION',field,value:Number(state[field])+Number(delta)});return}
    const b=e.target.closest('[data-action]');if(!b)return;const val=b.dataset.value;const map={type:'SELECT_TYPE',scheme:'SELECT_SCHEME',material:'SELECT_MATERIAL',thermal:'SELECT_THERMAL',glazing:'SELECT_GLAZING',comfort:'SELECT_COMFORT',system:'SELECT_SYSTEM',extra:'TOGGLE_EXTRA'};if(b.dataset.action==='opening')act({type:'SELECT_OPENING',index:+b.dataset.index,value:val});else act({type:map[b.dataset.action],value:val});
  });

  document.addEventListener('change',e=>{if(e.target.matches('#widthInputDesktop,#widthInputMobile'))act({type:'SET_DIMENSION',field:'width',value:+e.target.value});if(e.target.matches('#heightInputDesktop,#heightInputMobile'))act({type:'SET_DIMENSION',field:'height',value:+e.target.value})});
  $$('#viewTabs button').forEach?.(()=>{});
  document.addEventListener('click',e=>{const v=e.target.closest('[data-view]');if(v){act({type:'SET_VIEW',value:v.dataset.view});$$('[data-view]').forEach(x=>x.classList.toggle('is-active',x.dataset.view===state.view))}});

  $('#mobilePrev')?.addEventListener('click',()=>{mobileStep=Math.max(0,mobileStep-1);renderMobile()});
  $('#mobileNext')?.addEventListener('click',()=>{if(mobileStep===MOBILE_FLOW.length-1)openLead('quote');else{mobileStep++;renderMobile();scrollTo({top:$('#mobileConfigurator').offsetTop-68,behavior:'smooth'})}});
  $('#resetBtn')?.addEventListener('click',()=>{D.reset();persist();mobileStep=0;render()});
  $('#leadForm')?.addEventListener('submit',e=>{e.preventDefault();$('#leadDialog').close();$('#toast').textContent='Заявка сохранена в прототипе';$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200)});

  restore();render();
})();