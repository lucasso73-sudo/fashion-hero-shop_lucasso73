export interface SellerStats {
  sellerId: string;
  lastMonthRevenue: number;
  lastMonthTransactions: number;
  avgOrderValue: number;
  revenueChange: number; // percent vs previous month
  transactionsChange: number;
}

export const sellerStats: SellerStats[] = [
  {
    sellerId: "s1",
    lastMonthRevenue: 48720,
    lastMonthTransactions: 102,
    avgOrderValue: 477.6,
    revenueChange: 12.4,
    transactionsChange: 8.1,
  },
  {
    sellerId: "s2",
    lastMonthRevenue: 63450,
    lastMonthTransactions: 134,
    avgOrderValue: 473.5,
    revenueChange: 5.2,
    transactionsChange: 3.8,
  },
  {
    sellerId: "s3",
    lastMonthRevenue: 37890,
    lastMonthTransactions: 89,
    avgOrderValue: 425.7,
    revenueChange: -3.1,
    transactionsChange: -5.4,
  },
  {
    sellerId: "s4",
    lastMonthRevenue: 82310,
    lastMonthTransactions: 217,
    avgOrderValue: 379.3,
    revenueChange: 21.7,
    transactionsChange: 18.9,
  },
  {
    sellerId: "s5",
    lastMonthRevenue: 29640,
    lastMonthTransactions: 58,
    avgOrderValue: 511.0,
    revenueChange: -8.6,
    transactionsChange: -10.2,
  },
  {
    sellerId: "s6",
    lastMonthRevenue: 54180,
    lastMonthTransactions: 121,
    avgOrderValue: 447.8,
    revenueChange: 31.5,
    transactionsChange: 27.3,
  },
  {
    sellerId: "s7",
    lastMonthRevenue: 22750,
    lastMonthTransactions: 63,
    avgOrderValue: 361.1,
    revenueChange: 1.4,
    transactionsChange: 2.9,
  },
  {
    sellerId: "s8",
    lastMonthRevenue: 9840,
    lastMonthTransactions: 24,
    avgOrderValue: 410.0,
    revenueChange: 44.2,
    transactionsChange: 33.3,
  },
  {
    sellerId: "s9",
    lastMonthRevenue: 7320,
    lastMonthTransactions: 19,
    avgOrderValue: 385.3,
    revenueChange: -14.0,
    transactionsChange: -17.4,
  },
  {
    sellerId: "s10",
    lastMonthRevenue: 18560,
    lastMonthTransactions: 61,
    avgOrderValue: 304.3,
    revenueChange: 6.8,
    transactionsChange: 4.1,
  },
  {
    sellerId: "s11",
    lastMonthRevenue: 4210,
    lastMonthTransactions: 11,
    avgOrderValue: 382.7,
    revenueChange: 0,
    transactionsChange: 0,
  },
  {
    sellerId: "s12",
    lastMonthRevenue: 1340,
    lastMonthTransactions: 4,
    avgOrderValue: 335.0,
    revenueChange: 0,
    transactionsChange: 0,
  },
];

export function getSellerStats(sellerId: string): SellerStats | undefined {
  return sellerStats.find((s) => s.sellerId === sellerId);
}
