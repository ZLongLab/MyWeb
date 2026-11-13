import { useId } from "react";

export default function JournalPrism() {
  const id = useId();
  return (
    <svg className="journal-prism" viewBox="0 0 80 90" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dcece4" stopOpacity=".55" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".15" />
          <stop offset="1" stopColor="#eadcc0" stopOpacity=".4" />
        </linearGradient>
      </defs>
      <path
        d="M39 7 10 67 47 81 70 65Z"
        fill={`url(#${id})`}
        stroke="#9eafa4"
        strokeOpacity=".3"
        strokeWidth=".6"
      />
      <path
        d="M39 7 47 81 70 65ZM10 67 47 81"
        fill="#fff"
        fillOpacity=".16"
        stroke="#a8beb0"
        strokeOpacity=".3"
        strokeWidth=".6"
      />
      <path
        d="m39 7-5 68m10-42 16 36M24 40l32 34"
        fill="none"
        stroke="#fff"
        strokeOpacity=".85"
        strokeWidth=".8"
      />
    </svg>
  );
}
