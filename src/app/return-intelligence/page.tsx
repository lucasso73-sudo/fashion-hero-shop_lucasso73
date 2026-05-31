"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Design tokens (Transaction Pulse palette) ──────────────────────────────────

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

// ── Mock data ─────────────────────────────────────────────────────────────────

const SELLER = {
  name: "Butik Monika",
  category: "Sukienki",
  period: "ostatnie 90 dni",
  totalOrders: 340,
  totalReturns: 127,
  returnRate: 37,
  categoryAvg: 28,
};

const MY_PRODUCTS = [
  { id: 1, name: "Sukienka Midi Czarna",      sku: "SMC-001", orders: 80, returns: 33, returnRate: 41, categoryAvg: 28, topReason: "Rozmiar — za mały",              reasonPercent: 48 },
  { id: 2, name: "Sukienka Wrap Khaki",        sku: "SWK-004", orders: 61, returns: 26, returnRate: 43, categoryAvg: 28, topReason: "Materiał inny niż oczekiwany",   reasonPercent: 41 },
  { id: 3, name: "Bluzka Jedwabna Ecru",       sku: "BJE-002", orders: 52, returns: 21, returnRate: 40, categoryAvg: 31, topReason: "Jakość wykonania",                reasonPercent: 37 },
  { id: 4, name: "Bluzka Prążkowana Kremowa",  sku: "BPK-003", orders: 74, returns: 16, returnRate: 22, categoryAvg: 31, topReason: "Zmiana decyzji",                  reasonPercent: 55 },
  { id: 5, name: "Sukienka Letnia Kwiatowa",   sku: "SLK-007", orders: 42, returns: 11, returnRate: 26, categoryAvg: 28, topReason: "Rozmiar — za duży",               reasonPercent: 44 },
  { id: 6, name: "Bluzka Koszulowa Biała",     sku: "BKB-005", orders: 31, returns:  7, returnRate: 23, categoryAvg: 31, topReason: "Zmiana decyzji",                  reasonPercent: 61 },
];

const CATEGORY_RETURNS = [
  { reason: "Rozmiar — za mały",              percent: 34 },
  { reason: "Materiał inny niż oczekiwany",   percent: 22 },
  { reason: "Rozmiar — za duży",              percent: 18 },
  { reason: "Jakość wykonania",               percent: 14 },
  { reason: "Zmiana decyzji",                 percent:  8 },
  { reason: "Inne",                           percent:  4 },
];

