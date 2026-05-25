"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Design tokens ─────────────────────────────────────────────────────────────

const NAVY   = "#1a2744";
const GOLD   = "#c9a84c";
const BG     = "#fafafa";
const SURF   = "#ffffff";
const BORDER = "#e4e4e8";
const TEXT   = "#111827";
const MUTED  = "#6b7280";
const OK_BG  = "#dcfce7";
const OK_FG  = "#166534";
const NG_BG  = "#fee2e2";
const NG_FG  = "#991b1b";

// ── Types ─────────────────────────────────────────────────────────────────────

type Period   = "30" | "90" | "365";
type Category = "Sukienki" | "Bluzki" | "Spodnie";

// ── Mock data ─────────────────────────────────────────────────────────────────

const SELLER_NAME = "Fashion House Kowalski";

const KPI: Record<Period, {
  gmv: number; gmvChange: number;
  orders: number; ordersChange: number;
  returnRate: number; returnRateBenchmark: number;
  avgOrder: number; avgOrderChange: number;
}> = {
  "30": {
    gmv: 124800, gmvChange: 12,
    orders: 623, ordersChange: -3,
    returnRate: 34, returnRateBenchmark: 38,
    avgOrder: 200, avgOrderChange: 8,
  },
  "90": {
    gmv: 342600, gmvChange: 18,
    orders: 1742, ordersChange: 9,
    returnRate: 36, returnRateBenchmark: 39,
    avgOrder: 197, avgOrderChange: 5,
  },
  "365": {
    gmv: 1248000, gmvChange: 22,
    orders: 6823, ordersChange: 14,
    returnRate: 35, returnRateBenchmark: 38,
    avgOrder: 183, avgOrderChange: 11,
  },
};

const CAT_DATA: Record<Period, Record<Category, {
  labels: string[];
  seller: number[];
  market: number[];
  insight: string;
}>> = {
  "30": {
    Sukienki: {
      labels: ["Tydz. 1", "Tydz. 2", "Tydz. 3", "Tydz. 4"],
      seller: [100, 108, 94, 112],
      market: [100, 106, 91, 108],
      insight: "W ostatnim tygodniu Twoja sprzedaż sukienek była 4 punkty procentowe powyżej wzrostu rynku. Trend pozytywny — utrzymaj stock i sprawdź, które rozmiary rotują najszybciej.",
    },
    Bluzki: {
      labels: ["Tydz. 1", "Tydz. 2", "Tydz. 3", "Tydz. 4"],
      seller: [100, 92, 88, 96],
      market: [100, 98, 94, 103],
      insight: "Sprzedaż bluzek spada szybciej niż rynek w tygodniach 2–3. Sprawdź dostępność popularnych rozmiarów i rozważ promocję na wolno rotujące SKU.",
    },
    Spodnie: {
      labels: ["Tydz. 1", "Tydz. 2", "Tydz. 3", "Tydz. 4"],
      seller: [100, 104, 110, 118],
      market: [100, 102, 108, 112],
      insight: "Spodnie rosną 6pp szybciej niż rynek — jeden z Twoich najmocniejszych wyników kategoryjnych w ostatnim miesiącu. Rozważ poszerzenie asortymentu.",
    },
  },
  "90": {
    Sukienki: {
      labels: ["Paź", "Lis", "Gru"],
      seller: [100, 147, 122],
      market: [100, 141, 122],
      insight: "Twój Black Friday (listopad) był 6pp mocniejszy niż średnia rynkowa w sukienkach. Grudzień wyrównał się z benchmarkiem. Na Q1 zaplanuj wyprzedażową ofertę z resztek stocku.",
    },
    Bluzki: {
      labels: ["Paź", "Lis", "Gru"],
      seller: [100, 138, 112],
      market: [100, 134, 116],
      insight: "Bluzki Q4: listopad powyżej rynku (+4pp), grudzień 4pp poniżej benchmarku — asortyment świąteczny wyczerpał się zbyt wcześnie. Zaplanuj głębszy stock na grudzień 2025.",
    },
    Spodnie: {
      labels: ["Paź", "Lis", "Gru"],
      seller: [100, 148, 117],
      market: [100, 135, 115],
      insight: "Wyraźna przewaga w spodniach w Q4 — listopad +13pp vs rynek. Twój asortyment jeansów i wełnianych modeli trafił idealnie w sezon. Powtórz tę strategię.",
    },
  },
  "365": {
    Sukienki: {
      labels: ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],
      seller: [100, 74, 115, 173, 156, 137, 120, 127, 166, 185, 273, 227],
      market: [100, 78, 112, 168, 148, 134, 118, 124, 158, 176, 248, 214],
      insight: "Twój szczyt sprzedaży sukienek (listopad, indeks 273) jest zgodny z rynkiem (248). Marzec jest 3pp powyżej benchmarku — dobry wynik w trudnym miesiącu. Luty to najsłabszy punkt — warto przygotować kampanię \"wiosna zbliża się\".",
    },
    Bluzki: {
      labels: ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],
      seller: [100, 81, 122, 175, 150, 131, 113, 138, 159, 181, 263, 206],
      market: [100, 80, 111, 161, 145, 127, 109, 123, 150, 168, 225, 195],
      insight: "W bluzach wyprzedzasz rynek w sierpniu (+15pp) i wrześniu (+9pp). Twój asortyment letni doskonale trafił w sezon. W przyszłym roku zwiększ zamówienia letnich modeli o co najmniej 20%.",
    },
    Spodnie: {
      labels: ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"],
      seller: [100, 81, 117, 150, 133, 108, 100, 125, 175, 192, 283, 225],
      market: [100, 80, 113, 150, 132, 106, 96, 117, 161, 176, 237, 202],
      insight: "Spodnie: lipiec wyrównany z rynkiem, wyraźna siła w Q4 (+46pp vs rynek w listopadzie). Twój wrzesień (175) jest 14pp powyżej benchmarku (161) — świetne wyczucie sezonu.",
    },
  },
};

