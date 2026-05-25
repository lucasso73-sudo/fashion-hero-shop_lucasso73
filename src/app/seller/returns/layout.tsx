import type { ReactNode } from "react";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});

export default function ReturnIntelligenceLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${playfair.variable} ${jetbrains.variable}`}>
      {children}
    </div>
  );
}
