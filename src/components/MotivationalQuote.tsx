import type { MotivationalQuote as Quote } from "../lib/quotes";

export default function MotivationalQuote({ quote }: { quote: Quote | null }) {
  if (!quote) {
    return <div className="min-h-[3.4em]" aria-hidden="true" />;
  }

  return (
    <figure
      key={quote.text}
      className="max-w-[min(920px,86vw)] animate-in fade-in duration-700 px-2 text-center"
    >
      <blockquote className="m-0 text-[clamp(14px,1.55vw,20px)] leading-relaxed font-light text-white/55 italic [direction:ltr]">
        “{quote.text}”
      </blockquote>
      {quote.author ? (
        <figcaption className="mt-2 text-[clamp(11px,1.15vw,13px)] tracking-[0.18em] text-amber-200/40 [direction:ltr]">
          {quote.author}
        </figcaption>
      ) : null}
    </figure>
  );
}
