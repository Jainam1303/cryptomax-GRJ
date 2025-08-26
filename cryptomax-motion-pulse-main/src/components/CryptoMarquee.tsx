import React from "react";

const COINS: string[] = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "ADA",
  "DOGE",
  "DOT",
  "AVAX",
  "MATIC",
];

/**
 * Infinite scrolling marquee of crypto logos.
 */
const CryptoMarquee: React.FC<{ speedMs?: number; className?: string }> = ({ speedMs = 28000, className = "" }) => {
  return (
    <div className={`relative w-full overflow-hidden py-6 ${className}`}>
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

      {/* Track wrapper */}
      <div
        className="flex w-[200%] will-change-transform"
        style={{ animation: `cm-marquee ${speedMs}ms linear infinite` }}
      >
        {/* Track A */}
        <ul className="flex flex-shrink-0 min-w-full items-center gap-12">
          {Array.from({ length: 3 }).flatMap(() => COINS).map((symbol, idx) => {
            const base = symbol.toLowerCase();
            const primary = `/logos/${base}.svg`;
            const fallback1 = `/logos/${base}.png`;
            const fallback2 = "";
            return (
              <li key={`A-${symbol}-${idx}`} className="opacity-90 hover:opacity-100 transition-opacity">
                <img
                  src={primary}
                  alt={`${symbol} logo`}
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain select-none"
                  loading="lazy"
                  draggable={false}
                  data-fallback={fallback1}
                  data-fallback2={fallback2}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    const next = el.getAttribute("data-fallback");
                    const next2 = el.getAttribute("data-fallback2");
                    if (next) {
                      el.src = next;
                      el.setAttribute("data-fallback", next2 || "");
                      el.removeAttribute("data-fallback2");
                    } else if (next2) {
                      el.src = next2;
                      el.removeAttribute("data-fallback2");
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
        {/* Track B (duplicate) */}
        <ul className="flex flex-shrink-0 min-w-full items-center gap-12" aria-hidden="true">
          {Array.from({ length: 3 }).flatMap(() => COINS).map((symbol, idx) => {
            const base = symbol.toLowerCase();
            const primary = `/logos/${base}.svg`;
            const fallback1 = `/logos/${base}.png`;
            const fallback2 = "";
            return (
              <li key={`B-${symbol}-${idx}`} className="opacity-90 transition-opacity">
                <img
                  src={primary}
                  alt=""
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain select-none"
                  loading="lazy"
                  draggable={false}
                  data-fallback={fallback1}
                  data-fallback2={fallback2}
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    const next = el.getAttribute("data-fallback");
                    const next2 = el.getAttribute("data-fallback2");
                    if (next) {
                      el.src = next;
                      el.setAttribute("data-fallback", next2 || "");
                      el.removeAttribute("data-fallback2");
                    } else if (next2) {
                      el.src = next2;
                      el.removeAttribute("data-fallback2");
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>

      {/* Local styles for the marquee animation */}
      <style>{`
        @keyframes cm-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CryptoMarquee;
