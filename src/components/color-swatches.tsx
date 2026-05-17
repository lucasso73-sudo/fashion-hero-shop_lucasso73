"use client";

import { cn } from "@/lib/utils";
import type { ProductColor } from "@/types";

interface ColorSwatchesProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelect: (color: ProductColor) => void;
}

export function ColorSwatches({ colors, selectedColor, onSelect }: ColorSwatchesProps) {
  return (
    <div>
      <div className="flex gap-2 mb-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onSelect(color)}
            aria-label={color.name}
            className={cn(
              "w-8 h-8 rounded-full border transition-all",
              selectedColor.hex === color.hex
                ? "ring-2 ring-charcoal ring-offset-2 ring-offset-cream border-transparent"
                : "border-black/10 hover:border-black/30"
            )}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
      <p className="text-xs text-warm-gray">{selectedColor.name}</p>
    </div>
  );
}
