"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────

const BG     = "#fdf6ee";
const SURF   = "#ffffff";
const BORDER = "#ecdfd0";
const TEXT   = "#2c1a0e";
const MUTED  = "#9a7f6a";
const ROSE   = "#d4547a";
const ORANGE = "#e8833a";
const GOLD   = "#c9a84c";
const PURPLE = "#7c4dff";
const NAVY   = "#1a2744";
const OK     = "#166534";
const NG     = "#991b1b";

// ── Mock data ─────────────────────────────────────────────────────────────────

const SELLER = "Butik Monika";

const SEGMENTS = [
  {
    id: "working",
    name: "Pracujące Kobiety",
    emoji: "👩‍💼",
    color: ROSE,
    share: 42,
    marketShare: 38,
    buyers: 89,
    avgOrder: 248,
    avgOrderBench: 235,
    returnRate: 24,
    returnRateBench: 29,
    returnDays: 18,
    motivation: "Szuka jakości i niezawodności. Czyta recenzje, planuje zakupy z wyprzedzeniem, rzadko impulsuje.",
    insight: "Twoje Pracujące Kobiety zwracają rzadziej niż benchmark (24% vs 29%) — to Twój najbardziej lojalny i dochodowy segment. Dbaj o powtarzalność jakości.",
  },
  {
    id: "bargain",
    name: "Łowczynie Okazji",
    emoji: "🏷️",
    color: ORANGE,
    share: 31,
    marketShare: 29,
    buyers: 65,
    avgOrder: 134,
    avgOrderBench: 142,
    returnRate: 51,
    returnRateBench: 44,
    returnDays: 34,
    motivation: "Kupuje podczas wyprzedaży i promocji. Porównuje ceny, wrażliwa na rabaty, często zwraca.",
    insight: "Twoje Łowczynie Okazji zwracają 2× więcej niż inne segmenty (51% vs benchmark 44%) — sprawdź opisy rozmiarów i zdjęcia materiałów.",
  },
  {
    id: "premium",
    name: "Kupujące Premium",
    emoji: "✨",
    color: GOLD,
    share: 18,
    marketShare: 22,
    buyers: 38,
    avgOrder: 412,
    avgOrderBench: 390,
    returnRate: 12,
    returnRateBench: 15,
    returnDays: 45,
    motivation: "Kupuje rzadko ale starannie. Ceni unikalność i jakość wykonania, minimalna liczba zwrotów.",
    insight: "Masz mniej Premium niż benchmark kategorii (18% vs 22%) — rozważ wyższą jakość wykonania lub premium packaging dla kluczowych SKU.",
  },
  {
    id: "trend",
    name: "Młode Trend-driven",
    emoji: "📱",
    color: PURPLE,
    share: 9,
    marketShare: 11,
    buyers: 19,
    avgOrder: 118,
    avgOrderBench: 125,
    returnRate: 38,
    returnRateBench: 41,
    returnDays: 22,
    motivation: "Kupuje impulsywnie, reaguje na trendy i social media. Szybkie decyzje, wrażliwość na wizualność.",
    insight: "Segment rośnie na platformie — dodaj opisy nawiązujące do aktualnych trendów i lifestyle'owe zdjęcia produktów.",
  },
] as const;

const SOURCES = [
  { label: "Wyszukiwarka FashionHero", percent: 54 },
  { label: "Google / zewnętrzne", percent: 28 },
  { label: "Rekomendacje platformy", percent: 12 },
  { label: "Bezpośrednio (znają sklep)", percent: 6 },
];

const BEHAVIORS = [
  { label: "Kupują przy pierwszej wizycie", percent: 31 },
  { label: "Wracają 2–3× przed zakupem", percent: 48 },
  { label: "Przeglądają konkurencję", percent: 21 },
];

const OUTCOMES = [
  { label: "Zatrzymują zakup", percent: 62, good: true },
  { label: "Zwracają produkt", percent: 38, good: false },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, delay = 0, duration = 950) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    setValue(0);
    const origin = performance.now() + delay;
    const tick = (now: number) => {
      if (now < origin) { raf.current = requestAnimationFrame(tick); return; }
      const t = Math.min((now - origin) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, delay, duration]);
  return value;
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtPLN(n: number) {
  return n.toLocaleString("pl-PL") + " PLN";
}

