export default function ReferralPage() {
  const steps = [
    {
      number: "01",
      title: "Share your link",
      description:
        "Copy your personal referral link below and send it to a friend, family member, or anyone who loves fashion.",
    },
    {
      number: "02",
      title: "They make a purchase",
      description:
        "Your friend visits FashionHero through your link and completes their first order — any amount, any item.",
    },
    {
      number: "03",
      title: "You earn 10% off",
      description:
        "Once their order is confirmed, a 10% discount code lands in your inbox automatically. Use it on your next purchase.",
    },
  ];

  const faqs = [
    {
      q: "Is there a limit on how many friends I can refer?",
      a: "No limit at all. Every successful referral earns you a new 10% discount code.",
    },
    {
      q: "When does my discount expire?",
      a: "Your 10% code is valid for 90 days from the date it's issued.",
    },
    {
      q: "Can my referred friend also get a discount?",
      a: "Yes — they automatically receive a 5% welcome discount on their first order.",
    },
    {
      q: "What counts as a successful referral?",
      a: "Your friend needs to place their first order on FashionHero through your referral link.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-charcoal text-white py-20 px-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-white/50 mb-4">
          Referral Program
        </p>
        <h1 className="text-4xl sm:text-5xl font-normal leading-tight mb-5">
          Give a friend a reason<br />to discover FashionHero.
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
          Recommend our shop to someone new and earn{" "}
          <span className="text-white font-semibold">10% off your next order</span> — every single time.
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <span className="inline-block text-4xl font-light text-charcoal/15 mb-3">
                {step.number}
              </span>
              <h3 className="text-lg font-medium text-charcoal mb-2">{step.title}</h3>
              <p className="text-sm text-warm-gray leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reward highlight */}
      <section className="bg-cream-light py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-baseline gap-2 mb-4">
            <span className="text-7xl font-semibold text-charcoal">10%</span>
            <span className="text-2xl text-warm-gray font-light">off</span>
          </div>
          <p className="text-charcoal text-lg mb-2">for every successful referral</p>
          <p className="text-sm text-warm-gray">
            Valid for 90 days · No minimum spend · Stackable with sale items
          </p>
        </div>
      </section>

      {/* Referral link box */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-normal text-charcoal mb-2">Your referral link</h2>
        <p className="text-sm text-warm-gray mb-8">
          Share this link with anyone you think would love shopping on FashionHero.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gray-50 border border-black/10 rounded-xl p-4">
          <span className="flex-1 text-sm text-charcoal text-left truncate font-mono select-all">
            https://fashionhero.shop/ref/YOUR_CODE
          </span>
          <button className="shrink-0 bg-charcoal text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-charcoal/80 transition-colors">
            Copy link
          </button>
        </div>
        <p className="text-xs text-warm-gray mt-4">
          Sign in to generate your unique personal referral link.
        </p>
      </section>

      {/* FAQ */}
      <section className="border-t border-black/8 bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-medium text-charcoal mb-1">{faq.q}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
