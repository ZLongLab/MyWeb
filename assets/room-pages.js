(function () {
  'use strict';
  var house = window.SITE_HOUSE || {};
  var life = window.SITE_LIFE || {};
  var desk = window.SITE_WORKBENCH || {};
  var projects = window.SITE_PROJECTS || [];
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function a(text, href) { var n = el('a', '', text); n.href = href; return n; }
  function empty(target, text) { if (target) target.append(el(/^(UL|OL)$/.test(target.tagName) ? 'li' : 'p', 'room-empty', text)); }
  function renderLife(target, entries, message) {
    if (!target) return;
    if (!Array.isArray(entries) || !entries.length) { empty(target, message); return; }
    entries.forEach(function (item) {
      var row = el('article', 'life-item'); row.append(el('h3', '', item.title || '未命名'));
      if (item.creator) row.append(el('p', 'room-meta', item.creator));
      if (item.note) row.append(el('p', '', item.note));
      if (typeof item.progress === 'number' && item.progress >= 0 && item.progress <= 100) {
        var progress = el('progress'); progress.max = 100; progress.value = item.progress; progress.setAttribute('aria-label', (item.title || '') + ' 进度');
        row.append(progress, el('span', 'room-meta', item.progress + '%'));
      }
      target.append(row);
    });
  }
  var doing = document.getElementById('now-doing');
  if (doing) (desk.focus || []).forEach(function (item) {
    var project = projects.find(function (p) { return p.id === item.projectId; }); if (!project) return;
    var li = el('li'); li.append(el('h3', '', project.title), el('p', '', item.description), a('看看作品 →', 'project.html?id=' + encodeURIComponent(project.id))); doing.append(li);
  });
  renderLife(document.getElementById('now-reading'), life.reading, '还没有公开的在读记录。');
  renderLife(document.getElementById('now-listening'), life.listening, '还没有公开的在听记录。');
  var notDoing = document.getElementById('now-not-doing');
  if (notDoing) (house.notDoing || []).forEach(function (text) { notDoing.append(el('li', '', text)); });
  var software = document.getElementById('uses-software');
  if (software) ((house.tools || {}).software || []).forEach(function (item) {
    var li = el('li'); li.append(el('h3', '', item.title), el('p', '', item.reason), el('p', 'room-meta', '依据：' + item.source)); software.append(li);
  });
  var hardware = document.getElementById('uses-hardware');
  if (hardware) {
    var devices = (house.tools || {}).hardware || [];
    if (!devices.length) empty(hardware, '设备型号和外设尚未记录。这里等真实内容，不填推荐清单。');
    devices.forEach(function (item) { var li = el('li'); li.append(el('h3', '', item.title), el('p', '', item.reason)); hardware.append(li); });
  }
  var defaults = document.getElementById('uses-defaults');
  if (defaults) ((house.tools || {}).defaults || []).forEach(function (item) {
    var row = el('div'); row.append(el('dt', '', item.title), el('dd', '', item.value || '尚未记录')); defaults.append(row);
  });
  ['reading', 'listening', 'watching'].forEach(function (key) { renderLife(document.getElementById('life-' + key), life[key], '这个位置先留着，等一条真实记录。'); });
  var photos = document.getElementById('life-photos');
  if (photos) {
    var entries = Array.isArray(life.photos) ? life.photos : [];
    if (!entries.length) empty(photos, '相册还没有公开照片。以后把愿意留下的日常放在这里。');
    entries.forEach(function (item) {
      if (typeof item.src !== 'string' || !/^assets\/images\/[\w/.-]+\.(png|jpe?g|webp|avif)$/i.test(item.src) || item.src.indexOf('..') !== -1) return;
      var figure = el('figure'); var link = a('', item.src); link.dataset.imagePreview = ''; link.dataset.imageCaption = item.caption || '生活照片';
      var img = el('img'); img.src = item.src; img.alt = item.caption || '生活照片'; img.loading = 'lazy'; if (item.width > 0) img.width = item.width; if (item.height > 0) img.height = item.height;
      link.append(img); figure.append(link, el('figcaption', '', item.caption || '生活照片')); photos.append(figure);
    });
  }
  function resourceList(target, items, missing) {
    if (!target) return; if (!items || !items.length) { empty(target, missing); return; }
    items.forEach(function (item) {
      var url; try { url = new URL(item.url); } catch (e) { return; }
      if (url.protocol !== 'https:' || url.username || url.password) return;
      var li = el('li'); var link = a(item.title + ' ↗', url.href); link.target = '_blank'; link.rel = 'noopener noreferrer';
      li.append(el('h3')); li.firstChild.append(link); li.append(el('p', '', item.reason));
      if (item.nowUrl && /^https:\/\//.test(item.nowUrl)) { var now = a('对方近况 ↗', item.nowUrl); now.target = '_blank'; now.rel = 'noopener noreferrer'; li.append(now); }
      target.append(li);
    });
  }
  resourceList(document.getElementById('links-friends'), house.friends, '友链等慢慢认识以后再写。这里不把设计参考当成朋友关系。');
  resourceList(document.getElementById('links-resources'), house.resources, '暂时没有整理的资源。');
  var palette = document.getElementById('colophon-palette');
  if (palette) [
    ['暖纸', '#FAF7F2'], ['松针', '#2B5B46'], ['陶土', '#C85A32'], ['琥珀', '#D99B26'], ['青瓷', '#4A6B7C'], ['夜色', '#1E2420']
  ].forEach(function (entry) {
    var b = el('button', 'palette-swatch'); b.type = 'button'; b.setAttribute('aria-label', '复制' + entry[0] + '色值 ' + entry[1]);
    var color = el('i', 'swatch-color'); color.style.backgroundColor = entry[1]; color.setAttribute('aria-hidden', 'true');
    b.append(color, el('strong', '', entry[0]), el('code', '', entry[1]));
    b.addEventListener('click', async function () {
      var result = document.getElementById('palette-status');
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('clipboard unavailable');
        await navigator.clipboard.writeText(entry[1]); result.textContent = '已复制 ' + entry[0] + ' ' + entry[1];
      } catch (e) { result.textContent = '复制不可用，请手动复制：' + entry[1]; }
    }); palette.append(b);
  });
  var changelog = document.getElementById('colophon-changelog');
  if (changelog) (desk.updates || []).forEach(function (item) {
    var row = el('article', 'room-changelog-entry'); var time = el('time', 'room-meta', item.date + ' / v' + item.version); time.dateTime = item.date;
    var ul = el('ul'); (item.changes || []).forEach(function (text) { ul.append(el('li', '', text)); });
    row.append(time, el('h3', '', item.title), ul); changelog.append(row);
  });
  document.querySelectorAll('[data-room-updated]').forEach(function (node) { node.textContent = desk.updated || house.updated; node.setAttribute('datetime', desk.updated || house.updated); });
})();