// ── Shared typography helpers ──────────────────────────────────────────────────

const T = {
  label: {
    fontFamily: "var(--font-dm-sans, sans-serif)",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: MUTED,
  },
  serif: (size: number, color = TEXT) => ({
    fontFamily: "var(--font-dm-serif, serif)",
    fontSize: size,
    color,
    margin: 0,
  }),
  sans: (size: number, weight: number | string = 400, color = TEXT) => ({
    fontFamily: "var(--font-dm-sans, sans-serif)",
    fontSize: size,
    fontWeight: weight,
    color,
    margin: 0,
  }),
};

// ── Section 1: Segment composition ────────────────────────────────────────────

function SegmentBar({ mounted }: { mounted: boolean }) {
  return (
    <div>
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 52, gap: 3 }}>
        {SEGMENTS.map((seg, i) => (
          <div
            key={seg.id}
            title={`${seg.name}: ${seg.share}%`}
            style={{
              width: mounted ? `${seg.share}%` : "0%",
              background: seg.color,
              transition: `width 0.85s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.11}s`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              minWidth: 0,
              position: "relative",
            }}
          >
            {seg.share >= 14 && (
              <span style={{ ...T.sans(14, 700, "white"), lineHeight: 1 }}>
                {seg.share}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Bubbles row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
        {SEGMENTS.map(seg => {
          const r = 14 + seg.share * 0.9;
          return (
            <div key={seg.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                background: `${seg.color}22`,
                border: `2px solid ${seg.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: r * 0.72 }}>{seg.emoji}</span>
              </div>
              <span style={{ ...T.sans(10, 600, seg.color), textAlign: "center", maxWidth: 70 }}>
                {seg.name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: 16 }}>
        {SEGMENTS.map(seg => (
          <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 9, height: 9, background: seg.color, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ ...T.sans(11, 400, MUTED) }}>{seg.name} · {seg.share}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenchmarkPanel() {
  return (
    <div style={{
      background: SURF,
      border: `1px solid ${BORDER}`,
      padding: "22px 24px",
      boxShadow: "0 1px 6px rgba(44,26,14,0.05)",
      height: "fit-content",
    }}>
      <p style={{ ...T.label, margin: "0 0 16px" }}>vs. benchmark kategorii</p>
      {SEGMENTS.map(seg => {
        const diff = seg.share - seg.marketShare;
        const noteGood = seg.id === "working" || seg.id === "premium"
          ? diff >= 0
          : diff <= 0;
        return (
          <div key={seg.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ ...T.sans(12, 500, TEXT), display: "flex", alignItems: "center", gap: 6 }}>
                <span>{seg.emoji}</span> {seg.name}
              </span>
              <span style={{
                ...T.sans(11, 700, noteGood ? OK : NG),
                background: noteGood ? "#dcfce7" : "#fee2e2",
                padding: "1px 6px",
                borderRadius: 2,
              }}>
                {diff > 0 ? "+" : ""}{diff}pp
              </span>
            </div>
            {/* Dual bar: benchmark (background) + seller (foreground) */}
            <div style={{ position: "relative", height: 6, background: `${seg.color}1a`, borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                position: "absolute",
                left: 0, top: 0, height: "100%",
                width: `${(seg.marketShare / 50) * 100}%`,
                background: `${seg.color}40`,
                borderRadius: 2,
              }} />
              <div style={{
                position: "absolute",
                left: 0, top: 0, height: "100%",
                width: `${(seg.share / 50) * 100}%`,
                background: seg.color,
                borderRadius: 2,
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ ...T.sans(10, 400, MUTED) }}>Rynek: {seg.marketShare}%</span>
              <span style={{ ...T.sans(10, 600, seg.color) }}>Ty: {seg.share}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Section 2: Segment cards ───────────────────────────────────────────────────

function MetricCompare({
  label, mine, bench, unit = "", lowerBetter = false,
}: {
  label: string; mine: number; bench: number; unit?: string; lowerBetter?: boolean;
}) {
  const diff = mine - bench;
  const good = lowerBetter ? diff < 0 : diff > 0;
  const color = diff === 0 ? MUTED : good ? OK : NG;
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "8px 0",
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <span style={{ ...T.sans(12, 400, MUTED) }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ ...T.sans(15, 700) }}>{mine}{unit}</span>
        <span style={{ ...T.sans(11, 500, color), marginLeft: 7 }}>
          {diff > 0 ? "+" : ""}{diff}{unit} vs. rynek
        </span>
      </div>
    </div>
  );
}

function SegmentCard({
  seg,
  idx,
  expanded,
  onToggle,
}: {
  seg: typeof SEGMENTS[number];
  idx: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const buyers = useCountUp(seg.buyers, idx * 120, 900);

  return (
    <div
      onClick={onToggle}
      style={{
        background: SURF,
        border: `1px solid ${BORDER}`,
        borderLeft: `4px solid ${seg.color}`,
        boxShadow: expanded
          ? "0 10px 36px rgba(44,26,14,0.12)"
          : "0 1px 5px rgba(44,26,14,0.05)",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: expanded ? "translateY(-3px)" : "none",
        userSelect: "none",
      }}
    >
      {/* Always-visible header */}
      <div style={{ padding: "22px 22px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>{seg.emoji}</span>
            <div>
              <p style={{ ...T.serif(19), margin: 0 }}>{seg.name}</p>
              <p style={{ ...T.sans(11, 400, MUTED), margin: "2px 0 0" }}>
                {seg.share}% Twoich kupujących
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...T.sans(32, 700, seg.color), margin: 0, lineHeight: 1 }}>{buyers}</p>
            <p style={{ ...T.sans(10, 400, MUTED), margin: "2px 0 0" }}>kupujących / mies.</p>
          </div>
        </div>

        {/* 3 key stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { label: "śr. zamówienie", value: fmtPLN(seg.avgOrder) },
            { label: "return rate",    value: `${seg.returnRate}%` },
            { label: "wraca co",       value: `${seg.returnDays} dni` },
          ].map(stat => (
            <div key={stat.label} style={{
              background: `${seg.color}0e`,
              padding: "9px 10px",
            }}>
              <p style={{ ...T.label, margin: "0 0 3px" }}>{stat.label}</p>
              <p style={{ ...T.sans(13, 700) }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <p style={{
          ...T.sans(11, 400, MUTED),
          margin: "14px 0 0",
          textAlign: "right",
        }}>
          {expanded ? "▲ zwiń" : "▼ szczegóły i rekomendacja"}
        </p>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: "18px 22px 20px" }}>
          <MetricCompare
            label="Średnie zamówienie"
            mine={seg.avgOrder}
            bench={seg.avgOrderBench}
            unit=" PLN"
          />
          <MetricCompare
            label="Return rate"
            mine={seg.returnRate}
            bench={seg.returnRateBench}
            unit="%"
            lowerBetter
          />
          <MetricCompare
            label="Powrót co (dni)"
            mine={seg.returnDays}
            bench={seg.returnDays + (seg.id === "working" ? -2 : seg.id === "bargain" ? 4 : seg.id === "premium" ? -3 : 2)}
            lowerBetter
          />

          <div style={{ marginTop: 14 }}>
            <p style={{ ...T.label, margin: "0 0 6px" }}>Motywacja zakupowa</p>
            <p style={{ ...T.serif(14), lineHeight: 1.7 }}>{seg.motivation}</p>
          </div>

          <div style={{
            background: `${seg.color}0f`,
            borderLeft: `3px solid ${seg.color}`,
            padding: "12px 14px",
            marginTop: 14,
          }}>
            <p style={{ ...T.label, color: seg.color, margin: "0 0 5px" }}>
              Rekomendacja
            </p>
            <p style={{ ...T.serif(13), lineHeight: 1.7 }}>{seg.insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section 3: Flow diagram (custom SVG Sankey) ────────────────────────────────

const FLOW_H   = 310;
const MARGIN_Y = 22;
const NODE_GAP = 6;
const USABLE_H = FLOW_H - MARGIN_Y * 2;

function nodePositions(items: { percent: number }[]) {
  let y = MARGIN_Y;
  return items.map(item => {
    const h = Math.max(10, (item.percent / 100) * USABLE_H - NODE_GAP);
    const top = y;
    const bot = y + h;
    y += h + NODE_GAP;
    return { top, bot, mid: (top + bot) / 2, h };
  });
}

function FlowDiagram() {
  const srcPos = nodePositions(SOURCES);
  const bhrPos = nodePositions(BEHAVIORS);
  const outPos = nodePositions(OUTCOMES);

  // Source colors (shades of navy by density)
  const srcColors = ["#1a2744", "#2d4070", "#3d5490", "#5a78c0"];

  // Build Sankey paths: each source to each behavior (proportional split)
  // Weight[i][j] = source_i% × behavior_j% / 100
  const sbWeights = SOURCES.map(s => BEHAVIORS.map(b => s.percent * b.percent / 100));

  // Strip positions within source nodes (exit side)
  const srcStrips = SOURCES.map((src, i) => {
    let y = srcPos[i].top;
    return BEHAVIORS.map((_, j) => {
      const h = (sbWeights[i][j] / src.percent) * srcPos[i].h;
      const strip = { top: y, bot: y + h };
      y += h;
      return strip;
    });
  });

  // Strip positions within behavior nodes (entry side) — order by source
  const bhrStrips = BEHAVIORS.map((bhr, j) => {
    let y = bhrPos[j].top;
    return SOURCES.map((_, i) => {
      const h = (sbWeights[i][j] / bhr.percent) * bhrPos[j].h;
      const strip = { top: y, bot: y + h };
      y += h;
      return strip;
    });
  });

  // Behavior → outcome weights: behavior_j% × outcome_k% / 100
  const boWeights = BEHAVIORS.map(b => OUTCOMES.map(o => b.percent * o.percent / 100));

  const bhrExitStrips = BEHAVIORS.map((bhr, j) => {
    let y = bhrPos[j].top;
    return OUTCOMES.map((_, k) => {
      const h = (boWeights[j][k] / bhr.percent) * bhrPos[j].h;
      const strip = { top: y, bot: y + h };
      y += h;
      return strip;
    });
  });

  const outEntryStrips = OUTCOMES.map((out, k) => {
    let y = outPos[k].top;
    return BEHAVIORS.map((_, j) => {
      const h = (boWeights[j][k] / out.percent) * outPos[k].h;
      const strip = { top: y, bot: y + h };
      y += h;
      return strip;
    });
  });

  // Bezier band path
  function band(x1: number, y1t: number, y1b: number, x2: number, y2t: number, y2b: number) {
    const cx = (x1 + x2) / 2;
    return (
      `M ${x1} ${y1t} C ${cx} ${y1t} ${cx} ${y2t} ${x2} ${y2t} ` +
      `L ${x2} ${y2b} C ${cx} ${y2b} ${cx} ${y1b} ${x1} ${y1b} Z`
    );
  }

  const VW = 900;
  // Column x positions
  const S_X0 = 0, S_X1 = 140;          // source node
  const B_X0 = 240, B_X1 = 410;        // behavior node
  const O_X0 = 510, O_X1 = 640;        // outcome node
  const SRC_LABEL_X = S_X1 + 10;
  const BHR_LABEL_X = B_X1 + 10;
  const OUT_LABEL_X = O_X1 + 10;

  const outColors = [OK, NG];
  const bhrColors = [ROSE, ORANGE, PURPLE];

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${VW} ${FLOW_H}`}
        style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}
      >
        {/* ── Source → Behavior bands ── */}
        {SOURCES.map((_, i) =>
          BEHAVIORS.map((_, j) => (
            <path
              key={`sb-${i}-${j}`}
              d={band(S_X1, srcStrips[i][j].top, srcStrips[i][j].bot, B_X0, bhrStrips[j][i].top, bhrStrips[j][i].bot)}
              fill={srcColors[i]}
              opacity={0.13}
            />
          ))
        )}

        {/* ── Behavior → Outcome bands ── */}
        {BEHAVIORS.map((_, j) =>
          OUTCOMES.map((_, k) => (
            <path
              key={`bo-${j}-${k}`}
              d={band(B_X1, bhrExitStrips[j][k].top, bhrExitStrips[j][k].bot, O_X0, outEntryStrips[k][j].top, outEntryStrips[k][j].bot)}
              fill={bhrColors[j]}
              opacity={0.18}
            />
          ))
        )}

        {/* ── Source nodes ── */}
        {SOURCES.map((src, i) => (
          <g key={`src-${i}`}>
            <rect
              x={S_X0} y={srcPos[i].top}
              width={S_X1 - S_X0} height={srcPos[i].h}
              fill={srcColors[i]}
              rx={2}
            />
            {srcPos[i].h >= 20 && (
              <text
                x={(S_X0 + S_X1) / 2}
                y={srcPos[i].mid + 5}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, fontWeight: 700, fill: "white" }}
              >
                {src.percent}%
              </text>
            )}
            <text
              x={SRC_LABEL_X}
              y={srcPos[i].mid + 5}
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 11, fill: TEXT }}
            >
              {src.label}
            </text>
          </g>
        ))}

        {/* ── Behavior nodes ── */}
        {BEHAVIORS.map((bhr, j) => (
          <g key={`bhr-${j}`}>
            <rect
              x={B_X0} y={bhrPos[j].top}
              width={B_X1 - B_X0} height={bhrPos[j].h}
              fill={bhrColors[j]}
              rx={2}
            />
            {bhrPos[j].h >= 20 && (
              <text
                x={(B_X0 + B_X1) / 2}
                y={bhrPos[j].mid + 5}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, fontWeight: 700, fill: "white" }}
              >
                {bhr.percent}%
              </text>
            )}
            <text
              x={BHR_LABEL_X}
              y={bhrPos[j].mid + 5}
              style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 11, fill: TEXT }}
            >
              {bhr.label}
            </text>
          </g>
        ))}

        {/* ── Outcome nodes ── */}
        {OUTCOMES.map((out, k) => (
          <g key={`out-${k}`}>
            <rect
              x={O_X0} y={outPos[k].top}
              width={O_X1 - O_X0} height={outPos[k].h}
              fill={outColors[k]}
              rx={2}
            />
            {outPos[k].h >= 20 && (
              <text
                x={(O_X0 + O_X1) / 2}
                y={outPos[k].mid + 5}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 13, fontWeight: 700, fill: "white" }}
              >
                {out.percent}%
              </text>
            )}
            <text
              x={OUT_LABEL_X}
              y={outPos[k].mid + 5}
              style={{
                fontFamily: "var(--font-dm-sans, sans-serif)",
                fontSize: 12,
                fontWeight: 600,
                fill: outColors[k],
              }}
            >
              {out.label}
            </text>
          </g>
        ))}

        {/* ── Column headers ── */}
        {[
          { label: "ŹRÓDŁO",      x: (S_X0 + S_X1) / 2 },
          { label: "ZACHOWANIE",  x: (B_X0 + B_X1) / 2 },
          { label: "WYNIK",       x: (O_X0 + O_X1) / 2 },
        ].map(col => (
          <text
            key={col.label}
            x={col.x}
            y={10}
            textAnchor="middle"
            style={{
              fontFamily: "var(--font-dm-sans, sans-serif)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              fill: MUTED,
            }}
          >
            {col.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function BuyerLensPage() {
  const [mounted,      setMounted]      = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const toggleCard = useCallback((id: string) => {
    setExpandedCard(prev => prev === id ? null : id);
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>

      {/* ── Top bar ── */}
      <div style={{
        background: NAVY,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {["FashionHero", "Seller Intelligence", "Buyer Lens"].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                ...T.sans(11, i === arr.length - 1 ? 600 : 400, i === arr.length - 1 ? "#fff" : "rgba(255,255,255,0.35)"),
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                {crumb}
              </span>
              {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>}
            </span>
          ))}
        </div>
        <span style={{ ...T.sans(11, 400, "rgba(255,255,255,0.4)"), letterSpacing: "0.06em" }}>
          {SELLER}
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>

        {/* ── Section 1: Segment composition ── */}
        <div style={{ padding: "44px 0 36px", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ ...T.label, margin: "0 0 10px" }}>Buyer Lens · {SELLER} · ostatni miesiąc</p>
          <h1 style={{
            ...T.serif(42),
            lineHeight: 1.1,
            margin: "0 0 32px",
          }}>
            Twoi kupujący<br />
            <em style={{ color: ROSE }}>w tym miesiącu</em>
          </h1>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 28,
            alignItems: "start",
          }}>
            <SegmentBar mounted={mounted} />
            <BenchmarkPanel />
          </div>
        </div>

        {/* ── Section 2: Segment cards ── */}
        <div style={{ padding: "40px 0", borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ ...T.label, margin: "0 0 8px" }}>Zachowanie per segment</p>
          <h2 style={{ ...T.serif(32), margin: "0 0 28px" }}>
            Kto u Ciebie kupuje i jak się zachowuje
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}>
            {SEGMENTS.map((seg, i) => (
              <SegmentCard
                key={seg.id}
                seg={seg}
                idx={i}
                expanded={expandedCard === seg.id}
                onToggle={() => toggleCard(seg.id)}
              />
            ))}
          </div>

          <p style={{ ...T.sans(12, 400, MUTED), margin: "16px 0 0", fontStyle: "italic" }}>
            Kliknij kartę, aby zobaczyć szczegółowe benchmarki i rekomendację.
          </p>
        </div>

        {/* ── Section 3: Flow diagram ── */}
        <div style={{ padding: "40px 0 52px" }}>
          <p style={{ ...T.label, margin: "0 0 8px" }}>Ścieżka odkrycia</p>
          <h2 style={{ ...T.serif(32), margin: "0 0 6px" }}>
            Skąd trafiają kupujące do Ciebie
          </h2>
          <p style={{ ...T.sans(13, 400, MUTED), margin: "0 0 28px", fontStyle: "italic" }}>
            Przepływ kupujących: źródło → zachowanie przed zakupem → wynik
          </p>

          <div style={{
            background: SURF,
            border: `1px solid ${BORDER}`,
            padding: "28px 24px",
            boxShadow: "0 1px 6px rgba(44,26,14,0.05)",
            marginBottom: 20,
          }}>
            <FlowDiagram />
          </div>

          {/* Insight */}
          <div style={{
            borderLeft: `3px solid ${ROSE}`,
            background: `${ROSE}08`,
            padding: "16px 20px",
            marginBottom: 32,
          }}>
            <p style={{ ...T.label, color: ROSE, margin: "0 0 5px" }}>Kluczowy insight</p>
            <p style={{ ...T.serif(14), lineHeight: 1.75 }}>
              54% Twoich kupujących trafia przez wyszukiwarkę FashionHero — optymalizacja
              nazw i opisów produktów bezpośrednio zwiększa widoczność w tym kanale.
              Tylko 6% przychodzi bezpośrednio, co oznacza duży potencjał budowania
              rozpoznawalności marki wśród powracających klientek.
            </p>
          </div>

          {/* Source attribution */}
          <div style={{
            paddingTop: 20,
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}>
            <p style={{ ...T.sans(12, 400, MUTED), fontStyle: "italic", margin: 0 }}>
              Dane behawioralne z 2.4 mln aktywnych kupujących — FashionHero, ostatni miesiąc
            </p>
            <p style={{ ...T.sans(10, 400), color: "#c4b8a8", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
              Ekskluzywne dane · Tylko dla sprzedawców FashionHero
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: `${TEXT}f0`,
        padding: "18px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <p style={{ ...T.sans(11, 400, "rgba(255,255,255,0.3)"), letterSpacing: "0.05em", margin: 0 }}>
          © 2026 FashionHero · Seller Intelligence · Dane odświeżane codziennie
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {SEGMENTS.map(seg => (
            <div key={seg.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: seg.color }} />
              <span style={{ ...T.sans(10, 400, "rgba(255,255,255,0.3)") }}>{seg.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
