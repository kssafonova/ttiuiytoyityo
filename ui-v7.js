(()=>{
  const PREVIEWS={
    ct_window:'assets/previews/ordinary_window_preview.svg',
    ct_panoramic:'assets/previews/panoramic_window_preview.svg',
    ct_balcony_block:'assets/previews/balcony_block_preview.svg',
    ct_panoramic_door:'assets/previews/hs_portal_preview.svg'
  };
  function decorate(){
    document.querySelectorAll('.visual-card[data-action="type"]').forEach(card=>{
      const src=PREVIEWS[card.dataset.value];
      const media=card.querySelector('.visual-media');
      if(!src||!media||media.dataset.assetPreview===src)return;
      media.dataset.assetPreview=src;
      media.classList.add('asset-preview');
      media.innerHTML=`<img src="${src}" alt="" loading="eager">`;
    });
  }
  function init(){
    decorate();
    const editor=document.getElementById('editor');
    if(!editor)return;
    new MutationObserver(decorate).observe(editor,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
