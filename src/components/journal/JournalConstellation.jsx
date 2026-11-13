export default function JournalConstellation() {
  const points = [
    [34, 126],
    [93, 57],
    [140, 156],
    [198, 96],
    [268, 42],
    [307, 139],
    [242, 192],
    [109, 216],
    [188, 29],
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [1, 8],
    [2, 3],
    [2, 7],
    [3, 4],
    [3, 5],
    [3, 6],
    [3, 8],
    [4, 5],
    [5, 6],
    [6, 7],
  ];
  return (
    <svg
      width="0"
      height="0"
      className="journal-evolution-defs"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <symbol id="journal-evolution-symbol" viewBox="0 0 350 250">
          <g className="journal-connections">
            {edges.map(([from, to]) => (
              <line
                key={`${from}-${to}`}
                x1={points[from][0]}
                y1={points[from][1]}
                x2={points[to][0]}
                y2={points[to][1]}
              />
            ))}
          </g>
          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 3 ? 4.5 : 2.8}
              className={i % 3 === 0 ? "journal-node warm" : "journal-node"}
            />
          ))}
          <circle cx="198" cy="96" r="11" className="journal-node-orbit" />
          <circle cx="322" cy="76" r="1.6" className="journal-satellite" />
          <circle cx="62" cy="191" r="1.3" className="journal-satellite" />
          <circle cx="244" cy="228" r="1.5" className="journal-satellite" />
        </symbol>
      </defs>
    </svg>
  );
}
