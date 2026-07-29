import type { RefObject } from "react";
import type { PricesState } from "../lib/types";

interface BottomOverlayProps {
  speedRef: RefObject<HTMLSpanElement | null>;
  news: string;
  newsTransform: string;
  animationDuration: number;
  prices: PricesState;
}

export default function BottomOverlay({
  speedRef,
  news,
  newsTransform,
  animationDuration,
  prices,
}: BottomOverlayProps) {
  return (
    <div className="bottom-overlay">
      <span ref={speedRef} className="internet-speed error" />
      <div className="news-container">
        <span
          style={{
            animationDuration: `${animationDuration}s`,
            transform: newsTransform,
          }}
        >
          {news}
        </span>
      </div>
      <div className="price-container">
        <span className="usdt-price-widget">
          <div>
            <span className="label">USDT: </span>
            <span className="value usdt-price">{prices.usdt}</span>
            <span className="unit">T</span>
          </div>
        </span>
        <span className="btc-price-widget">
          <div>
            <span className="label">BTC: </span>
            <span className="value btc-price">{prices.btc}</span>
            <span className="unit">$</span>
          </div>
        </span>
        <span className="gold-price-widget">
          <div>
            <span className="label">GOLD: </span>
            <span className="value gold-price">{prices.gold}</span>
            <span className="unit">T</span>
          </div>
        </span>
      </div>
    </div>
  );
}
