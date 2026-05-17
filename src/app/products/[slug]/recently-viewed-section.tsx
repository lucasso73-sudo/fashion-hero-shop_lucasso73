"use client";

import { useEffect } from "react";
import { RecentlyViewed, trackRecentlyViewed } from "@/components/recently-viewed";

export function RecentlyViewedSection({ productId }: { productId: string }) {
  useEffect(() => {
    trackRecentlyViewed(productId);
  }, [productId]);

  return <RecentlyViewed currentProductId={productId} />;
}
