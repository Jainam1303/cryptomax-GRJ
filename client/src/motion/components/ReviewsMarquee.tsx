import React from "react";

// Simple, US-based, human-written sample reviews
const REVIEWS: { name: string; location: string; text: string; rating: number }[] = [
  {
    name: "Emily R.",
    location: "Austin, TX",
    text: "Transparent updates and steady monthly returns. Helped me diversify without the stress.",
    rating: 5,
  },
  {
    name: "Michael K.",
    location: "San Diego, CA",
    text: "I started with the Starter Plan and upgraded in 3 months. Consistency has been the key.",
    rating: 5,
  },
  {
    name: "Jasmine P.",
    location: "Brooklyn, NY",
    text: "The analytics dashboard makes it easy to track progress. Support was quick and friendly.",
    rating: 5,
  },
  {
    name: "David L.",
    location: "Scottsdale, AZ",
    text: "Exactly what I needed for passive exposure. Clear reporting and timely payouts.",
    rating: 5,
  },
  {
    name: "Aaron S.",
    location: "Seattle, WA",
    text: "Professional service with real risk controls. Returns have matched expectations so far.",
    rating: 4,
  },
  {
    name: "Sophia M.",
    location: "Miami, FL",
    text: "Love the monthly summaries. It’s been a reliable supplement to my long-term portfolio.",
    rating: 5,
  },
];

const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.max(0, Math.min(5, rating));
  return (
    <div className="text-yellow-400 text-sm tracking-tight">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "opacity-100" : "opacity-40"}>
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ r: typeof REVIEWS[number] }> = ({ r }) => {
  return (
    <div className="flex w-[320px] sm:w-[380px] flex-col gap-3 bg-secondary/60 border border-primary/10 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-semibold">
            {r.name.charAt(0)}
          </div>
          <div className="leading-tight">
            <div className="font-semibold">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.location}</div>
          </div>
        </div>
        <Stars rating={r.rating} />
      </div>
      <p className="text-sm text-muted-foreground">“{r.text}”</p>
    </div>
  );
};

const ReviewsMarquee: React.FC<{ speedMs?: number; className?: string }> = ({ speedMs = 32000, className = "" }) => {
  // Duplicate the sequence to ensure seamless scroll
  const sequence = Array.from({ length: 2 }).flatMap(() => REVIEWS);

  return (
    <div className={`relative w-full overflow-hidden py-6 ${className}`}>
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

      <div
        className="flex w-[200%] will-change-transform"
        style={{ animation: `reviews-marquee ${speedMs}ms linear infinite` }}
      >
        {/* Track A */}
        <ul className="flex flex-shrink-0 min-w-full items-stretch gap-6">
          {sequence.map((r, idx) => (
            <li key={`A-${idx}`} className="shrink-0">
              <ReviewCard r={r} />
            </li>
          ))}
        </ul>
        {/* Track B (duplicate) */}
        <ul className="flex flex-shrink-0 min-w-full items-stretch gap-6" aria-hidden="true">
          {sequence.map((r, idx) => (
            <li key={`B-${idx}`} className="shrink-0">
              <ReviewCard r={r} />
            </li>
          ))}
        </ul>
      </div>

      {/* Local styles for the marquee animation */}
      <style>{`
        @keyframes reviews-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ReviewsMarquee;