const HEATMAP = [
  { month: "Styczeń",    short: "Sty", index: 82,  returnRate: 41, dominant: "Sukienki koktajlowe",  tag: "Wyprzedaże" },
  { month: "Luty",       short: "Lut", index: 48,  returnRate: 35, dominant: "Bluzki",               tag: "Martwy sezon" },
  { month: "Marzec",     short: "Mar", index: 68,  returnRate: 33, dominant: "Bluzki wiosenne",      tag: "Przebudzenie" },
  { month: "Kwiecień",   short: "Kwi", index: 94,  returnRate: 30, dominant: "Sukienki",             tag: "Szczyt wiosenny" },
  { month: "Maj",        short: "Maj", index: 86,  returnRate: 31, dominant: "Sukienki",             tag: "Wiosna" },
  { month: "Czerwiec",   short: "Cze", index: 74,  returnRate: 34, dominant: "Bluzki letnie",        tag: "Lato" },
  { month: "Lipiec",     short: "Lip", index: 64,  returnRate: 36, dominant: "Bluzki letnie",        tag: "Urlopy" },
  { month: "Sierpień",   short: "Sie", index: 70,  returnRate: 37, dominant: "Sukienki letnie",      tag: "Koniec lata" },
  { month: "Wrzesień",   short: "Wrz", index: 84,  returnRate: 32, dominant: "Sukienki",             tag: "Jesień" },
  { month: "Październik",short: "Paź", index: 90,  returnRate: 33, dominant: "Spodnie",              tag: "Peak jesienny" },
  { month: "Listopad",   short: "Lis", index: 100, returnRate: 38, dominant: "Sukienki wieczorowe",  tag: "Black Friday" },
  { month: "Grudzień",   short: "Gru", index: 88,  returnRate: 42, dominant: "Sukienki koktajlowe",  tag: "Święta" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(ease * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtPLN(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency", currency: "PLN", maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n: number) {
  return new Intl.NumberFormat("pl-PL").format(n);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Pill({
  value,
  unit = "%",
  invert = false,
}: {
  value: number;
  unit?: string;
  invert?: boolean;
}) {
  const good = invert ? value < 0 : value > 0;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      fontFamily: "var(--font-barlow, sans-serif)",
      fontSize: 12,
      fontWeight: 700,
      padding: "2px 8px",
      borderRadius: 2,
      background: good ? OK_BG : NG_BG,
      color: good ? OK_FG : NG_FG,
      letterSpacing: "0.02em",
    }}>
      {value > 0 ? "↑" : "↓"} {Math.abs(value)}{unit}
    </span>
  );
}

function KPICard({
  label, value, unit, change, changeUnit = "%", changeSub,
  invertChange, benchmark,
}: {
  label: string;
  value: number;
  unit?: string;
  change: number;
  changeUnit?: string;
  changeSub?: string;
  invertChange?: boolean;
  benchmark?: { value: number; label: string };
}) {
  const animated = useCountUp(value);
  const aboveBench = benchmark ? value > benchmark.value : false;

  return (
    <div style={{
      background: SURF,
      border: `1px solid ${BORDER}`,
      padding: "24px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
    }}>
      <p style={{
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: MUTED,
        margin: "0 0 10px",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 38,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        color: NAVY,
        margin: "0 0 12px",
      }}>
        {unit === "PLN"
          ? fmtPLN(animated)
          : `${fmtNum(animated)}${unit ?? ""}`
        }
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Pill value={change} unit={changeUnit} invert={invertChange} />
        {changeSub && (
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 11,
            color: MUTED,
          }}>
            {changeSub}
          </span>
        )}
      </div>
      {benchmark && (
        <div style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: aboveBench ? "#dc2626" : "#16a34a",
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 12,
            color: aboveBench ? NG_FG : OK_FG,
            fontWeight: 600,
          }}>
            {benchmark.label}: {benchmark.value}%
            {" · "}{aboveBench ? "powyżej" : "poniżej"} benchmarku
          </span>
        </div>
      )}
    </div>
  );
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string; strokeDasharray?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: SURF,
      border: `1px solid ${BORDER}`,
      padding: "12px 16px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    }}>
      <p style={{
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: NAVY,
        margin: "0 0 10px",
      }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 4 }}>
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 12,
            color: MUTED,
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}>
            <span style={{ width: 14, height: 2, background: p.color, display: "inline-block" }} />
            {p.name}
          </span>
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 13,
            fontWeight: 700,
            color: NAVY,
          }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const PERIODS: { value: Period; label: string }[] = [
  { value: "30",  label: "Ostatnie 30 dni" },
  { value: "90",  label: "90 dni" },
  { value: "365", label: "12 miesięcy" },
];
const CATEGORIES: Category[] = ["Sukienki", "Bluzki", "Spodnie"];

