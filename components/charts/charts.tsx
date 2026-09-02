export type ChartItem = {
  label: string;
  value: number;
  color?: string;
  hint?: string;
};

const DEFAULT_COLORS = ["var(--primary)", "var(--teal)", "var(--ai)", "var(--hint)", "var(--error)"];

function colorFor(index: number, color?: string) {
  return color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const sweep = end - start;
  if (sweep <= 0) return "";
  if (sweep >= 359.99) {
    const a = polarToCartesian(cx, cy, r, 0);
    const b = polarToCartesian(cx, cy, r, 179.99);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 1 1 ${b.x} ${b.y} A ${r} ${r} 0 1 1 ${a.x} ${a.y}`;
  }
  const startPt = polarToCartesian(cx, cy, r, start);
  const endPt = polarToCartesian(cx, cy, r, end);
  const large = sweep > 180 ? 1 : 0;
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${large} 1 ${endPt.x} ${endPt.y}`;
}

export function BarChart({
  items,
  unit = "",
  heightClass = "h-52",
}: {
  items: ChartItem[];
  unit?: string;
  heightClass?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-text-secondary">No data yet.</p>;
  }
  return (
    <div
      className={`mt-6 flex ${heightClass} items-end justify-around gap-3 px-2`}
      role="img"
      aria-label={items.map((item) => `${item.label} ${item.value}`).join(", ")}
    >
      {items.map((item, index) => {
        const height = Math.max(8, (item.value / max) * 100);
        return (
          <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-semibold text-text">
              {item.value}
              {unit}
            </span>
            <span
              className="w-full max-w-12 rounded-t-lg"
              style={{ height: `${height}%`, background: colorFor(index, item.color) }}
            />
            <span className="max-w-full truncate text-center text-[11px] font-medium text-text-secondary">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({ items, centerLabel }: { items: ChartItem[]; centerLabel: string }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let angle = 0;
  const slices = items.map((item, index) => {
    const sweep = total > 0 ? (item.value / total) * 360 : 0;
    const slice = { ...item, color: colorFor(index, item.color), start: angle, end: angle + sweep };
    angle += sweep;
    return slice;
  });

  return (
    <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden>
        {total === 0 ? (
          <circle cx="90" cy="90" r="62" fill="none" stroke="var(--border)" strokeWidth="22" />
        ) : (
          slices.map((slice) =>
            slice.value === 0 ? null : (
              <path
                key={slice.label}
                d={arcPath(90, 90, 62, slice.start, slice.end)}
                fill="none"
                stroke={slice.color}
                strokeWidth="22"
                strokeLinecap="butt"
              />
            ),
          )
        )}
        <text x="90" y="86" textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="600">
          {total}
        </text>
        <text x="90" y="108" textAnchor="middle" fill="var(--text-muted)" fontSize="11">
          {centerLabel}
        </text>
      </svg>
      <ul className="w-full space-y-3 text-sm">
        {items.map((item, index) => {
          const pct = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <li key={item.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorFor(index, item.color) }} />
                {item.label}
              </span>
              <span className="font-medium text-text">
                {item.value} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LineChart({ items, maxValue }: { items: ChartItem[]; maxValue?: number }) {
  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-text-secondary">No data yet.</p>;
  }
  const width = 520;
  const height = 200;
  const padX = 16;
  const padY = 20;
  const peak = Math.max(maxValue ?? 0, ...items.map((item) => item.value), 1);
  const points = items.map((item, index) => {
    const x = padX + (index / Math.max(items.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - (item.value / peak) * (height - padY * 2);
    return { x, y, item };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${padX},${height - padY} ${line} ${points[points.length - 1].x},${height - padY}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-52 w-full" role="img" aria-label="Performance trend">
      <polyline points={area} fill="color-mix(in srgb, var(--primary) 16%, transparent)" stroke="none" />
      <polyline points={line} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((point) => (
        <circle key={point.item.label} cx={point.x} cy={point.y} r="4" fill="var(--primary)" />
      ))}
    </svg>
  );
}

export function HBarList({ items, maxValue }: { items: ChartItem[]; maxValue?: number }) {
  const max = Math.max(maxValue ?? 0, ...items.map((item) => item.value), 1);
  if (items.length === 0) {
    return <p className="py-6 text-sm text-text-secondary">No data yet.</p>;
  }
  return (
    <div className="mt-4 space-y-4">
      {items.map((item, index) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate font-medium text-text">{item.label}</span>
            <span className="shrink-0 text-text-muted">{item.hint ?? `${Math.round(item.value)}%`}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.min(100, (item.value / max) * 100)}%`,
                background: colorFor(index, item.color),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