const MARKET_SEGMENTS = [
  { segment: "TOP 10% sprzedawców",       returnRate: 16, orders: "500+/mies.",    badge: "elite"  },
  { segment: "Mediana kategorii",         returnRate: 28, orders: "150–500/mies.", badge: "median" },
  { segment: "Dolny kwartyl",             returnRate: 47, orders: "<50/mies.",     badge: "low"    },
  { segment: "Twój sklep (Butik Monika)", returnRate: 37, orders: "113/mies.",     badge: "you"    },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, sub, accent }: {
  label: string; value: number; unit?: string; sub?: string;
  accent?: "red" | "green" | "neutral";
}) {
  const animated = useCountUp(value);
  const valueColor = accent === "red" ? NG_FG : accent === "green" ? OK_FG : NAVY;
  return (
    <div style={{
      background: SURF,
      border: `1px solid ${BORDER}`,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      minWidth: 0,
    }}>
      <p style={{
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: MUTED,
        margin: "0 0 8px",
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 36,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        color: valueColor,
        margin: "0 0 6px",
      }}>
        {animated}
        {unit && (
          <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 4, color: MUTED }}>
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 11,
          color: MUTED,
          margin: 0,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  const bad = diff > 0;
  return (
    <span style={{
      fontFamily: "var(--font-barlow, sans-serif)",
      fontSize: 12,
      fontWeight: 700,
      color: bad ? NG_FG : OK_FG,
      background: bad ? NG_BG : OK_BG,
      padding: "2px 8px",
      borderRadius: 2,
      display: "inline-block",
      letterSpacing: "0.02em",
    }}>
      {diff > 0 ? "+" : ""}{diff}pp
    </span>
  );
}

function ProductRow({ product, idx }: { product: typeof MY_PRODUCTS[0]; idx: number }) {
  const diff = product.returnRate - product.categoryAvg;
  const aboveAvg = diff > 0;

  return (
    <tr
      style={{
        borderBottom: `1px solid ${BORDER}`,
        background: aboveAvg ? `${NG_BG}80` : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#f3f4f6"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = aboveAvg ? `${NG_BG}80` : "transparent"; }}
    >
      <td style={{
        padding: "13px 16px",
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 11,
        color: MUTED,
        width: 28,
      }}>
        {String(idx + 1).padStart(2, "0")}
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 14,
          fontWeight: 600,
          color: TEXT,
          marginBottom: 2,
        }}>
          {product.name}
        </div>
        <div style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          color: MUTED,
          letterSpacing: "0.05em",
        }}>
          SKU {product.sku} · {product.orders} zam.
        </div>
      </td>
      <td style={{
        padding: "13px 16px",
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 20,
        fontWeight: 700,
        color: aboveAvg ? NG_FG : OK_FG,
        textAlign: "right",
        whiteSpace: "nowrap",
      }}>
        {product.returnRate}%
      </td>
      <td style={{
        padding: "13px 16px",
        fontFamily: "var(--font-barlow, sans-serif)",
        fontSize: 14,
        color: MUTED,
        textAlign: "right",
      }}>
        {product.categoryAvg}%
      </td>
      <td style={{ padding: "13px 16px", textAlign: "center" }}>
        <DiffBadge diff={diff} />
      </td>
      <td style={{ padding: "13px 16px" }}>
        <div style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 11,
          color: aboveAvg ? NG_FG : MUTED,
          marginBottom: 5,
        }}>
          {product.topReason}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            height: 4,
            width: 80,
            background: BORDER,
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
          }}>
            <div style={{
              position: "absolute",
              inset: 0,
              width: `${product.reasonPercent}%`,
              background: aboveAvg ? NG_FG : OK_FG,
              borderRadius: 2,
            }} />
          </div>
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 10,
            color: MUTED,
          }}>
            {product.reasonPercent}%
          </span>
        </div>
      </td>
    </tr>
  );
}

