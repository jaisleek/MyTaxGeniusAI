import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

const taxTips = [
  "Keep digital copies of all your business receipts. The NRS requires records to be kept for at least 6 years.",
  "Filing your VAT returns before the 21st of every month helps you avoid steep late payment penalties.",
  "Deductible expenses must be 'wholly, reasonably, exclusively and necessarily' incurred for your business.",
  "The new 2025 reforms consolidate over 60 taxes into just 8. Ensure you're paying under the correct new brackets.",
  "Using a dedicated business bank account makes year-end tax reconciliation significantly easier and more accurate."
];

export const TaxTipsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % taxTips.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextTip = () => setCurrentIndex((prev) => (prev + 1) % taxTips.length);
  const prevTip = () => setCurrentIndex((prev) => (prev - 1 + taxTips.length) % taxTips.length);

  return (
    <div className="w-full max-w-4xl mx-auto bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 relative overflow-hidden my-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-2 rounded-full">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-emerald-400 font-bold tracking-wide uppercase text-sm">Daily Tax Tip</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevTip} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextTip} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative h-20 sm:h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full absolute flex justify-center items-center cursor-grab active:cursor-grabbing touch-pan-y"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              const swipeConfidenceThreshold = 10000;

              if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                nextTip();
              } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                prevTip();
              }
            }}
          >
            <p className="text-slate-200 text-sm sm:text-base md:text-lg font-medium text-center w-full select-none px-4">
              "{taxTips[currentIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Progress indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {taxTips.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};
