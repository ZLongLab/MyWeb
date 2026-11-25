// MyWeb Morning Porcelain appearance only. Existing theme IDs, settings and semantic statuses remain.
function adaptMyWebTheme(id: string, original: GlobalThemeOverrides): GlobalThemeOverrides {
  const fontFamily = '"Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  if (id !== 'light' && id !== 'dark') return { ...original, common: { ...original.common, fontFamily } };
  const dark = id === 'dark';
  const paper = dark ? '#161f1b' : '#faf9f7';
  const card = dark ? '#1e2a24' : '#ffffff';
  const soft = dark ? '#26362e' : '#f3f6f4';
  const ink = dark ? '#edf1ea' : '#222222';
  const muted = dark ? '#b6c2b8' : '#4a4a4a';
  const line = dark ? '#36473d' : '#e4eae6';
  const primary = dark ? '#98c6a5' : '#436153';
  const hover = dark ? '#b3dbbd' : '#355a4a';
  const pressed = dark ? '#85b893' : '#29483b';
  const onPrimary = dark ? '#16241c' : '#faf9f7';
  const selected = dark ? '#2f4539' : '#eaf2ee';
  const placeholder = dark ? '#8f9e93' : '#7b8580';
  return {
    ...original,
    common: {
      ...original.common, fontFamily, fontSize: '14px', borderRadius: '12px', borderRadiusSmall: '8px',
      primaryColor: primary, primaryColorHover: hover, primaryColorPressed: pressed, primaryColorSuppl: primary,
      bodyColor: paper, cardColor: card, modalColor: card, popoverColor: card, tableColor: card,
      textColorBase: ink, textColor1: ink, textColor2: muted, textColor3: placeholder,
      placeholderColor: placeholder, borderColor: line, dividerColor: line,
      hoverColor: dark ? 'rgba(152,198,165,.09)' : 'rgba(67,97,83,.06)',
      closeIconColor: muted, closeIconColorHover: ink, closeIconColorPressed: primary,
      scrollbarColor: dark ? '#495b50' : '#cdd6d0', scrollbarColorHover: dark ? '#6c8274' : '#9fb0a6'
    },
    Layout: { ...original.Layout, color: paper, textColor: ink, headerColor: paper, headerBorderColor: line, footerColor: paper, siderColor: paper },
    Button: {
      ...original.Button, borderRadiusMedium: '12px', borderRadiusSmall: '9px', fontWeight: '500',
      textColor: muted, textColorHover: primary, textColorPressed: pressed, textColorFocus: primary,
      color: card, colorHover: selected, colorPressed: selected, colorFocus: selected,
      border: '1px solid ' + line, borderHover: '1px solid ' + primary, borderPressed: '1px solid ' + primary,
      colorPrimary: primary, colorHoverPrimary: hover, colorPressedPrimary: pressed, colorFocusPrimary: primary,
      borderPrimary: '1px solid ' + primary, borderHoverPrimary: '1px solid ' + hover,
      borderPressedPrimary: '1px solid ' + pressed, borderFocusPrimary: '1px solid ' + primary,
      textColorPrimary: onPrimary, textColorHoverPrimary: onPrimary, textColorPressedPrimary: onPrimary, textColorFocusPrimary: onPrimary,
      colorDisabledPrimary: dark ? '#415548' : '#d2ddd7', borderDisabledPrimary: '1px solid ' + (dark ? '#415548' : '#d2ddd7'),
      textColorDisabledPrimary: dark ? '#b6c2b8' : '#586960', rippleColorPrimary: 'rgba(67,97,83,.18)'
    },
    Input: {
      ...original.Input, color: soft, colorFocus: card, colorDisabled: soft, textColor: ink,
      placeholderColor: placeholder, placeholderColorDisabled: placeholder,
      border: '1px solid ' + line, borderHover: '1px solid ' + primary, borderFocus: '1px solid ' + primary,
      boxShadowFocus: '0 0 0 2px ' + (dark ? 'rgba(152,198,165,.18)' : 'rgba(67,97,83,.14)'),
      caretColor: primary, iconColor: placeholder, iconColorHover: primary, iconColorPressed: pressed,
      suffixTextColor: muted, prefixTextColor: muted
    },
    Card: {
      ...original.Card, borderRadius: '18px', color: card, colorModal: card, colorTarget: card,
      textColor: ink, titleTextColor: ink, borderColor: line, actionColor: soft,
      closeIconColor: muted, closeIconColorHover: primary, closeIconColorPressed: pressed,
      boxShadow: '0 8px 30px rgba(26,48,38,.036)'
    },
    Tabs: {
      ...original.Tabs, tabColor: soft, tabColorActive: selected, tabBorderColor: line,
      tabTextColorBar: muted, tabTextColorBarHover: primary, tabTextColorBarActive: primary,
      tabTextColorCard: muted, tabTextColorCardActive: primary, barColor: primary
    },
    Radio: {
      ...original.Radio, buttonBorderColor: line, buttonBorderColorActive: primary,
      buttonColor: card, buttonColorActive: selected, buttonTextColor: muted, buttonTextColorActive: primary
    },
    Dropdown: {
      ...original.Dropdown, color: card, optionTextColor: ink, optionTextColorHover: primary,
      optionTextColorActive: primary, optionColorHover: soft, optionColorActive: selected, borderColor: line
    }
  };
}
