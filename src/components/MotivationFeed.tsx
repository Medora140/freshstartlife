import { useMemo } from "react";
import { MOTIVATION_QUOTES } from "@/lib/freshstart-data";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";

const MotivationFeed = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const quotes = useMemo(() => {
    const shuffled = [...MOTIVATION_QUOTES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [refreshKey]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-secondary">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wide">Daily Motivation</span>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {quotes.map((quote, i) => (
        <div
          key={`${refreshKey}-${i}`}
          className="glass-card p-5 space-y-2 animate-fade-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <p className="text-foreground font-medium italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground font-semibold">
            — {quote.author}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MotivationFeed;
