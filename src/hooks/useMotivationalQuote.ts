import { useEffect, useState } from "react";

import {
  fetchMotivationalQuotes,
  isQuoteCacheFresh,
  loadQuoteCache,
  type MotivationalQuote,
  quoteForSlot,
  saveQuoteCache,
} from "../lib/quotes";

const SLOT_POLL_MS = 30_000;

export function useMotivationalQuote(): MotivationalQuote | null {
  const [quote, setQuote] = useState<MotivationalQuote | null>(() => {
    const cached = loadQuoteCache();
    return cached ? quoteForSlot(cached.quotes) : null;
  });

  useEffect(() => {
    let cancelled = false;

    async function resolvePool(): Promise<MotivationalQuote[]> {
      const cached = loadQuoteCache();
      if (cached && isQuoteCacheFresh(cached)) return cached.quotes;

      const quotes = await fetchMotivationalQuotes();
      if (!quotes.length) return cached?.quotes ?? [];
      saveQuoteCache({ quotes, fetchedAt: Date.now() });
      return quotes;
    }

    function apply(quotes: MotivationalQuote[]) {
      const next = quoteForSlot(quotes);
      if (!cancelled && next) setQuote(next);
    }

    void resolvePool()
      .then(apply)
      .catch(() => {
        const cached = loadQuoteCache();
        if (cached) apply(cached.quotes);
      });

    const timer = window.setInterval(() => {
      const cached = loadQuoteCache();
      if (cached) apply(cached.quotes);
    }, SLOT_POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  return quote;
}
