import { QUOTE_POOL_TTL, QUOTE_ROTATE_INTERVAL } from "./constants";

export interface MotivationalQuote {
  text: string;
  author: string;
}

interface QuoteCache {
  quotes: MotivationalQuote[];
  fetchedAt: number;
}

const STORAGE_KEY = "countdown_quotes";
const QUOTES_URL = "https://dummyjson.com/quotes?limit=100";
const MAX_QUOTE_LENGTH = 140;

function isQuote(value: unknown): value is { quote: string; author?: string } {
  return (
    !!value &&
    typeof value === "object" &&
    "quote" in value &&
    typeof value.quote === "string" &&
    value.quote.trim().length > 0
  );
}

function normalize(raw: { quote: string; author?: string }): MotivationalQuote {
  return {
    text: raw.quote.trim(),
    author: typeof raw.author === "string" ? raw.author.trim() : "",
  };
}

export function quoteTimeSlot(now = Date.now()): number {
  return Math.floor(now / QUOTE_ROTATE_INTERVAL);
}

export function quoteForSlot(
  quotes: MotivationalQuote[],
  now = Date.now(),
): MotivationalQuote | null {
  if (!quotes.length) return null;
  return quotes[quoteTimeSlot(now) % quotes.length] ?? null;
}

export function loadQuoteCache(): QuoteCache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("quotes" in parsed) ||
      !("fetchedAt" in parsed) ||
      !Array.isArray(parsed.quotes) ||
      typeof parsed.fetchedAt !== "number"
    ) {
      return null;
    }
    const quotes = parsed.quotes.filter(
      (item): item is MotivationalQuote =>
        !!item &&
        typeof item === "object" &&
        "text" in item &&
        typeof item.text === "string" &&
        item.text.trim().length > 0,
    );
    if (!quotes.length) return null;
    return { quotes, fetchedAt: parsed.fetchedAt };
  } catch {
    return null;
  }
}

export function saveQuoteCache(cache: QuoteCache): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}

export function isQuoteCacheFresh(cache: QuoteCache, now = Date.now()): boolean {
  return now - cache.fetchedAt < QUOTE_POOL_TTL;
}

export async function fetchMotivationalQuotes(): Promise<MotivationalQuote[]> {
  const res = await fetch(QUOTES_URL);
  if (!res.ok) throw new Error(`Quotes request failed: ${res.status}`);
  const data: unknown = await res.json();
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "quotes" in data && Array.isArray(data.quotes)
      ? data.quotes
      : [];
  const quotes = list
    .filter(isQuote)
    .map(normalize)
    .filter((quote) => quote.text.length <= MAX_QUOTE_LENGTH);
  return shuffle(quotes);
}

function shuffle(quotes: MotivationalQuote[]): MotivationalQuote[] {
  const next = [...quotes];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    const other = next[swap];
    if (current && other) {
      next[index] = other;
      next[swap] = current;
    }
  }
  return next;
}
