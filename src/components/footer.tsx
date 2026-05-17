import Link from "next/link";

const footerSections = [
  {
    title: "HELP",
    links: [
      { label: "FAQ/Contact Us", href: "#" },
      { label: "Returns/Exchanges", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Order Status", href: "#" },
    ],
  },
  {
    title: "SHOP",
    links: [
      { label: "Men's Shoes", href: "/collections/mens" },
      { label: "Women's Shoes", href: "/collections/womens" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Sale", href: "/collections/sale" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Our Materials", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "X/Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-footer-bg text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        {/* Follow the Flock social section */}
        <div className="mb-12 pb-10 border-b border-white/10">
          <h3 className="text-[12px] font-medium uppercase tracking-[0.8px] text-white/50 mb-4">
            FOLLOW THE FLOCK
          </h3>
          <div className="flex gap-5">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Email signup — more prominent */}
          <div>
            <h3 className="text-[12px] font-medium uppercase tracking-[0.8px] text-white/50 mb-4">
              JOIN THE FLOCK
            </h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Get the latest on new products, exclusive deals, and more.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b border-white/30 px-0 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="self-start px-6 py-2 text-[11px] font-medium uppercase tracking-wider text-charcoal bg-white rounded-full hover:bg-white/90 transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.8px] text-white/50 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold italic tracking-tight">FashionHero</span>
            {/* Country selector */}
            <span className="text-xs text-white/40 border border-white/20 px-3 py-1 rounded">
              US ($)
            </span>
          </div>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} FashionHero, Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
