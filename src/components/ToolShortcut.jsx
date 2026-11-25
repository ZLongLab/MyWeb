const TOOL_ICONS = {
  "image-tools": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m21 15-4.5-4.5L9 18" />
    </svg>
  ),
  "frame-studio": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="9.2" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
      <rect x="7" y="12" width="10" height="5" rx="1.2" />
    </svg>
  ),
  "image-prompts": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17V3.5Z" fill="currentColor" opacity="0.22" stroke="none" />
      <circle cx="15" cy="9" r="1.4" />
    </svg>
  ),
  "video-prompts": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  optimizer: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3 14.3 9.7 21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z" />
    </svg>
  ),
  "focus-lab": (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 9.5V13l2.6 1.8M9.5 3h5" />
    </svg>
  ),
  guestbook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5Z" />
      <path d="M8 9.5h8M8 13.5h5.5" />
    </svg>
  ),
  christmas: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 5.5 7.2h-2.4l3.7 5.3H5.2l3.7-5.3H6.5L12 3Z" />
      <path d="M12 15.5V21M9.5 21h5" />
    </svg>
  ),
};

export default function ToolShortcut({
  eyebrow,
  title,
  badge,
  icon = "image-tools",
  tone = "mint",
  href,
  label,
  offset,
  children,
}) {
  "use memo";
  return (
    <aside
      className={`workbench-tool-teaser workbench-tool-tone-${tone}`}
      style={offset ? { marginTop: offset } : undefined}
    >
      <div className="workbench-tool-top">
        <span className="workbench-tool-icon">{TOOL_ICONS[icon] || TOOL_ICONS["image-tools"]}</span>
        <div className="workbench-tool-head">
          <p className="eyebrow">{eyebrow}</p>
          {title && <h3>{title}</h3>}
        </div>
        {badge && <span className="workbench-tool-badge">{badge}</span>}
      </div>
      <p className="workbench-tool-teaser-description">
        <span>{children}</span>
      </p>
      <div className="workbench-tool-foot">
        <a className="text-link" href={href}>
          {label}
        </a>
      </div>
    </aside>
  );
}