export default function TransactionPulsePage() {
  const [period,       setPeriod]       = useState<Period>("365");
  const [category,     setCategory]     = useState<Category>("Sukienki");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const kpi     = KPI[period];
  const catData = CAT_DATA[period][category];

  const chartData = catData.labels.map((label, i) => ({
    label,
    "Twój sklep":         catData.seller[i],
    "Rynek (FashionHero)": catData.market[i],
  }));

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>

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
          {["FashionHero", "Seller Intelligence", "Transaction Pulse"].map((crumb, i, arr) => (
            <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: i === arr.length - 1 ? "#ffffff" : "rgba(255,255,255,0.35)",
                fontWeight: i === arr.length - 1 ? 600 : 400,
              }}>
                {crumb}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
              )}
            </span>
          ))}
        </div>
        <span style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.06em",
        }}>
          {SELLER_NAME}
        </span>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Section 1: Header + period selector + KPIs ── */}
        <div style={{ padding: "44px 0 36px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 32,
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: GOLD,
                margin: "0 0 10px",
              }}>
                Transaction Pulse · {SELLER_NAME}
              </p>
              <h1 style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: "clamp(30px, 4vw, 52px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                color: NAVY,
                margin: 0,
              }}>
                Przegląd sprzedaży
                <br />
                <span style={{ color: GOLD }}>i pozycji rynkowej</span>
              </h1>
            </div>

            {/* Period selector */}
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, overflow: "hidden", flexShrink: 0 }}>
              {PERIODS.map(({ value, label }, i) => (
                <button
                  key={value}
                  onClick={() => setPeriod(value)}
                  style={{
                    padding: "10px 20px",
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    border: "none",
                    borderRight: i < PERIODS.length - 1 ? `1px solid ${BORDER}` : "none",
                    background: period === value ? NAVY : SURF,
                    color: period === value ? "#ffffff" : MUTED,
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 12,
          }}>
            <KPICard
              label="GMV (po zwrotach)"
              value={kpi.gmv}
              unit="PLN"
              change={kpi.gmvChange}
              changeSub="vs poprzedni okres"
            />
            <KPICard
              label="Zamówienia"
              value={kpi.orders}
              change={kpi.ordersChange}
              changeSub="vs poprzedni okres"
            />
            <KPICard
              label="Return rate"
              value={kpi.returnRate}
              unit="%"
              change={kpi.returnRate - kpi.returnRateBenchmark}
              changeUnit="pp"
              changeSub="vs benchmark"
              invertChange
              benchmark={{ value: kpi.returnRateBenchmark, label: "Benchmark kat." }}
            />
            <KPICard
              label="Średnie zamówienie"
              value={kpi.avgOrder}
              unit=" PLN"
              change={kpi.avgOrderChange}
              changeSub="vs poprzedni okres"
            />
          </div>
        </div>

        {/* ── Section 2: Category chart ── */}
        <div style={{ padding: "40px 0", borderBottom: `1px solid ${BORDER}` }}>
          {/* Header row */}
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}>
            <div>
              <p style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
                margin: "0 0 6px",
              }}>
                Analiza kategorii
              </p>
              <h2 style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: NAVY,
                margin: 0,
              }}>
                Twoje kategorie vs. rynek
              </h2>
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", border: `1px solid ${BORDER}`, overflow: "hidden", flexShrink: 0 }}>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "9px 22px",
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                    border: "none",
                    borderRight: i < CATEGORIES.length - 1 ? `1px solid ${BORDER}` : "none",
                    background: category === cat ? GOLD : SURF,
                    color: category === cat ? "#ffffff" : MUTED,
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{
            background: SURF,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            padding: "20px 8px 12px",
            marginBottom: 20,
          }}>
            {/* Legend */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              paddingLeft: 16,
              marginBottom: 16,
              flexWrap: "wrap",
            }}>
              {[
                { label: "Twój sklep", color: NAVY, dashed: false },
                { label: "Rynek (FashionHero)", color: GOLD, dashed: true },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="28" height="10">
                    <line
                      x1="0" y1="5" x2="28" y2="5"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeDasharray={item.dashed ? "5 4" : undefined}
                    />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: MUTED,
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
              <span style={{
                marginLeft: "auto",
                marginRight: 16,
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 10,
                color: "#c4c4c4",
                letterSpacing: "0.06em",
              }}>
                Indeks względny (punkt startowy = 100)
              </span>
            </div>

            <ResponsiveContainer width="100%" height={290}>
              <LineChart data={chartData} margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f2f2f2" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: 11, fill: MUTED }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: 11, fill: MUTED }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="Twój sklep"
                  stroke={NAVY}
                  strokeWidth={2.5}
                  dot={{ fill: NAVY, r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 5.5, fill: NAVY, stroke: "#ffffff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="Rynek (FashionHero)"
                  stroke={GOLD}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ fill: GOLD, r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: GOLD, stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insight */}
          <div style={{
            borderLeft: `3px solid ${GOLD}`,
            background: `${NAVY}06`,
            padding: "16px 22px",
          }}>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 6px",
            }}>
              Automatyczny insight · {category}
            </p>
            <p style={{
              fontFamily: "var(--font-lora, serif)",
              fontSize: 14,
              lineHeight: 1.75,
              color: NAVY,
              margin: 0,
            }}>
              {catData.insight}
            </p>
          </div>
        </div>

        {/* ── Section 3: Seasonal heatmap ── */}
        <div style={{ padding: "40px 0 52px" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: MUTED,
              margin: "0 0 6px",
            }}>
              Sezonowość rynku
            </p>
            <h2 style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: NAVY,
              margin: "0 0 6px",
            }}>
              Okna sezonowe — kiedy rynek kupuje
            </h2>
            <p style={{
              fontFamily: "var(--font-lora, serif)",
              fontSize: 13,
              fontStyle: "italic",
              color: MUTED,
              margin: 0,
            }}>
              Intensywność = zagregowany indeks sprzedaży w kategorii Moda · FashionHero 2024–2025.
              Najedź kursorem, aby zobaczyć szczegóły.
            </p>
          </div>

          {/* Grid */}
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" as const }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 5,
              minWidth: 680,
            }}>
              {HEATMAP.map((data, i) => {
                const t      = data.index / 100;
                const alpha  = 0.07 + t * 0.85;
                const bg     = `rgba(26, 39, 68, ${alpha})`;
                const fg     = t > 0.55 ? "#ffffff" : NAVY;
                const isLeft = i <= 1;
                const isRight = i >= 10;

                return (
                  <div
                    key={i}
                    style={{ position: "relative" }}
                    onMouseEnter={() => setHoveredMonth(i)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <div style={{
                      background: bg,
                      padding: "18px 6px 14px",
                      textAlign: "center",
                      cursor: "default",
                      transition: "filter 0.1s",
                      filter: hoveredMonth === i ? "brightness(1.12)" : "none",
                      userSelect: "none",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-barlow, sans-serif)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: fg,
                        margin: "0 0 6px",
                      }}>
                        {data.short}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-barlow, sans-serif)",
                        fontSize: 20,
                        fontWeight: 700,
                        color: fg,
                        margin: 0,
                        lineHeight: 1,
                      }}>
                        {data.index}
                      </p>
                    </div>

                    {/* Tooltip */}
                    {hoveredMonth === i && (
                      <div style={{
                        position: "absolute",
                        bottom: "calc(100% + 9px)",
                        left: isLeft ? "0%" : isRight ? "auto" : "50%",
                        right: isRight ? "0%" : "auto",
                        transform: isLeft || isRight ? "none" : "translateX(-50%)",
                        background: NAVY,
                        padding: "14px 16px",
                        zIndex: 200,
                        boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                        minWidth: 210,
                        pointerEvents: "none",
                      }}>
                        <p style={{
                          fontFamily: "var(--font-barlow, sans-serif)",
                          fontSize: 13,
                          fontWeight: 700,
                          color: GOLD,
                          letterSpacing: "0.04em",
                          margin: "0 0 10px",
                        }}>
                          {data.month}
                          <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>
                            {" · "}{data.tag}
                          </span>
                        </p>
                        {[
                          { label: "Indeks sprzedaży", value: String(data.index) },
                          { label: "Śr. return rate",  value: `${data.returnRate}%` },
                          { label: "Top kategoria",    value: data.dominant },
                        ].map(({ label, value }) => (
                          <div key={label} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 16,
                            marginBottom: 5,
                          }}>
                            <span style={{
                              fontFamily: "var(--font-barlow, sans-serif)",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.45)",
                            }}>
                              {label}
                            </span>
                            <span style={{
                              fontFamily: "var(--font-barlow, sans-serif)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#ffffff",
                              textAlign: "right",
                            }}>
                              {value}
                            </span>
                          </div>
                        ))}
                        <div style={{
                          position: "absolute",
                          bottom: -6,
                          left: isLeft ? 20 : isRight ? "auto" : "50%",
                          right: isRight ? 20 : "auto",
                          transform: isLeft || isRight ? "none" : "translateX(-50%)",
                          width: 0, height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop: `6px solid ${NAVY}`,
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scale legend */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 14,
            flexWrap: "wrap",
          }}>
            <span style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.05em",
            }}>
              Intensywność:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 100,
                height: 8,
                background: `linear-gradient(to right, rgba(26,39,68,0.07), rgba(26,39,68,0.92))`,
              }} />
              <span style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 11,
                color: MUTED,
              }}>
                niski → wysoki
              </span>
            </div>
          </div>

          {/* Source line */}
          <div style={{
            marginTop: 36,
            paddingTop: 20,
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}>
            <p style={{
              fontFamily: "var(--font-lora, serif)",
              fontSize: 12,
              fontStyle: "italic",
              color: MUTED,
              margin: 0,
            }}>
              Dane z 60 mln PLN obrotu miesięcznie — FashionHero, 2024–2025
            </p>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#c4c4c4",
              margin: 0,
            }}>
              Ekskluzywne dane · Tylko dla sprzedawców FashionHero
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: NAVY,
        padding: "18px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.06em",
          margin: 0,
        }}>
          © 2026 FashionHero · Seller Intelligence · Dane odświeżane codziennie
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
          }} />
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
          }}>
            {SELLER_NAME} · aktywny
          </span>
        </div>
      </div>
    </div>
  );
}
