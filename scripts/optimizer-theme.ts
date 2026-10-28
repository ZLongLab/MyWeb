// MyWeb appearance only. Existing theme IDs, settings and semantic statuses remain.
function adaptMyWebTheme(id: string, original: GlobalThemeOverrides): GlobalThemeOverrides {
  const fontFamily = '"Noto Sans SC", "Microsoft YaHei UI", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  if (id !== 'light' && id !== 'dark') return { ...original, common: { ...original.common, fontFamily } };
  const dark = id === 'dark';
  const paper = dark ? '#1e2420' : '#faf7f2';
  const card = dark ? '#252e28' : '#fffdf8';
  const soft = dark ? '#2d3830' : '#f3efe6';
  const ink = dark ? '#e4e8de' : '#272c26';
  const muted = dark ? '#b3bcad' : '#5a6058';
  const line = dark ? '#435044' : '#deded2';
  const primary = dark ? '#98c6a5' : '#2b5b46';
  const hover = dark ? '#b3dbbd' : '#346e54';
  const pressed = dark ? '#85b893' : '#234b39';
  const onPrimary = dark ? '#19291e' : '#fffdf8';
  const selected = dark ? '#374b3b' : '#e5ecdf';
  const placeholder = dark ? '#9aa792' : '#66705f';
  return {
    ...original,
    common: {
      ...original.common, fontFamily, fontSize: '14px', borderRadius: '8px', borderRadiusSmall: '6px',
      primaryColor: primary, primaryColorHover: hover, primaryColorPressed: pressed, primaryColorSuppl: primary,
      bodyColor: paper, cardColor: card, modalColor: card, popoverColor: card, tableColor: card,
      textColorBase: ink, textColor1: ink, textColor2: muted, textColor3: placeholder,
      placeholderColor: placeholder, borderColor: line, dividerColor: line,
      hoverColor: dark ? 'rgba(152,198,165,.08)' : 'rgba(43,91,70,.06)',
      closeIconColor: muted, closeIconColorHover: ink, closeIconColorPressed: primary,
      scrollbarColor: dark ? '#526050' : '#d1d5c8', scrollbarColorHover: dark ? '#75856e' : '#a9b49f'
    },
    Layout: { ...original.Layout, color: paper, textColor: ink, headerColor: paper, headerBorderColor: line, footerColor: paper, siderColor: paper },
    Button: {
      ...original.Button, borderRadiusMedium: '8px', borderRadiusSmall: '6px', fontWeight: '500',
      textColor: muted, textColorHover: primary, textColorPressed: pressed, textColorFocus: primary,
      color: card, colorHover: selected, colorPressed: selected, colorFocus: selected,
      border: '1px solid ' + line, borderHover: '1px solid ' + primary, borderPressed: '1px solid ' + primary,
      colorPrimary: primary, colorHoverPrimary: hover, colorPressedPrimary: pressed, colorFocusPrimary: primary,
      borderPrimary: '1px solid ' + primary, borderHoverPrimary: '1px solid ' + hover,
      borderPressedPrimary: '1px solid ' + pressed, borderFocusPrimary: '1px solid ' + primary,
      textColorPrimary: onPrimary, textColorHoverPrimary: onPrimary, textColorPressedPrimary: onPrimary, textColorFocusPrimary: onPrimary,
      colorDisabledPrimary: dark ? '#49604c' : '#ced8c9', borderDisabledPrimary: '1px solid ' + (dark ? '#49604c' : '#ced8c9'),
      textColorDisabledPrimary: dark ? '#b3bcad' : '#53634f', rippleColorPrimary: 'rgba(43,91,70,.18)'
    },
    Input: {
      ...original.Input, color: soft, colorFocus: card, colorDisabled: soft, textColor: ink,
      placeholderColor: placeholder, placeholderColorDisabled: placeholder,
      border: '1px solid ' + line, borderHover: '1px solid ' + primary, borderFocus: '1px solid ' + primary,
      boxShadowFocus: '0 0 0 2px ' + (dark ? 'rgba(152,198,165,.16)' : 'rgba(43,91,70,.12)'),
      caretColor: primary, iconColor: placeholder, iconColorHover: primary, iconColorPressed: pressed,
      suffixTextColor: muted, prefixTextColor: muted
    },
    Card: {
      ...original.Card, borderRadius: '10px', color: card, colorModal: card, colorTarget: card,
      textColor: ink, titleTextColor: ink, borderColor: line, actionColor: soft,
      closeIconColor: muted, closeIconColorHover: primary, closeIconColorPressed: pressed,
      boxShadow: '0 2px 4px rgba(25,28,26,.03), 0 10px 24px -16px rgba(25,28,26,.13)'
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