function CategoryChart() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const barColors = [NG_FG, NAVY, "#b45309", OK_FG, MUTED, "#9ca3af"];

  const ChartTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: { value: number; payload: { reason: string } }[];
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: SURF,
        border: `1px solid ${BORDER}`,
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          color: MUTED,
          letterSpacing: "0.06em",
          margin: "0 0 4px",
        }}>
          {payload[0].payload.reason}
        </p>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 16,
          fontWeight: 700,
          color: NAVY,
          margin: 0,
        }}>
          {payload[0].value}%
        </p>
      </div>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={CATEGORY_RETURNS}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 40]}
            tick={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: 11, fill: MUTED }}
            tickFormatter={(v) => `${v}%`}
            axisLine={{ stroke: BORDER }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="reason"
            width={210}
            tick={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: 11, fill: MUTED }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="percent" radius={2} isAnimationActive={animated} animationDuration={900}>
            {CATEGORY_RETURNS.map((_, i) => (
              <Cell key={i} fill={barColors[i] ?? NAVY} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        paddingTop: 16,
        borderTop: `1px solid ${BORDER}`,
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
          Na podstawie <strong style={{ fontStyle: "normal", color: TEXT }}>47 200</strong> zwrotów
          w kategorii <strong style={{ fontStyle: "normal", color: TEXT }}>Sukienki</strong> — ostatnie 90 dni
        </p>
        <span style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          color: "#c4c4c4",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          FashionHero · Ekskluzywne dane
        </span>
      </div>
    </div>
  );
}

function MarketView() {
  const badgeColor = (badge: string) =>
    badge === "elite" ? OK_FG
    : badge === "you"  ? GOLD
    : badge === "low"  ? NG_FG
    : MUTED;

  return (
    <div>
      {/* Market benchmark table */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "0 0 12px",
        }}>
          Benchmark kategorii · Sukienki · ostatnie 90 dni
        </p>
        <div style={{ border: `1px solid ${BORDER}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: `1px solid ${BORDER}` }}>
                {["Segment rynku", "Return rate", "Wolumen", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 16px",
                    textAlign: i === 0 ? "left" : "right",
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: MUTED,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MARKET_SEGMENTS.map((row) => {
                const isYou = row.badge === "you";
                const color = badgeColor(row.badge);
                return (
                  <tr key={row.segment} style={{
                    borderBottom: `1px solid ${BORDER}`,
                    background: isYou ? `${GOLD}12` : "transparent",
                  }}>
                    <td style={{
                      padding: "13px 16px",
                      fontFamily: "var(--font-barlow, sans-serif)",
                      fontSize: isYou ? 14 : 13,
                      fontWeight: isYou ? 700 : 400,
                      color: isYou ? NAVY : MUTED,
                    }}>
                      {row.segment}
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontFamily: "var(--font-barlow, sans-serif)",
                      fontSize: 20,
                      fontWeight: 700,
                      color,
                      textAlign: "right",
                    }}>
                      {row.returnRate}%
                    </td>
                    <td style={{
                      padding: "13px 16px",
                      fontFamily: "var(--font-barlow, sans-serif)",
                      fontSize: 12,
                      color: MUTED,
                      textAlign: "right",
                    }}>
                      {row.orders}
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      {isYou && (
                        <span style={{
                          fontFamily: "var(--font-barlow, sans-serif)",
                          fontSize: 10,
                          fontWeight: 700,
                          color: GOLD,
                          border: `1px solid ${GOLD}60`,
                          padding: "2px 8px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          borderRadius: 2,
                        }}>
                          Ty
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category chart */}
      <div style={{
        background: SURF,
        border: `1px solid ${BORDER}`,
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        marginBottom: 28,
      }}>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "0 0 16px",
        }}>
          Powody zwrotów · cały rynek · Sukienki
        </p>
        <CategoryChart />
      </div>

      {/* Market stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
      }}>
        {[
          { label: "Sprzedawców w kategorii", value: "847" },
          { label: "Łączne zwroty (90 dni)",  value: "47 200" },
          { label: "Śr. return rate",          value: "28%" },
          { label: "Najczęstszy powód",        value: "Rozmiar" },
        ].map((item) => (
          <div key={item.label} style={{
            background: SURF,
            border: `1px solid ${BORDER}`,
            padding: "20px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: MUTED,
              margin: "0 0 8px",
            }}>
              {item.label}
            </p>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: NAVY,
              margin: 0,
            }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function ReturnIntelligencePage() {
  const [view, setView] = useState<"mine" | "market">("mine");

  const sortedProducts = [...MY_PRODUCTS].sort((a, b) => b.returnRate - a.returnRate);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT }}>

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
          {["FashionHero", "Seller Intelligence", "Return Intelligence"].map((crumb, i, arr) => (
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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "var(--font-barlow, sans-serif)",
            fontSize: 11,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.06em",
          }}>
            {SELLER.name}
          </span>
          <div style={{
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
          }} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Header ── */}
        <div style={{
          padding: "44px 0 36px",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
        }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: GOLD,
              margin: "0 0 10px",
            }}>
              Return Intelligence · {SELLER.name} · {SELLER.period}
            </p>
            <h1 style={{
              fontFamily: "var(--font-barlow, sans-serif)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: NAVY,
              margin: "0 0 14px",
            }}>
              Widzisz powody zwrotów{" "}
              <span style={{ color: NG_FG }}>2.4&nbsp;mln</span> kupujących.
              <br />
              <span style={{ color: MUTED, fontWeight: 400 }}>Forte tego nie ma.</span>
            </h1>
            <p style={{
              fontFamily: "var(--font-lora, serif)",
              fontSize: 14,
              fontStyle: "italic",
              color: MUTED,
              lineHeight: 1.65,
              maxWidth: 500,
              margin: 0,
            }}>
              Dane agregowane z całego FashionHero marketplace.
              Żaden inny kanał sprzedaży nie daje Ci tego wglądu.
            </p>
          </div>

          {/* Switcher */}
          <div style={{
            display: "flex",
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
            flexShrink: 0,
          }}>
            {(["mine", "market"] as const).map((v, i) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "10px 24px",
                  fontFamily: "var(--font-barlow, sans-serif)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  border: "none",
                  borderRight: i === 0 ? `1px solid ${BORDER}` : "none",
                  transition: "background 0.12s, color 0.12s",
                  background: view === v ? NAVY : SURF,
                  color: view === v ? "#ffffff" : MUTED,
                }}
              >
                {v === "mine" ? "Mój sklep" : "Rynek"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          margin: "32px 0",
        }}>
          <StatCard label="Zamówienia (90 dni)" value={SELLER.totalOrders} sub={`Sklep: ${SELLER.name}`} />
          <StatCard label="Zwroty łącznie" value={SELLER.totalReturns} sub="w analizowanym okresie" />
          <StatCard
            label="Twój return rate"
            value={SELLER.returnRate}
            unit="%"
            sub={`+${SELLER.returnRate - SELLER.categoryAvg}pp vs. kategoria`}
            accent="red"
          />
          <StatCard
            label="Średnia kategorii"
            value={SELLER.categoryAvg}
            unit="%"
            sub="Sukienki · FashionHero"
            accent="green"
          />
        </div>

        {/* ── Main content ── */}
        {view === "mine" ? (
          <>
            {/* Products table */}
            <div style={{ marginBottom: 40 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 8,
              }}>
                <h2 style={{
                  fontFamily: "var(--font-barlow, sans-serif)",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: NAVY,
                  margin: 0,
                }}>
                  Twoje produkty vs. rynek
                </h2>
                <p style={{
                  fontFamily: "var(--font-barlow, sans-serif)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: MUTED,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  Posortowane wg return rate ↓
                </p>
              </div>

              <div style={{ border: `1px solid ${BORDER}`, overflowX: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}`, background: "#f9fafb" }}>
                      {[
                        { label: "#",                       align: "left"   },
                        { label: "Produkt",                 align: "left"   },
                        { label: "Mój rate",                align: "right"  },
                        { label: "Śr. kat.",                align: "right"  },
                        { label: "Różnica",                 align: "center" },
                        { label: "Główny powód zwrotów",    align: "left"   },
                      ].map((col) => (
                        <th key={col.label} style={{
                          padding: "10px 16px",
                          textAlign: col.align as "left" | "right" | "center",
                          fontFamily: "var(--font-barlow, sans-serif)",
                          fontSize: 10,
                          fontWeight: 700,
                          color: MUTED,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product, idx) => (
                      <ProductRow key={product.id} product={product} idx={idx} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
                {[
                  { color: NG_BG, border: NG_FG, label: "Powyżej średniej kategorii" },
                  { color: OK_BG, border: OK_FG, label: "Poniżej średniej kategorii" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: item.color, border: `1px solid ${item.border}`, borderRadius: 2 }} />
                    <span style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: 11, color: MUTED }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category chart section */}
            <div style={{
              background: SURF,
              border: `1px solid ${BORDER}`,
              padding: "28px 24px",
              marginBottom: 48,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 8,
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: MUTED,
                    margin: "0 0 6px",
                  }}>
                    Dane rynkowe
                  </p>
                  <h2 style={{
                    fontFamily: "var(--font-barlow, sans-serif)",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: NAVY,
                    margin: 0,
                  }}>
                    Co mówią kupujące w tej kategorii
                  </h2>
                </div>
                <span style={{
                  fontFamily: "var(--font-barlow, sans-serif)",
                  fontSize: 10,
                  fontWeight: 600,
                  color: MUTED,
                  border: `1px solid ${BORDER}`,
                  padding: "4px 10px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  borderRadius: 2,
                }}>
                  Sukienki · 47 200 zwrotów
                </span>
              </div>
              <CategoryChart />
            </div>
          </>
        ) : (
          <div style={{ paddingBottom: 48 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{
                fontFamily: "var(--font-barlow, sans-serif)",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: NAVY,
                margin: "0 0 4px",
              }}>
                Benchmark rynkowy — kategoria Sukienki
              </h2>
              <p style={{
                fontFamily: "var(--font-lora, serif)",
                fontSize: 13,
                fontStyle: "italic",
                color: MUTED,
                margin: 0,
              }}>
                Dane agregowane z 847 sklepów · FashionHero · ostatnie 90 dni
              </p>
            </div>
            <MarketView />
          </div>
        )}
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
          © 2026 FashionHero · Seller Intelligence · Dane odświeżane co 24h
        </p>
        <p style={{
          fontFamily: "var(--font-barlow, sans-serif)",
          fontSize: 10,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Dane poufne · Tylko dla sprzedawców FashionHero
        </p>
      </div>
    </div>
  );
}
