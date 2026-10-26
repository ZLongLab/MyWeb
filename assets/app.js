(function () {
  'use strict';

  var config = window.SITE_DATA || {};

  function textValue(value, fallback) {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  function fillText(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.textContent = value;
    });
  }

  var siteTitle = textValue(config.siteTitle, '有间小站');
  var siteName = textValue(config.name, siteTitle);
  if (siteName === '你的名字') siteName = siteTitle;
  fillText('[data-site-name]', siteName);
  var siteRole = textValue(config.role, '');
  fillText('[data-site-role]', siteRole);
  document.querySelectorAll('[data-site-role]').forEach(function (element) { element.hidden = !siteRole; });
  fillText('[data-site-title]', siteTitle);
  fillText('.mini-brand', siteTitle);
  document.title = document.title.replace('有间小站', siteTitle);
  fillText('[data-site-bio]', textValue(config.bio, '一个用来安放作品、想法和日常探索的小站。'));
  // Keep configured prose as text; only the matching phrase gets a visual highlight.
  document.querySelectorAll('.home-bio[data-site-bio]').forEach(function (element) {
    var bio = element.textContent;
    var phrases = ['把想法做出来的过程'];
    var matches = phrases.map(function (phrase) { return { phrase: phrase, start: bio.indexOf(phrase) }; }).filter(function (match) { return match.start !== -1; }).sort(function (a, b) { return a.start - b.start; });
    if (!matches.length) return;
    var nodes = [];
    var cursor = 0;
    matches.forEach(function (match) {
      nodes.push(document.createTextNode(bio.slice(cursor, match.start)));
      var highlight = document.createElement('span');
      highlight.className = 'bio-highlight';
      highlight.textContent = match.phrase;
      nodes.push(highlight);
      cursor = match.start + match.phrase.length;
    });
    nodes.push(document.createTextNode(bio.slice(cursor)));
    element.replaceChildren.apply(element, nodes);
  });
  fillText('[data-year]', String(new Date().getFullYear()));


  var menuButton = document.querySelector('[data-menu-toggle]');
  var navigation = document.getElementById('site-nav');

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '打开导航菜单');
    navigation.classList.remove('is-open');
  }

  if (menuButton && navigation) {
    closeMenu();
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(expanded));
      menuButton.setAttribute('aria-label', expanded ? '关闭导航菜单' : '打开导航菜单');
      navigation.classList.toggle('is-open', expanded);
    });

    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });

    var desktop = window.matchMedia('(min-width: 640px)');
    document.addEventListener('click', function (event) {
      if (desktop.matches || menuButton.getAttribute('aria-expanded') !== 'true') return;
      if (navigation.contains(event.target) || menuButton.contains(event.target)) return;
      closeMenu();
    });

    if (desktop.addEventListener) {
      desktop.addEventListener('change', function (event) {
        if (event.matches) closeMenu();
      });
    } else if (desktop.addListener) {
      desktop.addListener(function (event) {
        if (event.matches) closeMenu();
      });
    }
  }

  var dialogTriggers = new WeakMap();

  function isVisible(element) {
    return element && element.isConnected && typeof element.focus === 'function' &&
      element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== 'hidden';
  }

  function openDialog(id, trigger) {
    var dialog = document.getElementById(id);
    if (!dialog || dialog.tagName !== 'DIALOG' || dialog.open || typeof dialog.showModal !== 'function') return;
    dialogTriggers.set(dialog, trigger || document.activeElement);
    closeMenu();
    dialog.showModal();
  }

  document.querySelectorAll('[data-open-dialog]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      openDialog(button.getAttribute('data-open-dialog'), button);
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('close', function () {
      // 只恢复由 openDialog 打开的公共对话框，保留其他模块的关闭流程。
      if (!dialogTriggers.has(dialog)) return;
      var trigger = dialogTriggers.get(dialog);
      dialogTriggers.delete(dialog);
      if (isVisible(trigger)) trigger.focus();
      else if (isVisible(menuButton)) menuButton.focus();
    });

    dialog.querySelectorAll('[data-close-dialog]').forEach(function (button) {
      button.addEventListener('click', function () {
        dialog.close();
      });
    });

    // 背景点击可关闭；对话框内部的留白点击保持打开。
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var bounds = dialog.getBoundingClientRect();
      var outside = event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) dialog.close();
    });
  });

  var links = (Array.isArray(config.links) ? config.links : []).filter(function (item) {
    if (!item || typeof item.url !== 'string' || !textValue(item.label, '')) return false;
    try {
      var url = new URL(item.url);
      return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
    } catch (error) { return false; }
  });
  var hasSocialContact = links.some(function (item) {
    return item.contact === true && (!Array.isArray(item.locations) || item.locations.indexOf('contact') !== -1);
  });
  var email = textValue(config.email, '');
  var hasEmail = /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email);
  fillText('[data-contact-description]', hasEmail
    ? '欢迎通过邮件联系我，交流作品、分享想法，或只是打个招呼。'
    : hasSocialContact ? '项目相关的问题，欢迎前往我的 GitHub 账号，在对应公开仓库已开放的问题区（Issues）交流。'
    : '联系方式还在准备中，期待以后在这里交流。');
  document.querySelectorAll('[data-contact-link]').forEach(function (link) {
    link.setAttribute('href', 'about.html#contact');
    link.removeAttribute('aria-haspopup');
  });
  document.querySelectorAll('[data-email-link]').forEach(function (link) {
    link.hidden = !hasEmail;
    if (hasEmail) link.setAttribute('href', 'mailto:' + email);
  });
  document.querySelectorAll('[data-contact-pending]').forEach(function (element) {
    element.hidden = hasEmail || hasSocialContact;
  });

  // 社交地址可选；空配置时不生成任何链接。
  document.querySelectorAll('[data-social-links]').forEach(function (container) {
    var scope = container.getAttribute('data-social-scope') || 'footer';
    links.forEach(function (item) {
      if (Array.isArray(item.locations) && item.locations.indexOf(scope) === -1) return;
      var link = document.createElement('a');
      link.href = new URL(item.url).href;
      link.textContent = item.label.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', item.label.trim() + '（新标签页打开）');
      var arrow = document.createElement('span');
      arrow.className = 'external-link-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.appendChild(arrow);
      container.appendChild(link);
    });
  });
})();
