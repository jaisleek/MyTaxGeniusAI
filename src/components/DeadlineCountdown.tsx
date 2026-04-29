import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

export function DeadlineCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    // Assuming March 31st for Annual PIT Filing Deadline
    const year = new Date().getFullYear();
    let difference = +new Date(`${year}-03-31T23:59:59`) - +new Date();

    // If we are past March 31st, show next year's
    if (difference <= 0) {
      difference = +new Date(`${year + 1}-03-31T23:59:59`) - +new Date();
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-4 py-3 relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between text-sm sm:text-base font-bold">
        <div className="flex items-center mb-2 sm:mb-0">
          <AlertCircle className="w-5 h-5 mr-2 animate-pulse text-rose-200" />
          <span className="uppercase tracking-wide">
            LIRS/NRS Annual Filing Deadline:
          </span>
        </div>
        <div className="flex items-center space-x-3 bg-black/20 px-4 py-1.5 rounded-lg border border-red-500/30">
          <Clock className="w-4 h-4 text-rose-200" />
          <div className="flex space-x-2">
            <span className="flex items-baseline">
              <span className="text-xl leading-none font-black">
                {timeLeft.days}
              </span>
              <span className="text-xs ml-1 text-rose-200">d</span>
            </span>
            <span>:</span>
            <span className="flex items-baseline">
              <span className="text-xl leading-none font-black">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-xs ml-1 text-rose-200">h</span>
            </span>
            <span>:</span>
            <span className="flex items-baseline">
              <span className="text-xl leading-none font-black">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-xs ml-1 text-rose-200">m</span>
            </span>
            <span>:</span>
            <span className="flex items-baseline">
              <span className="text-xl leading-none font-black">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-xs ml-1 text-rose-200">s</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
