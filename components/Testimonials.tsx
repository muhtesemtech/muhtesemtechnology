
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';
import { Quote, Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref for auto-play interval to clear it easily
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate dynamic fetching
  useEffect(() => {
    const fetchTestimonials = () => {
      setLoading(true);
      setTimeout(() => {
        setItems(TESTIMONIALS);
        setLoading(false);
      }, 800); // Simulate network delay
    };

    fetchTestimonials();
  }, []);

  // Responsive logic to determine how many items are visible
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the maximum valid index we can scroll to without showing whitespace
  const maxIndex = Math.max(0, items.length - visibleCount);

  // Ensure currentIndex is valid if window resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, maxIndex, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isPaused && !loading && items.length > visibleCount) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, loading, items.length, visibleCount, nextSlide]);

  return (
    <section className="bg-vivid-gray py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-vivid-red/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-vivid-red/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vivid-red/10 text-vivid-red text-xs font-bold uppercase tracking-wider mb-4 border border-vivid-red/20">
             Success Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="text-vivid-red">Industry Leaders</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Don't just take our word for it. Hear from the candidates we've placed and the companies we've helped grow.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader2 className="w-12 h-12 text-vivid-red animate-spin mb-4" />
            <p className="text-gray-500 text-sm animate-pulse font-medium">Loading feedback...</p>
          </div>
        ) : (
          <div 
            className="relative group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Carousel Viewport */}
            <div className="overflow-hidden -mx-4 px-4 py-4">
              {/* Carousel Track */}
              <div 
                className="flex transition-transform duration-500 ease-in-out will-change-transform"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                  width: `${(items.length / visibleCount) * 100}%` 
                }}
              >
                {items.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="flex-shrink-0 px-4 transition-all duration-300"
                    style={{ width: `${100 / items.length}%` }}
                  >
                    <div className="bg-vivid-darker border border-gray-800 p-8 rounded-2xl relative h-full flex flex-col hover:border-vivid-red/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
                        <div className="absolute top-8 right-8 text-vivid-red opacity-10 group-hover:opacity-20 transition-opacity">
                            <Quote className="w-12 h-12 fill-current" />
                        </div>

                        <div className="flex gap-1 mb-6 text-vivid-red">
                            {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                        </div>

                        <blockquote className="text-gray-300 mb-8 leading-relaxed italic relative z-10 flex-grow text-base md:text-lg">
                            "{testimonial.quote}"
                        </blockquote>

                        <div className="flex items-center gap-4 mt-auto border-t border-gray-800 pt-6">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800 shrink-0">
                                <img 
                                    src={`https://i.pravatar.cc/150?img=${testimonial.avatarId}`} 
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{testimonial.name}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                    <span className="text-vivid-red text-[10px] font-bold uppercase tracking-wider">
                                        {testimonial.role}
                                    </span>
                                    {testimonial.company && (
                                        <>
                                            <span className="text-gray-600 text-[10px]">•</span>
                                            <span className="text-gray-500 text-[10px] truncate max-w-[100px]">
                                                {testimonial.company}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                    testimonial.type === 'Client' 
                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                        : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                    {testimonial.type}
                                </span>
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls - Left */}
            <button 
                onClick={prevSlide}
                className="absolute top-1/2 -left-2 lg:-left-12 -translate-y-1/2 w-12 h-12 rounded-full bg-vivid-darker border border-gray-700 text-white hover:bg-vivid-red hover:border-vivid-red transition-all flex items-center justify-center shadow-xl group/btn opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            
            {/* Controls - Right */}
            <button 
                onClick={nextSlide}
                className="absolute top-1/2 -right-2 lg:-right-12 -translate-y-1/2 w-12 h-12 rounded-full bg-vivid-darker border border-gray-700 text-white hover:bg-vivid-red hover:border-vivid-red transition-all flex items-center justify-center shadow-xl group/btn opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
                aria-label="Next testimonial"
            >
                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Pagination Dots */}
            {maxIndex > 0 && (
                <div className="flex justify-center mt-12 gap-3">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                currentIndex === idx 
                                    ? 'w-8 bg-vivid-red shadow-[0_0_10px_rgba(213,0,28,0.5)]' 
                                    : 'w-2 bg-gray-700 hover:bg-gray-500'
                            }`}
                            aria-label={`Go to slide group ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
