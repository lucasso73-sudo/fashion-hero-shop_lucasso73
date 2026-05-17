"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist-provider";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();

  const wishlistedProducts = products.filter((p) =>
    wishlistItems.includes(p.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-warm-gray mb-6">
        <Link href="/" className="hover:text-charcoal transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="uppercase tracking-[0.5px] text-charcoal">Wishlist</span>
      </div>

      <h1 className="text-3xl font-light text-charcoal mb-2">Wishlist</h1>
      <p className="text-sm text-warm-gray mb-10">
        {wishlistedProducts.length === 0
          ? "You haven't saved any items yet."
          : `${wishlistedProducts.length} saved item${wishlistedProducts.length === 1 ? "" : "s"}`}
      </p>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-warm-gray mb-6">
            Tap the heart icon on any product to save it here.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/collections/mens" className="btn-cta">
              SHOP MEN
            </Link>
            <Link href="/collections/womens" className="btn-cta-outline">
              SHOP WOMEN
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
