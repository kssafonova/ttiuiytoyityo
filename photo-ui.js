(() => {
  'use strict';
  const TILE={type_single:0,type_double:1,type_balcony_block:2,type_panoramic:3,type_balcony_glazing:4,type_entrance:5,scheme_transom:6,scheme_triple:7,scheme_fixed_active:8,opening_fixed:9,opening_tilt:10,opening_tilt_turn:11,opening_turn:12,opening_psk:13,opening_lift_slide:14,sliding_dark:15};
  const TYPE_PHOTO={ct_single:TILE.type_single,ct_double:TILE.type_double,ct_panoramic:TILE.type_panoramic,ct_balcony_block:TILE.type_balcony_block,ct_balcony_glazing:TILE.type_balcony_glazing,ct_entrance:TILE.type_entrance};
  const SCHEME_PHOTO={sc_single_1:TILE.type_single,sc_single_transom:TILE.scheme_transom,sc_double_fixed_left:TILE.scheme_fixed_active,sc_double_fixed_right:TILE.scheme_fixed_active,sc_double_both_active:TILE.type_double,sc_double_both_fixed:TILE.type_double,sc_pan_fixed:TILE.type_panoramic,sc_pan_2:TILE.scheme_fixed_active,sc_pan_3:TILE.scheme_triple,sc_pan_multi:TILE.type_panoramic,sc_pan_psk:TILE.opening_psk,sc_pan_lift_slide:TILE.opening_lift_slide,sc_bb_window_left:TILE.type_balcony_block,sc_bb_window_right:TILE.type_balcony_block,sc_bb_double_window:TILE.type_balcony_block,sc_bb_fixed_window:TILE.type_balcony_block,sc_bb_active_window:TILE.type_balcony_block,sc_bg_straight_2:TILE.type_balcony_glazing,sc_bg_straight_3:TILE.type_balcony_glazing,sc_bg_straight_4:TILE.type_balcony_glazing,sc_bg_straight_5plus:TILE.type_balcony_glazing,sc_bg_l:TILE.type_balcony_glazing,sc_bg_u:TILE.type_balcony_glazing,sc_en_single:TILE.type_entrance,sc_en_side:TILE.type_entrance,sc_en_double:TILE.type_entrance,sc_en_two_sides:TILE.type_entrance,sc_en_transom:TILE.type_entrance,sc_en_psk:TILE.opening_psk,sc_en_lift_slide:TILE.opening_lift_slide};
  const OPENING_PHOTO={op_fixed:TILE.opening_fixed,op_turn:TILE.opening_turn,op_tilt_turn:TILE.opening_tilt_turn,op_tilt:TILE.opening_tilt,op_psk:TILE.opening_psk,op_lift_slide:TILE.opening_lift_slide};
  const MEASUREMENTS={
    ct_single:{width:'Ширина окна, мм',height:'Высота окна, мм',hint:'Измерьте ширину и высоту оконного проёма. Точный монтажный размер подтвердит замерщик.'},
    ct_double:{width:'Ширина окна, мм',height:'Высота окна, мм',hint:'Укажите общий размер двухстворчатого оконного проёма.'},
    ct_panoramic:{width:'Ширина проёма, мм',height:'Высота проёма, мм',hint:'Для панорамной конструкции нужны общая ширина и высота проёма; размеры отдельных секций зависят от выбранной схемы.'},
    ct_balcony_block:{width:'Общая ширина блока, мм',height:'Макс. высота блока, мм',hint:'Сначала укажите общий проём. После выбора схемы отдельно учитываются оконная и дверная части — их точные размеры подтвердит замерщик.'},
    ct_balcony_glazing:{width:'Общая длина остекления, мм',height:'Высота остекления, мм',hint:'Для лоджии укажите общую длину фронта и высоту. Для Г- и П-образных схем дополнительные стороны уточняются после выбора схемы.'},
    ct_entrance:{width:'Ширина проёма, мм',height:'Высота проёма, мм',hint:'Укажите общий проём входной группы или панорамной двери. Ширина активной двери и боковых секций определяется выбранной схемой.'}
  };
  const tile=(index,cls='')=>`<span class="photo-tile tile-${index} ${cls}" aria-hidden="true"></span>`;

  function enhanceCards(){
    document.querySelectorAll('.visual-card[data-action="type"]').forEach(card=>{const idx=TYPE_PHOTO[card.dataset.value],media=card.querySelector('.visual-media');if(idx==null||!media||media.dataset.photoTile===String(idx))return;media.dataset.photoTile=String(idx);media.innerHTML=tile(idx,'card-photo');});
    document.querySelectorAll('.visual-card[data-action="scheme"]').forEach(card=>{const idx=SCHEME_PHOTO[card.dataset.value],media=card.querySelector('.visual-media');if(idx==null||!media||media.dataset.photoTile===String(idx))return;media.dataset.photoTile=String(idx);media.innerHTML=tile(idx,'card-photo');});
    document.querySelectorAll('.opening-pill').forEach(card=>{const idx=OPENING_PHOTO[card.dataset.value];if(idx==null)return;let thumb=card.querySelector('.opening-thumb');if(!thumb){thumb=document.createElement('span');thumb.setAttribute('aria-hidden','true');card.prepend(thumb);}thumb.className=`opening-thumb photo-tile tile-${idx}`;});
  }

  function enhanceTypeFirstLayout(){
    const L=window.LUMI,editor=document.getElementById('editor');
    if(!L||!L.state||!editor)return;
    const blocks=[...editor.querySelectorAll(':scope > .field-block')];
    const typeBlock=blocks.find(b=>/Тип конструкции/i.test(b.querySelector('h3')?.textContent||''));
    const dimBlock=blocks.find(b=>/^Размеры/i.test((b.querySelector('h3')?.textContent||'').trim()));
    if(typeBlock&&dimBlock){
      if(typeBlock.nextElementSibling!==dimBlock) editor.insertBefore(typeBlock,dimBlock);
      const stepCount=document.getElementById('stepCount');
      if(stepCount?.textContent.trim()==='01 / 03'){
        const title=document.getElementById('stepTitle');
        const subtitle=document.getElementById('stepSubtitle');
        if(title&&title.textContent!=='Тип конструкции и размеры') title.textContent='Тип конструкции и размеры';
        if(subtitle&&subtitle.textContent!=='Сначала выберите конструкцию — затем покажем, какие размеры нужны именно для неё.') subtitle.textContent='Сначала выберите конструкцию — затем покажем, какие размеры нужны именно для неё.';
        const firstNav=document.querySelector('#stepNav button:first-child strong');
        if(firstNav&&firstNav.textContent!=='Тип + размеры') firstNav.textContent='Тип + размеры';
      }
      const cfg=MEASUREMENTS[L.state.type]||MEASUREMENTS.ct_single;
      const labels=dimBlock.querySelectorAll('.dimension-grid > label > span');
      if(labels[0]&&labels[0].textContent!==cfg.width) labels[0].textContent=cfg.width;
      if(labels[1]&&labels[1].textContent!==cfg.height) labels[1].textContent=cfg.height;
      const headNote=dimBlock.querySelector('.field-head p');
      if(headNote&&headNote.textContent!=='Размеры зависят от выбранного типа конструкции.') headNote.textContent='Размеры зависят от выбранного типа конструкции.';
      let hint=dimBlock.querySelector('.measurement-context');
      if(!hint){hint=document.createElement('div');hint.className='measurement-context';dimBlock.appendChild(hint);}
      if(hint.textContent!==cfg.hint) hint.textContent=cfg.hint;
    }
  }

  function previewIndex(){const L=window.LUMI;if(!L||!L.state)return TILE.type_double;return SCHEME_PHOTO[L.state.scheme]??TYPE_PHOTO[L.state.type]??TILE.type_double;}
  function enhancePreview(){const canvas=document.getElementById('windowCanvas'),L=window.LUMI;if(!canvas||!L||!L.state||L.state.view==='scheme')return;const idx=previewIndex(),key=`${idx}:${L.state.view}:${L.state.width}x${L.state.height}`;if(canvas.dataset.photoPreview===key&&canvas.querySelector('.photo-preview'))return;canvas.dataset.photoPreview=key;canvas.innerHTML=`<div class="photo-preview">${tile(idx,'preview-photo')}<span class="photo-size">${L.state.width} × ${L.state.height} мм</span></div>`;}
  let queued=false;function enhance(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhanceCards();enhanceTypeFirstLayout();enhancePreview();});}
  new MutationObserver(enhance).observe(document.body,{subtree:true,childList:true});
  document.addEventListener('click',enhance,true);document.addEventListener('change',enhance,true);window.addEventListener('load',enhance);enhance();
})();