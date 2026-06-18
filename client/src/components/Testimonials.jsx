import { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const { playSfx } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Creative Director at VeloDesign',
      quote: 'PictoAI has completely transformed our concept art workflow. What used to take our designers days now takes minutes. The prompt response and style filters are second to none!',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
      name: 'Alex Rivera',
      role: 'Indie Game Developer',
      quote: 'The speed of the Pro plan is insane – 1.4 seconds per image! I populated my entire game storyboard in an afternoon. Outstanding tool, and sandbox mode is incredibly responsive.',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    {
      name: 'Elena Rostova',
      role: 'Digital Concept Artist',
      quote: 'The Cyber-Renaissance and Gold-Lux styles are stunning! The outputs have this incredible metallic glow that actually feels premium, not like generic AI noise. Highly recommended!',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
    }
  ];

  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handlePrev = () => {
    playSfx('click');
    setActiveIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    playSfx('click');
    setActiveIdx((prev) => (prev + 1) % reviews.length);
  };

  const handleDotClick = (idx) => {
    playSfx('click');
    setActiveIdx(idx);
  };

  return (
    <section id="testimonials" className="relative py-20 bg-cyber-dark overflow-hidden border-b border-cyber-border">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Creator Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Endorsed by Top Industry Artists
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          
          {/* Main Card */}
          <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500 shadow-glow-yellow border-primary/20 min-h-[300px] flex flex-col justify-between">
            
            <Quote className="absolute top-6 right-8 h-20 w-20 text-primary/5 pointer-events-none" />

            <div className="space-y-6">
              {/* Star rating */}
              <div className="flex space-x-1">
                {[...Array(reviews[activeIdx].stars)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary shadow-glow-yellow" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-lg md:text-xl text-zinc-100 font-medium leading-relaxed italic">
                "{reviews[activeIdx].quote}"
              </p>
            </div>

            {/* Profile Row */}
            <div className="flex items-center space-x-4 pt-8 mt-6 border-t border-zinc-800/40">
              <img
                src={reviews[activeIdx].avatar}
                alt={reviews[activeIdx].name}
                className="h-14 w-14 rounded-full border border-primary/30 object-cover shadow-glow-yellow"
              />
              <div>
                <h4 className="font-bold text-white text-base">{reviews[activeIdx].name}</h4>
                <p className="text-xs text-zinc-500">{reviews[activeIdx].role}</p>
              </div>
            </div>

          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-8">
            {/* Dots */}
            <div className="flex space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  onMouseEnter={() => playSfx('hover')}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIdx === idx ? 'w-8 bg-primary shadow-glow-yellow' : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                onMouseEnter={() => playSfx('hover')}
                className="rounded-xl border border-zinc-800 bg-cyber-black p-3 text-zinc-400 hover:text-white hover:border-primary transition-all cursor-pointer"
                title="Previous Testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                onMouseEnter={() => playSfx('hover')}
                className="rounded-xl border border-zinc-800 bg-cyber-black p-3 text-zinc-400 hover:text-white hover:border-primary transition-all cursor-pointer"
                title="Next Testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;
