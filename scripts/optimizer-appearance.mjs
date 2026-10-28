// Presentation-only adaptation; keep upstream routes, storage and model calls.
import fs from 'node:fs/promises';

export async function optimizerAppearance() {
  const css = await fs.readFile(new URL('./optimizer-appearance.css', import.meta.url), 'utf8');
  const theme = await fs.readFile(new URL('./optimizer-theme.ts', import.meta.url), 'utf8');
  const nav = `<nav id="myweb-tool-nav" aria-label="本站工具导航">
    <a class="myweb-tool-brand" href="../index.html" aria-label="返回有间小站首页"><svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="17" fill="#faf7f0"/><path d="m12 29 20-16 20 16M18 27v24h28V27" fill="none" stroke="#2b5b46" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m28 35 9-3v20l-9-3Z" fill="#c85a32"/></svg><span>有间小站</span></a>
    <span class="myweb-tool-room"><span>工作台</span><i aria-hidden="true">/</i>提示词优化器<span class="myweb-tool-stamp">TOOL 02</span></span>
    <span class="myweb-tool-links"><a class="myweb-studio-link" href="../video-prompts.html">视频灵感室 <span aria-hidden="true">↗</span></a><a href="./deployment-info.html">来源与许可 <span aria-hidden="true">↗</span></a></span>
  </nav>`;
  return {
    nav,
    style: '<style id="myweb-optimizer-appearance">' + css + '</style>',
    templatePaths: [
      'packages/ui/src/components/MainLayout.vue',
      'packages/ui/src/components/app-layout/AppHeaderActions.vue',
      'packages/ui/src/components/basic-mode/BasicSystemWorkspace.vue',
      'packages/ui/src/components/basic-mode/BasicUserWorkspace.vue'
    ],
    patchTemplate(file, pristine) {
      if (file.endsWith('/MainLayout.vue')) {
        const slot = '<slot name="core-nav"></slot>';
        if (!pristine.includes(slot)) throw Error('Upstream navigation changed.');
        return pristine.replace(slot, slot + '<p class="myweb-workspace-guide" aria-label="使用顺序"><span>写下想法</span><i aria-hidden="true">→</i><span>选择模型与模板</span><i aria-hidden="true">→</i><span>优化并对比</span></p>');
      }
      if (file.endsWith('/AppHeaderActions.vue')) {
        const action = `@click="emit('open-model-manager')"`;
        if (!pristine.includes(action)) throw Error('Upstream model action changed.');
        return pristine.replace(action, action + ' class="myweb-model-action"');
      }
      if (!pristine.includes('<OutputDisplay')) throw Error('Upstream test output changed.');
      let patched = pristine.replace('<OutputDisplay', '<OutputDisplay placeholder="运行测试后，在这里查看结果。"');
      if (file.endsWith('/BasicSystemWorkspace.vue')) {
        const placeholder = `:placeholder="t('promptOptimizer.placeholder')"`;
        if (!patched.includes(placeholder)) throw Error('Upstream input placeholder changed.');
        patched = patched.replace(placeholder, 'placeholder="例如：把这段介绍改得更清楚，保留事实，语气自然，控制在 200 字以内。"');
      }
      return patched;
    },
    patchTheme(pristine) {
      const anchor = '// 获取可用主题列表';
      const expression = 'currentThemeConfig.value.themeOverrides || {}';
      const darkClass = "document.documentElement.classList.toggle('dark', Boolean(isDark))";
      for (const marker of [anchor, expression, darkClass]) if (!pristine.includes(marker)) throw Error('Upstream theme structure changed.');
      return pristine.replace(anchor, theme + '\n' + anchor)
        .replace(expression, 'adaptMyWebTheme(currentThemeId.value, currentThemeConfig.value.themeOverrides || {})')
        .replace(darkClass, darkClass + '\n      document.documentElement.dataset.optimizerTheme = applied');
    }
  };
}
