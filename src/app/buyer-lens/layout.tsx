import type { ReactNode } from "react";
import { DM_Serif_Display, DM_Sans } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export default function BuyerLensLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${dmSerif.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}
