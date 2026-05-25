import Link from "next/link";

export function ReferralBanner() {
  return (
    <section className="bg-charcoal text-white py-16 px-4">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-white/50">
          Referral Program
        </p>
        <h2 className="text-3xl sm:text-4xl font-normal leading-tight">
          Love FashionHero?<br />Share it with a friend.
        </h2>
        <p className="text-white/70 text-base leading-relaxed max-w-md">
          Recommend our shop to someone new and earn{" "}
          <span className="text-white font-semibold">10% off</span> your next order — automatically.
        </p>
        <Link
          href="/referral"
          className="mt-2 inline-flex items-center justify-center bg-white text-charcoal text-sm font-semibold px-10 py-4 rounded-full hover:bg-white/90 active:scale-[0.98] transition-all"
        >
          Recommend Our Shop →
        </Link>
      </div>
    </section>
  );
}
