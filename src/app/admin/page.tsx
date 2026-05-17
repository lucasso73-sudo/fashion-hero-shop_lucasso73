import { getAllSellers } from "@/data/sellers";
import { sellerStats } from "@/data/seller-stats";
import { cn } from "@/lib/utils";

function fmt(n: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(n);
}

function ChangeChip({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs text-gray-400">nowy</span>;
  }
  const positive = value > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        positive ? "text-emerald-600" : "text-red-500"
      )}
    >
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default function AdminPage() {
  const sellers = getAllSellers();

  const rows = sellers.map((seller) => {
    const stats = sellerStats.find((s) => s.sellerId === seller.id);
    return { seller, stats };
  });

  const totalRevenue = sellerStats.reduce((s, x) => s + x.lastMonthRevenue, 0);
  const totalTx = sellerStats.reduce((s, x) => s + x.lastMonthTransactions, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-charcoal">Panel administratora</h1>
          <p className="text-sm text-gray-500 mt-1">
            Zestawienie sprzedawców FashionHero — dane za ostatni miesiąc (kwiecień 2026)
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-black/8 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sprzedawcy</p>
            <p className="text-3xl font-semibold text-charcoal">{sellers.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-black/8 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Obroty (mies.)</p>
            <p className="text-3xl font-semibold text-charcoal">{fmt(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-xl border border-black/8 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transakcje (mies.)</p>
            <p className="text-3xl font-semibold text-charcoal">{totalTx}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-black/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/8 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 w-8">#</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Sprzedawca</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hidden sm:table-cell">Ocena</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Obroty</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Zmiana</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Transakcje</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 hidden md:table-cell">Zmiana</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Śr. zamówienie</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 hidden lg:table-cell">Dołączył</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .sort((a, b) => (b.stats?.lastMonthRevenue ?? 0) - (a.stats?.lastMonthRevenue ?? 0))
                  .map(({ seller, stats }, i) => (
                    <tr
                      key={seller.id}
                      className="border-b border-black/5 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-gray-400 tabular-nums">{i + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-charcoal">{seller.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate hidden sm:block">
                          {seller.description}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        {seller.rating > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="text-amber-400">★</span>
                            <span className="font-medium">{seller.rating.toFixed(1)}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">brak ocen</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-medium">
                        {stats ? fmt(stats.lastMonthRevenue) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell">
                        {stats ? <ChangeChip value={stats.revenueChange} /> : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums">
                        {stats?.lastMonthTransactions ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell">
                        {stats ? <ChangeChip value={stats.transactionsChange} /> : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums hidden lg:table-cell text-gray-600">
                        {stats ? fmt(stats.avgOrderValue) : "—"}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                        {seller.joinedYear}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
