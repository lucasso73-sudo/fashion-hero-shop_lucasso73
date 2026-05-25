import type { ReactNode } from "react";
import { Barlow_Condensed, Lora } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

export default function TransactionPulseLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${barlow.variable} ${lora.variable}`}>
      {children}
    </div>
  );
}
