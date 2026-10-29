export default function SiteMark() {
  "use memo";
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="32"
        height="32"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          className="site-mark-paper"
          x="2"
          y="2"
          width="60"
          height="60"
          rx="17"
          fill="#faf7f0"
        />
        <path
          className="site-mark-outline"
          d="m12 29 20-16 20 16M18 27v24h28V27"
          fill="none"
          stroke="#2b5b46"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="site-mark-door"
          d="m28 35 9-3v20l-9-3Z"
          fill="#c85a32"
        />
      </svg>
    </span>
  );
}
