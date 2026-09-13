(() => {
  const D=window.LUMI, state=D.state;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const sprite=id=>`<svg viewBox="0 0 160 110" aria-hidden="true"><use href="assets/sprite.svg#${id}"></use></svg>`;
  const optionCard=(item,selected,attr,cat,compact=false)=>`<button class="option-card ${compact?'compact':''} ${selected?'is-selected':''}" type="button" ${attr}><span class="check">✓</span>${sprite(`${cat}__${item.id}`)}<strong>${item.name}</strong><small>${item.desc||item.short||''}</small></button>`;

  function renderRail(){
    $('#railSteps').innerHTML=stepMeta.map((s,i)=>`<div class="rail-step ${i===state.step?'is-active':''} ${i<state.step?'is-done':''}" data-step="${i}"><i>${i<state.step?'✓':s.n}</i><span>${s.title}</span></div>`).join('');
    $$('.rail-step').forEach(el=>el.onclick=()=>{state.step=Number(el.dataset.step);render()});
  }
  const renderType=()=>`<div class="option-grid">${types.map(x=>optionCard(x,state.type===x.id,`data-select-type="${x.id}"`,'type')).join('')}</div><div class="info-line">ⓘ Панорамное — формат конструкции, а не материал. Материал и способ открывания выбираются дальше.</div>`;
  const renderScheme=()=>`<div class="option-grid">${(schemes[state.type]||[]).map(x=>optionCard(x,state.scheme===x.id,`data-select-scheme="${x.id}"`,'scheme')).join('')}</div>`;

  function renderOpening(){
    return `<div class="sash-config">${state.sectionOpenings.map((sec,i)=>`<div class="sash-row"><div><strong>${sec.label}</strong><small style="display:block;color:var(--muted);margin-top:3px">${sec.role==='door'?'Дверная створка':sec.role==='transom'?'Фрамуга':'Секция'}</small></div><div class="pill-group">${D.allowedOpeningsForSection(sec).map(id=>D.lookup(openingOptions,id)).map(op=>`<button class="pill ${sec.opening===op.id?'is-selected':''}" data-opening-index="${i}" data-opening="${op.id}">${op.name}</button>`).join('')}</div></div>`).join('')}</div><div class="info-line">ⓘ Открывание задаётся каждой секции отдельно. Несовместимые механизмы скрыты.</div>`;
  }
  function renderMaterial(){
    const mode=D.supportsColdAndWarm()?`<div class="mode-toggle"><button class="${state.thermalMode==='mode_warm'?'is-active':''}" data-thermal="mode_warm">Тёплое остекление</button><button class="${state.thermalMode==='mode_cold'?'is-active':''}" data-thermal="mode_cold">Холодное остекление</button></div>`:'';
    return `${mode}<div class="option-grid two">${D.allowedMaterials().map(x=>optionCard(x,state.material===x.id,`data-select-material="${x.id}"`,'material')).join('')}</div>${state.material==='mat_aluminum'&&state.thermalMode==='mode_cold'?'<div class="info-line">❄ Холодное остекление — для лоджий, перегородок и зон без требований к теплоизоляции.</div>':''}`;
  }
  const renderGlazing=()=>`<div class="option-grid ${D.allowedGlazing().length===2?'two':''}">${D.allowedGlazing().map(x=>optionCard(x,state.glazing===x.id,`data-select-glazing="${x.id}"`,'glazing')).join('')}</div><div class="info-line">ⓘ Камеры стеклопакета и камеры профиля — разные характеристики. Например, GRAZIO имеет 5 камер профиля, но стеклопакет может быть 1- или 2-камерным.</div>`;
  const renderComfort=()=>`<div class="comfort-grid">${D.allowedComfort().map(x=>optionCard(x,state.comfort===x.id,`data-select-comfort="${x.id}"`,'comfort',true)).join('')}</div><div class="info-line">ⓘ Шаг необязательный. Один пакет объединяет совместимые свойства — например «Тишина + безопасность».</div>`;

  function renderSystems(){
    const list=D.compatibleSystems(), rec=D.recommendedSystemId(list); if(!list.some(x=>x.id===state.system)) state.system=rec;
    return `<div class="system-results">${list.map(s=>`<div class="system-card ${s.id===rec?'is-recommended':''}">${sprite(`system__${s.id}`)}<div><span class="badge">${s.id===rec?'Рекомендуем':s.tag}</span><h4>${s.name}</h4><p>${s.desc}</p><div class="system-meta"><span class="meta-chip">${s.depth}</span><span class="meta-chip">${s.detail}</span><span class="meta-chip">Заполнение ${s.filling}</span><span class="meta-chip">${s.thermal}</span></div></div><div><button class="details-btn" data-system="${s.id}">${state.system===s.id?'Выбрано ✓':'Выбрать'}</button></div></div>`).join('')}</div><div class="info-line">ⓘ Точные размеры, вес створок и формула стеклопакета подтверждаются после инженерного расчёта.</div>`;
  }
  const renderExtras=()=>`<div class="extra-grid">${D.allowedExtras().map(x=>`<button type="button" class="extra-card ${state.extras.has(x.id)?'is-selected':''}" data-extra="${x.id}">${sprite(`extra__${x.id}`)}<div><strong>${x.name}</strong><small>${x.price} · ${x.desc}</small></div><span class="switch"></span></button>`).join('')}</div><div class="info-line">ⓘ Бесплатный замер, срок изготовления и гарантия показаны отдельно и не являются опциями.</div>`;

  function renderStepContent(){
    const step=stepMeta[state.step]; $('#activeStepTitle').textContent=step.title; $('#activeStepSubtitle').textContent=step.subtitle;
    const views={type:renderType,scheme:renderScheme,opening:renderOpening,material:renderMaterial,glazing:renderGlazing,comfort:renderComfort,systems:renderSystems,extras:renderExtras};
    $('#stepContent').innerHTML=views[step.id]();
  }

  function previewSVG(){
    const secs=state.sectionOpenings, n=Math.max(1,secs.length), isDoor=state.type==='ct_entrance'||state.type==='ct_balcony_block';
    const frame=state.material==='mat_pvc'?'#f7f8f8':'#4f5963', inner=state.material==='mat_pvc'?'#dce4e8':'#222d36';
    const width=state.width,height=state.height,x0=115,y0=isDoor?52:74,w=360,h=isDoor?285:240,gap=8,sectionW=(w-gap*(n-1))/n,viewOutside=state.view==='outside';
    let panels='';
    secs.forEach((s,i)=>{const x=x0+i*(sectionW+gap),o=s.opening,tint=['cf_solar','cf_yearround'].includes(state.comfort)?'#b7c7d4':state.comfort==='cf_crystal'?'#eafaff':'#cfe8f4';panels+=`<rect x="${x}" y="${y0}" width="${sectionW}" height="${h}" rx="2" fill="${frame}"/><rect x="${x+9}" y="${y0+9}" width="${sectionW-18}" height="${h-18}" fill="${tint}" opacity=".76" stroke="${inner}" stroke-width="2"/>`;if(o==='op_turn')panels+=`<path d="M${x+10} ${y0+10} L${x+sectionW-18} ${y0+h/2} L${x+10} ${y0+h-10}" fill="none" stroke="#1e6fe8" stroke-width="3"/>`;if(o==='op_tilt_turn')panels+=`<path d="M${x+10} ${y0+10} L${x+sectionW-18} ${y0+h/2} L${x+10} ${y0+h-10} M${x+10} ${y0+10} L${x+sectionW/2} ${y0+34} L${x+sectionW-10} ${y0+10}" fill="none" stroke="#1e6fe8" stroke-width="3"/>`;if(o==='op_tilt')panels+=`<path d="M${x+10} ${y0+10} L${x+sectionW/2} ${y0+38} L${x+sectionW-10} ${y0+10}" fill="none" stroke="#1e6fe8" stroke-width="3"/>`;if(['op_psk','op_lift_slide'].includes(o))panels+=`<path d="M${x+20} ${y0+h/2} H${x+sectionW-25} M${x+sectionW-36} ${y0+h/2-9} L${x+sectionW-25} ${y0+h/2} L${x+sectionW-36} ${y0+h/2+9}" fill="none" stroke="#1e6fe8" stroke-width="4"/>`;if(o!=='op_fixed')panels+=`<rect x="${x+sectionW-16}" y="${y0+h/2-15}" width="4" height="30" rx="2" fill="#667382"/>`;});
    const room=state.view==='scheme'?`<rect width="590" height="370" fill="#fbfcfe"/><g transform="translate(35 10) scale(.9)">${panels}</g>`:`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${viewOutside?'#d6e7f1':'#c7e9fb'}"/><stop offset="1" stop-color="#eff7f2"/></linearGradient></defs><rect width="590" height="370" fill="#f1eee9"/><rect x="68" y="30" width="454" height="310" rx="8" fill="#fff"/><rect x="${x0+9}" y="${y0+9}" width="342" height="${h-18}" fill="url(#sky)"/><path d="M124 247 C200 215 238 245 298 215 C365 181 420 224 471 205 L471 314 L124 314 Z" fill="#86a979" opacity=".74"/><g fill="#a8b9c8" opacity=".75"><rect x="168" y="166" width="22" height="70"/><rect x="201" y="132" width="28" height="104"/><rect x="245" y="176" width="18" height="60"/><rect x="353" y="147" width="32" height="89"/><rect x="397" y="174" width="18" height="62"/></g>${panels}<rect x="86" y="${y0+h+4}" width="420" height="14" rx="4" fill="#f7f7f5"/><rect x="0" y="337" width="590" height="33" fill="#ddd8d0"/><circle cx="44" cy="284" r="42" fill="#819a72" opacity=".23"/>`;
    return `<svg viewBox="0 0 590 370" role="img" aria-label="Предпросмотр окна">${room}<g fill="#14213a" font-family="Inter,Arial"><text x="22" y="25" font-size="12" font-weight="700">${D.currentSystem()?.name||'Подбор системы'}</text><text x="22" y="42" font-size="10" fill="#66738a">${width} × ${height} мм · ${D.currentMaterial()?.short||''}</text></g><g stroke="#2b7cff" fill="none" stroke-width="1.5"><path d="M${x0} ${y0-18} H${x0+w}"/><path d="M${x0-18} ${y0} V${y0+h}"/></g><g fill="#2b7cff" font-size="10" font-family="Inter,Arial"><text x="${x0+w/2-24}" y="${y0-23}">${width} мм</text><text transform="translate(${x0-24},${y0+h/2+20}) rotate(-90)">${height} мм</text></g></svg>`;
  }

  function renderPreview(){
    $('#livePreview').innerHTML=previewSVG();
    const rows=[['Тип',D.currentType()?.name],['Схема',D.currentScheme()?.name],['Размеры',`${state.width} × ${state.height} мм`],['Материал',D.currentMaterial()?.short],['Стеклопакет',D.currentGlazing()?.name],['Комфорт',D.currentComfort()?.name],['Система',D.currentSystem()?.name||'Автоподбор']];
    $('#summaryList').innerHTML=rows.map(([a,b])=>`<dt>${a}</dt><dd>${b||'—'}</dd>`).join('');
    const rec=D.lookup(systems,D.recommendedSystemId()); $('#recommendation').innerHTML=rec?`<strong>Почему рекомендуем ${rec.name}</strong>${rec.desc}`:'<strong>Нужен инженерный расчёт</strong>Оставьте заявку — проверим размеры.';
    $('#mobileStickyText').textContent=`${D.currentType()?.name||''} · ${D.currentMaterial()?.short||''}`;
  }

  function bind(){
    $$('[data-select-type]').forEach(el=>el.onclick=()=>{state.type=el.dataset.selectType;state.scheme=schemes[state.type][0].id;D.cloneSectionsFromScheme();D.normalizeState();state.step=1;render()});
    $$('[data-select-scheme]').forEach(el=>el.onclick=()=>{state.scheme=el.dataset.selectScheme;D.cloneSectionsFromScheme();D.normalizeState();state.step=2;render()});
    $$('[data-opening-index]').forEach(el=>el.onclick=()=>{state.sectionOpenings[+el.dataset.openingIndex].opening=el.dataset.opening;D.normalizeState();render()});
    $$('[data-select-material]').forEach(el=>el.onclick=()=>{state.material=el.dataset.selectMaterial;D.normalizeState();state.step=4;render()});
    $$('[data-thermal]').forEach(el=>el.onclick=()=>{state.thermalMode=el.dataset.thermal;D.normalizeState();render()});
    $$('[data-select-glazing]').forEach(el=>el.onclick=()=>{state.glazing=el.dataset.selectGlazing;D.normalizeState();state.step=5;render()});
    $$('[data-select-comfort]').forEach(el=>el.onclick=()=>{state.comfort=el.dataset.selectComfort;D.normalizeState();state.step=6;render()});
    $$('[data-system]').forEach(el=>el.onclick=()=>{state.system=el.dataset.system;render()});
    $$('[data-extra]').forEach(el=>el.onclick=()=>{const id=el.dataset.extra;state.extras.has(id)?state.extras.delete(id):state.extras.add(id);render()});
  }

  function render(){
    D.normalizeState(); renderRail(); renderStepContent(); renderPreview(); bind();
    $('#progressText').textContent=`${Math.min(state.step+1,7)} из 7`; $('#progressFill').style.width=`${(state.step+1)/stepMeta.length*100}%`;
    $('#prevBtn').disabled=state.step===0; $('#prevBtn').style.opacity=state.step===0?'.4':'1'; $('#nextBtn').textContent=state.step===stepMeta.length-1?'Готово →':'Далее →';
  }

  function scrollConfig(){if(innerWidth<920)$('.config-panel').scrollIntoView({behavior:'smooth',block:'start'})}
  $('#prevBtn').onclick=()=>{if(state.step>0){state.step--;render();scrollConfig()}}; $('#nextBtn').onclick=()=>{if(state.step<stepMeta.length-1){state.step++;render();scrollConfig()}else openLead('quote')};
  $('#resetBtn').onclick=()=>{D.reset();render()}; $('#widthInput').oninput=e=>{state.width=Math.max(300,+e.target.value||1400);D.normalizeState();renderPreview()}; $('#heightInput').oninput=e=>{state.height=Math.max(300,+e.target.value||1500);D.normalizeState();renderPreview()};
  $$('.segmented button').forEach(b=>b.onclick=()=>{$$('.segmented button').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');state.view=b.dataset.view;renderPreview()}); $('#fullscreenPreview').onclick=()=>$('#livePreview').requestFullscreen?.(); $('#editCurrent').onclick=()=>{state.step=0;render();scrollConfig()};

  const dialog=$('#leadDialog'); function openLead(kind){const c={quote:['Получить расчёт','Оставьте контакты — специалист проверит конфигурацию и рассчитает стоимость.'],measure:['Бесплатный замер','Оставьте телефон — согласуем удобное время замера.'],callback:['Заказать звонок','Оставьте телефон — перезвоним в рабочее время.'],consultation:['Получить консультацию','Поможем выбрать конструкцию, материал и систему.']}[kind]||['Связаться с нами','Оставьте контакты.'];$('#leadTitle').textContent=c[0];$('#leadText').textContent=c[1];dialog.showModal()}
  $$('[data-open-lead]').forEach(b=>b.onclick=()=>openLead(b.dataset.openLead)); $('.lead-form').addEventListener('submit',e=>{e.preventDefault();dialog.close();const t=$('#toast');t.textContent='Спасибо! В прототипе заявка не отправляется.';t.classList.add('is-visible');setTimeout(()=>t.classList.remove('is-visible'),2800)});
  $('#systemCatalog').innerHTML=systems.map(s=>`<article class="catalog-card">${sprite(`system__${s.id}`)}<strong>${s.name}</strong><span>${s.tag} · ${s.depth}<br>${s.detail}</span></article>`).join('');
  D.cloneSectionsFromScheme(); render();
})();
