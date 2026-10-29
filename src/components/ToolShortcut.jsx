export default function ToolShortcut({
  eyebrow,
  href,
  label,
  offset,
  children,
}) {
  return (
    <aside className="workbench-tool-teaser" style={{ marginTop: offset }}>
      <p className="eyebrow">{eyebrow}</p>
      <p className="workbench-tool-teaser-description">
        <a className="text-link" href={href}>
          {label}
        </a>{" "}
        <span>{children}</span>
      </p>
    </aside>
  );
}
