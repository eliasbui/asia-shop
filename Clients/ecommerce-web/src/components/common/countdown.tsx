"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  endDate: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ endDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        onComplete?.();
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  if (!timeLeft) {
    return <div className="text-sm text-muted-foreground">Sale ended</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <TimeUnit value={timeLeft.days} label="d" />
      <span className="text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.hours} label="h" />
      <span className="text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.minutes} label="m" />
      <span className="text-lg font-bold">:</span>
      <TimeUnit value={timeLeft.seconds} label="s" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-primary-foreground rounded-md px-2 py-1 min-w-[40px] text-center">
        <span className="text-lg font-bold">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
