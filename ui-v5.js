(() => {
  'use strict';

  const D = window.LUMI;
  const DATA = window.LUMI_DATA;
  const state = D.state;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const STORAGE_KEY = 'lumi-configurator:v5';
  let step = 0;

  const FLOW = [
    {title:'Размеры и тип конструкции', short:'Размеры + тип', subtitle:'Укажите примерный проём и выберите, что именно устанавливаем.'},
    {title:'Схема и открывание', short:'Схема + открывание', subtitle:'Выберите расположение секций и способ открывания каждой активной створки.'},
    {title:'Материал и стекло', short:'Материал + стекло', subtitle:'Материал, стеклопакет и один необязательный приоритет комфорта.'}
  ];

  const HELP = {
    dimensions:['Размеры','Можно указать примерные размеры: они сразу меняют пропорции превью. Финальные допустимые габариты, статика, вес створок и фурнитура подтверждаются после замера.'],
    type:['Тип конструкции','Это формат изделия: обычное окно, панорамное, балконный блок, остекление лоджии или входная группа. После выбора мы автоматически оставим только подходящие схемы.'],
    scheme:['Схема окна / секций','Схема определяет количество и расположение секций. Это не то же самое, что открывание: одна и та же схема может иметь разные активные и глухие створки.'],
    opening:['Открывание','Открывание задаётся конкретной секции. Глухая не открывается, поворотно-откидная открывается и проветривает. PSK и подъёмно-сдвижное доступны только для соответствующих порталов.'],
    material:['ПВХ или алюминий','ПВХ — универсальное тёплое решение. Алюминий визуально тоньше и лучше подходит для крупных современных конструкций. Холодный алюминий используется там, где теплоизоляция не требуется.'],
    glazing:['Стеклопакет','Однокамерный стеклопакет — 2 стекла и 1 камера. Двухкамерный — 3 стекла и 2 камеры. Камеры стеклопакета не связаны с количеством камер внутри профиля.'],
    comfort:['Комфорт','Необязательный выбор. Вы задаёте задачу — теплее, тише, защита от солнца, безопасность и т. п. Точную формулу стекла подбирает специалист под выбранную систему.'],
    system:['Итоговое решение','Система REHAU / ALUMARK подбирается после ваших пользовательских решений. Мы показываем только совместимые варианты и не заставляем заранее разбираться в профилях.'],
    extras:['Дополнительные опции','Здесь оставлены только две пользовательские опции: подоконник и москитная сетка. Если опция несовместима с конструкцией, она не предлагается.']
  };

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sprite = id => `<svg viewBox="0 0 160 110" aria-hidden="true"><use href="assets/sprite.svg#${id}"></use></svg>`;
  const roleLabel = r => ({window:'Оконная секция',transom:'Фрамуга',balcony_door:'Балконная дверь',entrance_door:'Входная дверь',portal:'Активная створка',portal_fixed:'Глухая секция'})[r] || 'Секция';

  function persist(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(D.snapshot())); }catch(_){} }
  function restore(){
    try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) D.hydrate(JSON.parse(raw)); }catch(_){}
    D.normalizeState();
  }
  function act(action){ D.dispatch(action); persist(); render(); }

  function info(topic){
    const [title,text] = HELP[topic];
    return `<button type="button" class="info-dot" data-help="${topic}" data-tip="${esc(text)}" aria-label="${esc(title)}">i</button>`;
  }
  function block(title, subtitle, body, topic){
    return `<section class="field-block"><div class="field-head"><div><h3>${esc(title)} ${topic?info(topic):''}</h3>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></div>${body}</section>`;
  }
  function visualCard(item, selected, action, category){
    return `<button class="visual-card ${selected?'is-selected':''}" type="button" data-action="${action}" data-value="${esc(item.id)}"><span class="select-mark">✓</span><div class="visual-media">${sprite(`${category}__${item.id}`)}</div><strong>${esc(item.name)}</strong><small>${esc(item.desc||item.short||'')}</small></button>`;
  }
  function compactCard(item, selected, action, category){
    return `<button class="compact-card ${selected?'is-selected':''}" type="button" data-action="${action}" data-value="${esc(item.id)}">${sprite(`${category}__${item.id}`)}<span><strong>${esc(item.name)}</strong><small>${esc(item.short||item.desc||'')}</small></span><b>✓</b></button>`;
  }

  function dimensionsContent(){
    return `<div class="dimension-grid"><label><span>Ширина, мм</span><div class="number-box"><button type="button" data-nudge="width:-10">−</button><input id="widthInput" type="number" min="1" step="10" inputmode="numeric" value="${state.width}"><button type="button" data-nudge="width:10">+</button></div></label><label><span>Высота, мм</span><div class="number-box"><button type="button" data-nudge="height:-10">−</button><input id="heightInput" type="number" min="1" step="10" inputmode="numeric" value="${state.height}"><button type="button" data-nudge="height:10">+</button></div></label><button class="measure-cta" type="button" data-lead="measure"><span class="measure-icon">⌁</span><span>Не знаете размеры?<strong>Бесплатный замер →</strong></span></button></div>`;
  }

  function typeContent(){
    return `<div class="type-grid">${DATA.types.map(x=>visualCard(x,state.type===x.id,'type','type')).join('')}</div>`;
  }

  function schemeContent(){
    return `<div class="scheme-grid">${D.schemesForType().map(x=>visualCard(x,state.scheme===x.id,'scheme','scheme')).join('')}</div>`;
  }

  function openingContent(){
    return `<div class="opening-list">${state.sectionOpenings.map((sec,i)=>{
      const opts=D.allowedOpeningsForSection(sec).map(id=>DATA.openingOptions.find(o=>o.id===id)).filter(Boolean);
      return `<div class="opening-row"><div class="opening-meta"><strong>${esc(sec.label)}</strong><span>${esc(roleLabel(sec.role))}</span></div><div class="opening-options">${opts.map(o=>`<button type="button" class="opening-pill ${sec.opening===o.id?'is-selected':''}" data-action="opening" data-index="${i}" data-value="${o.id}"><strong>${esc(o.name)}</strong><small>${esc(o.short||'')}</small></button>`).join('')}${opts.length===1?'<em>Определено схемой</em>':''}</div></div>`;
    }).join('')}</div>`;
  }

  function materialContent(){
    const materials=D.allowedMaterials();
    let thermal='';
    if(state.material==='mat_aluminum'){
      const modes=D.availableThermalModes();
      thermal = modes.length>1
        ? `<div class="thermal-row"><span>Тип алюминиевого остекления</span><div class="thermal-switch"><button class="${state.thermalMode==='mode_warm'?'is-active':''}" type="button" data-action="thermal" data-value="mode_warm">Тёплое</button><button class="${state.thermalMode==='mode_cold'?'is-active':''}" type="button" data-action="thermal" data-value="mode_cold">Холодное</button></div></div>`
        : `<div class="auto-strip">${modes[0]==='mode_warm'?'Тёплое':'Холодное'} остекление определено выбранной конструкцией.</div>`;
    }
    return `<div class="material-grid">${materials.map(x=>compactCard(x,state.material===x.id,'material','material')).join('')}</div>${thermal}`;
  }

  function glazingContent(){
    const list=D.allowedGlazing();
    return `<div class="glass-grid">${list.map(x=>compactCard(x,state.glazing===x.id,'glazing','glazing')).join('')}</div>`;
  }

  function comfortContent(){
    return `<div class="comfort-grid">${D.allowedComfort().map(x=>`<button type="button" class="comfort-option ${state.comfort===x.id?'is-selected':''}" data-action="comfort" data-value="${x.id}">${sprite(`comfort__${x.id}`)}<span><strong>${esc(x.name==='Без дополнительных свойств'?'Стандарт':x.name)}</strong><small>${esc(x.short||x.desc||'')}</small></span><b>✓</b></button>`).join('')}</div>`;
  }

  function renderStep(){
    const root=$('#editor'); if(!root) return;
    const current=FLOW[step];
    $('#stepTitle').textContent=current.title;
    $('#stepSubtitle').textContent=current.subtitle;
    $('#stepCount').textContent=`0${step+1} / 03`;
    if(step===0){
      root.innerHTML=block('Размеры','Можно указать примерные — точные размеры подтвердит замерщик.',dimensionsContent(),'dimensions')+block('Тип конструкции','Выберите формат изделия. После этого схема и материал будут отфильтрованы автоматически.',typeContent(),'type');
    } else if(step===1){
      root.innerHTML=block('Схема окна / секций',`Доступные варианты для «${D.currentType()?.name||''}».`,schemeContent(),'scheme')+block('Открывание','Настройте каждую активную секцию.',openingContent(),'opening');
    } else {
      root.innerHTML=block('Материал','Бренд и профильную систему подберём автоматически после выбора.',materialContent(),'material')+block('Стеклопакет','Выберите базовую конструкцию стеклопакета.',glazingContent(),'glazing')+block('Комфорт','Необязательно. Можно выбрать только один приоритет.',comfortContent(),'comfort');
    }
    $('#prevBtn').disabled=step===0;
    $('#nextBtn').textContent=step===2?'Готово ✓':`${FLOW[step+1].title} →`;
    $('#nextBtn').classList.toggle('is-final',step===2);
    $('#stepNav').innerHTML=FLOW.map((s,i)=>`<button type="button" class="${i===step?'is-active':''} ${i<step?'is-done':''}" data-go-step="${i}"><span>0${i+1}</span><strong>${esc(s.short)}</strong></button>`).join('');
  }

  function renderOptions(){
    const root=$('#rightExtras'); if(!root) return;
    const allowed=D.allowedExtras();
    const filtered=allowed.filter(x=>/подокон|москит/i.test(x.name||''));
    if(!filtered.length){ root.innerHTML='<div class="empty-options">Для этой конструкции дополнительные опции не требуются.</div>'; return; }
    root.innerHTML=filtered.map(x=>`<button type="button" class="right-extra ${state.extras.has(x.id)?'is-selected':''}" data-action="extra" data-value="${x.id}">${sprite(`extra__${x.id}`)}<span><strong>${esc(x.name)}</strong><small>${esc(x.price||'')}${x.price?' · ':''}${esc(x.desc||'')}</small></span><i></i></button>`).join('');
  }

  function geometry(){
    const scheme=D.currentScheme(), maxW=500, maxH=(state.type==='ct_entrance'||state.type==='ct_balcony_block')?330:300;
    const aspect=Math.max(.45,Math.min(4.2,state.width/state.height));
    let w=Math.min(maxW,maxH*aspect), h=Math.min(maxH,maxW/aspect);
    w=Math.max(220,w); h=Math.max(150,h);
    return {scheme,w,h,x:(620-w)/2,y:(370-h)/2+22};
  }
  function tint(){ if(['cf_solar','cf_yearround'].includes(state.comfort)) return '#b9cedb'; if(state.comfort==='cf_crystal') return '#effcff'; return '#d9eef8'; }
  function glyph(o,x,y,w,h){
    const c='#3384ff';
    if(o==='op_turn') return `<path d="M${x+8} ${y+8} L${x+w-12} ${y+h/2} L${x+8} ${y+h-8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if(o==='op_tilt_turn') return `<path d="M${x+8} ${y+8} L${x+w-12} ${y+h/2} L${x+8} ${y+h-8} M${x+8} ${y+8} L${x+w/2} ${y+26} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if(o==='op_tilt') return `<path d="M${x+8} ${y+8} L${x+w/2} ${y+25} L${x+w-8} ${y+8}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if(['op_psk','op_lift_slide'].includes(o)) return `<path d="M${x+18} ${y+h/2} H${x+w-22} M${x+w-35} ${y+h/2-9} L${x+w-22} ${y+h/2} L${x+w-35} ${y+h/2+9}" fill="none" stroke="${c}" stroke-width="3.5"/>`;
    return '';
  }
  function panel(sec,x,y,w,h,frame){
    const inset=9;
    const handle=sec.opening!=='op_fixed'&&!['op_psk','op_lift_slide'].includes(sec.opening)?`<rect x="${x+w-17}" y="${y+h/2-13}" width="4" height="26" rx="2" fill="#7d8792"/>`:'';
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${frame}"/><rect x="${x+inset}" y="${y+inset}" width="${Math.max(12,w-inset*2)}" height="${Math.max(12,h-inset*2)}" fill="${tint()}" stroke="${state.material==='mat_pvc'?'#d6e0e6':'#28343e'}" stroke-width="2"/>${glyph(sec.opening,x,y,w,h)}${handle}</g>`;
  }
  function renderWindowSvg(){
    const {scheme,w,h,x,y}=geometry(), secs=state.sectionOpenings, frame=state.material==='mat_pvc'?'#f8fafb':'#4f5b65', gap=7;
    let body='';
    if(scheme?.layout==='transom'&&secs.length===2){
      const top=Math.max(44,h*(secs[1].ratio||.22));
      body=panel(secs[1],x,y,w,top,frame)+panel(secs[0],x,y+top+gap,w,h-top-gap,frame);
    } else {
      const total=secs.reduce((a,b)=>a+(b.ratio||1),0); let xx=x;
      secs.forEach(s=>{ const ww=(w-gap*(secs.length-1))*(s.ratio||1)/total; body+=panel(s,xx,y,ww,h,frame); xx+=ww+gap; });
    }
    return `<svg viewBox="0 0 620 390" role="img" aria-label="Предпросмотр конструкции"><defs><linearGradient id="sky5" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c9e8ff"/><stop offset="1" stop-color="#f7fbff"/></linearGradient></defs><rect width="620" height="390" fill="url(#sky5)"/><path d="M0 300 C90 260 135 300 210 266 C280 236 350 280 430 248 C510 218 560 256 620 228 V390 H0Z" fill="#d7e6df"/><g opacity=".4" fill="#8ca6b8"><rect x="58" y="220" width="35" height="110"/><rect x="100" y="190" width="45" height="140"/><rect x="152" y="242" width="34" height="88"/><rect x="430" y="184" width="48" height="146"/><rect x="487" y="222" width="32" height="108"/><rect x="526" y="204" width="43" height="126"/></g><g filter="drop-shadow(0 16px 22px rgba(20,39,55,.16))">${body}</g><text x="310" y="377" text-anchor="middle" font-size="11" fill="#5b7182">${state.width} × ${state.height} мм</text></svg>`;
  }

  function renderSolution(){
    const canvas=$('#windowCanvas'); if(canvas) canvas.innerHTML=renderWindowSvg();
    const type=D.currentType(), scheme=D.currentScheme(), material=D.currentMaterial(), glazing=D.currentGlazing(), comfort=D.currentComfort();
    const ranked=D.rankedSystems();
    const current=D.currentSystem() || ranked[0]?.system;
    const title=$('#solutionTitle'); if(title) title.textContent=type?.name || 'Ваше решение';
    const meta=$('#solutionMeta'); if(meta) meta.textContent=`${state.width} × ${state.height} мм · ${material?.short||material?.name||''}`;
    const chips=$('#solutionChips'); if(chips) chips.innerHTML=[scheme?.name,glazing?.name,comfort?.id!=='cf_none'?comfort?.name:null].filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('');
    const system=$('#solutionSystem');
    if(system){
      if(!current){ system.innerHTML='<div class="no-solution">Нет совместимой системы. Измените параметры слева.</div>'; }
      else {
        const alternatives=ranked.filter(r=>r.system.id!==current.id).slice(0,2);
        system.innerHTML=`<div class="solution-system-main"><div class="solution-profile">${sprite(`system__${current.id}`)}</div><div><span class="solution-label">Подходящая система ${info('system')}</span><h4>${esc(current.name)}</h4><p>${esc(D.explainRecommendation(current.id))}</p><div class="solution-specs"><span>${esc(current.depth)}</span><span>${esc(current.detail)}</span><span>${esc(current.filling)}</span></div></div></div>${alternatives.length?`<details class="solution-alts"><summary>Другие совместимые варианты</summary><div>${alternatives.map(({system:s})=>`<button type="button" data-action="system" data-value="${s.id}">${esc(s.name)}<span>${esc(s.tag)}</span></button>`).join('')}</div></details>`:''}`;
      }
    }
    renderOptions();
  }

  function render(){ renderStep(); renderSolution(); }

  function openHelp(topic){ const data=HELP[topic]; if(!data)return; $('#helpTitle').textContent=data[0]; $('#helpText').textContent=data[1]; $('#helpDialog').showModal(); }
  function openLead(kind){ const title=kind==='measure'?'Вызвать замерщика':kind==='call'?'Заказать звонок':'Получить расчёт'; $('#leadTitle').textContent=title; $('#leadSummary').value=JSON.stringify(D.snapshot()); $('#leadDialog').showModal(); }

  document.addEventListener('click',e=>{
    const help=e.target.closest('[data-help]'); if(help){ openHelp(help.dataset.help); return; }
    const lead=e.target.closest('[data-lead]'); if(lead){ openLead(lead.dataset.lead); return; }
    const go=e.target.closest('[data-go-step]'); if(go){ step=+go.dataset.goStep; render(); return; }
    const nudge=e.target.closest('[data-nudge]'); if(nudge){ const [field,delta]=nudge.dataset.nudge.split(':'); act({type:'SET_DIMENSION',field,value:Number(state[field])+Number(delta)}); return; }
    const view=e.target.closest('[data-view]'); if(view){ act({type:'SET_VIEW',value:view.dataset.view}); $$('[data-view]').forEach(x=>x.classList.toggle('is-active',x.dataset.view===state.view)); return; }
    const b=e.target.closest('[data-action]'); if(!b)return;
    const map={type:'SELECT_TYPE',scheme:'SELECT_SCHEME',material:'SELECT_MATERIAL',thermal:'SELECT_THERMAL',glazing:'SELECT_GLAZING',comfort:'SELECT_COMFORT',system:'SELECT_SYSTEM',extra:'TOGGLE_EXTRA'};
    if(b.dataset.action==='opening') act({type:'SELECT_OPENING',index:+b.dataset.index,value:b.dataset.value});
    else act({type:map[b.dataset.action],value:b.dataset.value});
  });

  document.addEventListener('change',e=>{
    if(e.target.matches('#widthInput')) act({type:'SET_DIMENSION',field:'width',value:+e.target.value});
    if(e.target.matches('#heightInput')) act({type:'SET_DIMENSION',field:'height',value:+e.target.value});
  });

  $('#prevBtn')?.addEventListener('click',()=>{ step=Math.max(0,step-1); render(); window.scrollTo({top:$('#configurator').offsetTop-70,behavior:'smooth'}); });
  $('#nextBtn')?.addEventListener('click',()=>{ if(step<2){ step++; render(); window.scrollTo({top:$('#configurator').offsetTop-70,behavior:'smooth'}); } else { $('#solutionCard')?.scrollIntoView({behavior:'smooth',block:'center'}); } });
  $('#resetBtn')?.addEventListener('click',()=>{ D.reset(); step=0; persist(); render(); });
  $('#leadForm')?.addEventListener('submit',e=>{ e.preventDefault(); $('#leadDialog').close(); $('#toast').textContent='Заявка сохранена в прототипе'; $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'),2200); });

  restore(); render();
})();