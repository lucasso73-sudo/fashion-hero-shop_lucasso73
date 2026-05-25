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
  {
    id: 1,
    name: "Sukienka Midi Czarna",
    sku: "SMC-001",
    orders: 80,
    returns: 33,
    returnRate: 41,
    categoryAvg: 28,
    topReason: "Rozmiar — za mały",
    reasonPercent: 48,
  },
  {
    id: 2,
    name: "Sukienka Wrap Khaki",
    sku: "SWK-004",
    orders: 61,
    returns: 26,
    returnRate: 43,
    categoryAvg: 28,
    topReason: "Materiał inny niż oczekiwany",
    reasonPercent: 41,
  },
  {
    id: 3,
    name: "Bluzka Jedwabna Ecru",
    sku: "BJE-002",
    orders: 52,
    returns: 21,
    returnRate: 40,
    categoryAvg: 31,
    topReason: "Jakość wykonania",
    reasonPercent: 37,
  },
  {
    id: 4,
    name: "Bluzka Prążkowana Kremowa",
    sku: "BPK-003",
    orders: 74,
    returns: 16,
    returnRate: 22,
    categoryAvg: 31,
    topReason: "Zmiana decyzji",
    reasonPercent: 55,
  },
  {
    id: 5,
    name: "Sukienka Letnia Kwiatowa",
    sku: "SLK-007",
    orders: 42,
    returns: 11,
    returnRate: 26,
    categoryAvg: 28,
    topReason: "Rozmiar — za duży",
    reasonPercent: 44,
  },
  {
    id: 6,
    name: "Bluzka Koszulowa Biała",
    sku: "BKB-005",
    orders: 31,
    returns: 7,
    returnRate: 23,
    categoryAvg: 31,
    topReason: "Zmiana decyzji",
    reasonPercent: 61,
  },
];

const CATEGORY_RETURNS = [
  { reason: "Rozmiar — za mały", percent: 34 },
  { reason: "Materiał inny niż oczekiwany", percent: 22 },
  { reason: "Rozmiar — za duży", percent: 18 },
  { reason: "Jakość wykonania", percent: 14 },
  { reason: "Zmiana decyzji", percent: 8 },
  { reason: "Inne", percent: 4 },
];

const MARKET_SEGMENTS = [
  { segment: "TOP 10% sprzedawców", returnRate: 16, orders: "500+/mies.", badge: "elite" },
  { segment: "Mediana kategorii", returnRate: 28, orders: "150–500/mies.", badge: "median" },
  { segment: "Dolny kwartyl", returnRate: 47, orders: "<50/mies.", badge: "low" },
  { segment: "Twój sklep (Butik Monika)", returnRate: 37, orders: "113/mies.", badge: "you" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;
      setValue(decimals === 0 ? Math.floor(current) : parseFloat(current.toFixed(decimals)));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, decimals]);
  return value;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const RED = "#ff2d2d";
const GREEN = "#00ff87";
const DIM = "#3a3a3a";

function StatCard({
  label,
  value,
  unit,
  sub,
  accent,
}: {
  label: string;
  value: number;
  unit?: string;
  sub?: string;
  accent?: "red" | "green" | "neutral";
}) {
  const animated = useCountUp(value, 1400);
  const color = accent === "red" ? RED : accent === "green" ? GREEN : "#e8e8e8";
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        padding: "20px 24px",
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#666",
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-playfair, serif)",
          fontSize: 36,
          fontWeight: 700,
          color,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {animated}
        {unit && (
          <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 4, color: "#888" }}>
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: 11, color: "#555" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  const positive = diff > 0;
  const color = positive ? RED : GREEN;
  return (
    <span
      style={{
        fontFamily: "var(--font-jetbrains, monospace)",
        fontSize: 12,
        fontWeight: 600,
        color,
        background: `${color}14`,
        border: `1px solid ${color}40`,
        padding: "2px 7px",
        display: "inline-block",
        letterSpacing: "0.03em",
      }}
    >
      {positive ? "+" : ""}
      {diff}pp
    </span>
  );
}

