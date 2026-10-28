(function(root){
  'use strict';
  function validate(value,ids){
    if(!value||typeof value!=='object'||Array.isArray(value)||value.version!==1||!Array.isArray(value.favorites)||value.favorites.length>ids.length)throw Error('收藏备份格式不正确。');
    var seen=new Set();
    value.favorites.forEach(function(id){if(typeof id!=='string'||!ids.includes(id)||seen.has(id))throw Error('收藏编号无效或重复。');seen.add(id);});
    return {version:1,favorites:value.favorites.slice()};
  }
  function merge(current,incoming,ids){current=validate(current,ids);incoming=validate(incoming,ids);return validate({version:1,favorites:Array.from(new Set(current.favorites.concat(incoming.favorites)))},ids);}
  function compose(item){return ['创作一张图片，只按以下文字描述安排画面。','主体：'+item.subject,'场景：'+item.setting,'风格与光线：'+item.look,'构图：'+item.composition,'配色：'+item.palette,'注意：'+item.avoid,'使用说明：这是图片创作方向，没有附带参考图或专属模型参数；准确字幕、标志与排版文字请后期处理。'].join('\n');}
  function filter(items,category,query,favorites,onlyFavorites){var q=String(query||'').normalize('NFKC').toLowerCase().trim();return items.filter(function(item){return(category==='全部'||item.category===category)&&(!onlyFavorites||favorites.includes(item.id))&&(!q||[item.title,item.category,item.summary,item.subject,item.look,item.palette].concat(item.tags).join(' ').normalize('NFKC').toLowerCase().includes(q));});}
  root.IMAGE_CORE={validate:validate,merge:merge,compose:compose,filter:filter};
})(typeof window!=='undefined'?window:globalThis);
