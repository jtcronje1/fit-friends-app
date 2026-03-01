"use client";

import { useMemo } from "react";
import { Quote } from "lucide-react";
import { DAILY_QUOTES } from "@/lib/exercises";

interface DailyQuoteProps {
  startDate: string;
}

export function DailyQuote({ startDate }: DailyQuoteProps) {
  const quote = useMemo(() => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const dayNumber = Math.max(0, diffDays);
    return DAILY_QUOTES[dayNumber % DAILY_QUOTES.length];
  }, [startDate]);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 flex-shrink-0 mt-0.5 opacity-70" />
          <div>
            <p className="text-sm font-medium leading-relaxed">
              &ldquo;{quote.quote}&rdquo;
            </p>
            {quote.author && (
              <p className="text-xs text-blue-100 mt-1">— {quote.author}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