function ProductRow({ product, idx }: { product: (typeof MY_PRODUCTS)[0]; idx: number }) {
  const diff = product.returnRate - product.categoryAvg;
  const aboveAvg = diff > 0;

  return (
    <tr
      style={{
        borderBottom: "1px solid #1e1e1e",
        background: aboveAvg ? "rgba(255,45,45,0.03)" : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = "#1a1a1a";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLTableRowElement).style.background = aboveAvg
          ? "rgba(255,45,45,0.03)"
          : "transparent";
      }}
    >
      <td
        style={{
          padding: "14px 16px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: 11,
          color: "#444",
          width: 28,
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontFamily: "var(--font-playfair, serif)",
            fontSize: 14,
            fontWeight: 600,
            color: "#e8e8e8",
            marginBottom: 2,
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#555",
            letterSpacing: "0.05em",
          }}
        >
          SKU {product.sku} · {product.orders} zam.
        </div>
      </td>
      <td
        style={{
          padding: "14px 16px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: 20,
          fontWeight: 600,
          color: aboveAvg ? RED : GREEN,
          textAlign: "right",
          whiteSpace: "nowrap",
        }}
      >
        {product.returnRate}%
      </td>
      <td
        style={{
          padding: "14px 16px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: 14,
          color: "#666",
          textAlign: "right",
        }}
      >
        {product.categoryAvg}%
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <DiffBadge diff={diff} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 11,
            color: aboveAvg ? "#ff8080" : "#aaa",
            marginBottom: 4,
          }}
        >
          {product.topReason}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              height: 3,
              width: 80,
              background: "#2a2a2a",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${product.reasonPercent}%`,
                background: aboveAvg ? RED : GREEN,
                transition: "width 1s ease",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              color: "#666",
            }}
          >
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

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { value: number; payload: { reason: string } }[];
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: "#1a1a1a",
          border: "1px solid #333",
          padding: "10px 14px",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: 12,
        }}
      >
        <p style={{ color: "#aaa", marginBottom: 4, fontSize: 10 }}>{payload[0].payload.reason}</p>
        <p style={{ color: "#00ff87", fontWeight: 600 }}>{payload[0].value}%</p>
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
            tick={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              fill: "#555",
            }}
            tickFormatter={(v) => `${v}%`}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="reason"
            width={200}
            tick={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 11,
              fill: "#888",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="percent" radius={0} isAnimationActive={animated} animationDuration={900}>
            {CATEGORY_RETURNS.map((entry, i) => (
              <Cell
                key={i}
                fill={i === 0 ? RED : i === 2 ? "#ff7a00" : "#2a6e52"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid #1e1e1e",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 11,
            color: "#555",
          }}
        >
          Na podstawie{" "}
          <span style={{ color: "#888" }}>47 200</span> zwrotów w kategorii{" "}
          <span style={{ color: "#888" }}>Sukienki</span> — ostatnie 90 dni
        </p>
        <span
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#333",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          FashionHero · Ekskluzywne dane
        </span>
      </div>
    </div>
  );
}

function MarketView() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#555",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Benchmark kategorii · Sukienki · ostatnie 90 dni
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
              {["Segment rynku", "Return rate", "Wolumen", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 16px",
                    textAlign: h === "Segment rynku" ? "left" : "right",
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: 10,
                    color: "#444",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MARKET_SEGMENTS.map((row) => {
              const isYou = row.badge === "you";
              const color =
                row.badge === "elite"
                  ? GREEN
                  : row.badge === "you"
                    ? "#ffcc00"
                    : row.badge === "low"
                      ? RED
                      : "#888";
              return (
                <tr
                  key={row.segment}
                  style={{
                    borderBottom: "1px solid #1a1a1a",
                    background: isYou ? "rgba(255,204,0,0.04)" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: isYou
                        ? "var(--font-playfair, serif)"
                        : "var(--font-jetbrains, monospace)",
                      fontSize: isYou ? 14 : 12,
                      fontWeight: isYou ? 600 : 400,
                      color: isYou ? "#ffcc00" : "#888",
                    }}
                  >
                    {row.segment}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: 20,
                      fontWeight: 600,
                      color,
                      textAlign: "right",
                    }}
                  >
                    {row.returnRate}%
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: 12,
                      color: "#555",
                      textAlign: "right",
                    }}
                  >
                    {row.orders}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    {isYou && (
                      <span
                        style={{
                          fontFamily: "var(--font-jetbrains, monospace)",
                          fontSize: 10,
                          color: "#ffcc00",
                          border: "1px solid #ffcc0040",
                          padding: "2px 8px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
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

      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          padding: "24px",
          marginBottom: 32,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#555",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Powody zwrotów · cały rynek · Sukienki
        </p>
        <CategoryChart />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1,
          background: "#1e1e1e",
        }}
      >
        {[
          { label: "Sprzedawców w kategorii", value: "847" },
          { label: "Łączne zwroty (90 dni)", value: "47 200" },
          { label: "Śr. return rate", value: "28%" },
          { label: "Najczęstszy powód", value: "Rozmiar" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#0f0f0f", padding: "20px 24px" }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {item.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-playfair, serif)",
                fontSize: 24,
                fontWeight: 700,
                color: "#e8e8e8",
              }}
            >
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

  const sortedProducts = [...MY_PRODUCTS].sort(
    (a, b) => b.returnRate - a.returnRate
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#e8e8e8",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 44,
          background: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              color: "#444",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            FashionHero
          </span>
          <span style={{ color: "#2a2a2a", fontSize: 12 }}>/</span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Seller Intelligence
          </span>
          <span style={{ color: "#2a2a2a", fontSize: 12 }}>/</span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              color: "#888",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Return Intelligence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "var(--font-jetbrains, monospace)",
              fontSize: 10,
              color: "#444",
            }}
          >
            {SELLER.name}
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: GREEN,
              boxShadow: `0 0 6px ${GREEN}`,
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Header ── */}
        <div
          style={{
            padding: "48px 0 36px",
            borderBottom: "1px solid #1e1e1e",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: 10,
                color: "#555",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Moduł · Return Intelligence · {SELLER.period}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair, serif)",
                fontSize: "clamp(24px, 4vw, 40px)",
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#f0f0f0",
                margin: 0,
                marginBottom: 16,
              }}
            >
              Widzisz powody zwrotów{" "}
              <span style={{ color: RED }}>2.4&nbsp;mln</span> kupujących.
              <br />
              <span style={{ color: "#555", fontWeight: 400 }}>Forte tego nie ma.</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: 12,
                color: "#555",
                lineHeight: 1.6,
                maxWidth: 500,
              }}
            >
              Dane agregowane z całego FashionHero marketplace — w czasie rzeczywistym.
              Żaden inny kanał sprzedaży nie daje Ci tego wglądu.
            </p>
          </div>

          {/* Switcher */}
          <div
            style={{
              display: "flex",
              border: "1px solid #2a2a2a",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {(["mine", "market"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "10px 24px",
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  border: "none",
                  borderRight: v === "mine" ? "1px solid #2a2a2a" : "none",
                  transition: "all 0.15s",
                  background: view === v ? "#f0f0f0" : "transparent",
                  color: view === v ? "#0f0f0f" : "#555",
                  fontWeight: view === v ? 600 : 400,
                }}
              >
                {v === "mine" ? "Mój sklep" : "Rynek"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 1,
            background: "#1e1e1e",
            margin: "32px 0",
          }}
        >
          <StatCard
            label="Zamówienia (90 dni)"
            value={SELLER.totalOrders}
            sub={`Sklep: ${SELLER.name}`}
          />
          <StatCard
            label="Zwroty łącznie"
            value={SELLER.totalReturns}
            sub="w analizowanym okresie"
          />
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
            <div style={{ marginBottom: 48 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-playfair, serif)",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#e8e8e8",
                    margin: 0,
                  }}
                >
                  Twoje produkty vs. rynek
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: 10,
                    color: "#444",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Posortowane wg return rate ↓
                </p>
              </div>

              <div style={{ border: "1px solid #1e1e1e", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #2a2a2a", background: "#111" }}>
                      {[
                        { label: "#", align: "left" },
                        { label: "Produkt", align: "left" },
                        { label: "Mój rate", align: "right" },
                        { label: "Śr. kat.", align: "right" },
                        { label: "Różnica", align: "center" },
                        { label: "Główny powód zwrotów", align: "left" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          style={{
                            padding: "10px 16px",
                            textAlign: col.align as "left" | "right" | "center",
                            fontFamily: "var(--font-jetbrains, monospace)",
                            fontSize: 10,
                            color: "#444",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: 500,
                          }}
                        >
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

              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, background: RED }} />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: 10,
                      color: "#555",
                    }}
                  >
                    Powyżej średniej kategorii
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, background: GREEN }} />
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: 10,
                      color: "#555",
                    }}
                  >
                    Poniżej średniej kategorii
                  </span>
                </div>
              </div>
            </div>

            {/* Category chart */}
            <div
              style={{
                background: "#161616",
                border: "1px solid #2a2a2a",
                padding: "28px 24px",
                marginBottom: 48,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-jetbrains, monospace)",
                      fontSize: 10,
                      color: "#555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Dane rynkowe
                  </p>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair, serif)",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#e8e8e8",
                      margin: 0,
                    }}
                  >
                    Co mówią kupujące w tej kategorii
                  </h2>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains, monospace)",
                    fontSize: 10,
                    color: "#333",
                    border: "1px solid #222",
                    padding: "4px 10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Sukienki · 47 200 zwrotów
                </span>
              </div>
              <CategoryChart />
            </div>
          </>
        ) : (
          <div style={{ paddingBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair, serif)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#e8e8e8",
                  margin: "0 0 4px",
                }}
              >
                Benchmark rynkowy — kategoria Sukienki
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-jetbrains, monospace)",
                  fontSize: 11,
                  color: "#555",
                }}
              >
                Dane agregowane z 847 sklepów · FashionHero · ostatnie 90 dni
              </p>
            </div>
            <MarketView />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          background: "#0a0a0a",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#333",
            letterSpacing: "0.06em",
          }}
        >
          © 2026 FashionHero · Seller Intelligence · Dane odświeżane co 24h
        </p>
        <p
          style={{
            fontFamily: "var(--font-jetbrains, monospace)",
            fontSize: 10,
            color: "#2a2a2a",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Dane poufne · Tylko dla sprzedawców FashionHero
        </p>
      </div>
    </div>
  );
}
