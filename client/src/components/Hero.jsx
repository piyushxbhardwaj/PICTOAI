import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/useApp';
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';

const samplePrompts = [
  'A cyberpunk samurai warrior standing in neon rain, Tokyo alley, 8k...',
  'A photorealistic golden astronaut exploring lush jungle on Europa, cinematic...',
  'Sleek yellow futuristic hypercar driving through digital grid highway...',
  '3D cute robot painting on canvas, yellow highlights, clay render...'
];

const Hero = ({ onOpenAuth }) => {
  const { playSfx, setActiveTab, setPrefilledPrompt, user } = useApp();
  const [prompt, setPrompt] = useState('');
  
  const [placeholder, setPlaceholder] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentPrompt = samplePrompts[promptIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder(currentPrompt.substring(0, charIdx - 1));
        setCharIdx(prev => prev - 1);
      }, 30);
    } else {
      timer = setTimeout(() => {
        setPlaceholder(currentPrompt.substring(0, charIdx + 1));
        setCharIdx(prev => prev + 1);
      }, 70);
    }

    if (!isDeleting && charIdx === currentPrompt.length) {
      // Pause at full prompt
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPromptIdx(prev => (prev + 1) % samplePrompts.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, promptIdx]);

  // Canvas Particles Background
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 600;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles array
    const particles = [];
    const particleCount = 45;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;

        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid intersections lightly
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 40; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 40; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Connect particles close to each other
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Before/After Image slider controls
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const handleSliderMove = (clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    playSfx('click');
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e) => {
      if (!isDragging.current) return;
      if (e.touches && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      }
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleGenerateClick = () => {
    playSfx('click');
    const finalPrompt = prompt || placeholder;
    setPrefilledPrompt(finalPrompt);
    
    if (user) {
      setActiveTab('workspace');
    } else {
      onOpenAuth('signup');
    }
  };

  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center overflow-hidden py-12 md:py-20">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-black via-cyber-black to-cyber-dark z-[-2]"></div>
      <div className="particles-wrapper">
        <canvas ref={canvasRef} className="block w-full h-full"></canvas>
      </div>

      {/* Ambient glowing radial effects */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            
            {/* Cyber Neon Badge */}
            <div className="inline-flex w-fit items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary shadow-glow-yellow animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>Stable Diffusion v4.0 is live</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              Transform Your <br />
              Ideas into <span className="text-gradient-amber">AI Art</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl">
              PictoAI generates photorealistic masterpieces, conceptual designs, and unique styles straight from your text prompts. Powered by next-gen stable diffusion.
            </p>

            {/* Prompt Box */}
            <div className="relative mt-4 max-w-2xl rounded-2xl border border-zinc-800 bg-cyber-black/90 p-2 focus-within:border-primary/50 focus-within:shadow-glow transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex-1 flex items-center px-3 min-h-[50px]">
                  <Wand2 className="h-5 w-5 text-zinc-500 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
                    onFocus={() => playSfx('click')}
                  />
                </div>
                <button
                  onClick={handleGenerateClick}
                  onMouseEnter={() => playSfx('hover')}
                  className="rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-cyber-black hover:bg-primary-hover shadow-glow flex items-center justify-center space-x-2 transition-all shrink-0 cursor-pointer"
                >
                  <span>Generate Image</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Prompt suggestion labels */}
            <div className="flex flex-wrap gap-2 text-xs text-zinc-500 pt-2">
              <span className="self-center">Try:</span>
              {['Neon Samurai', 'Golden Astronaut', 'Cyber City', 'Retro Synthwave'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    playSfx('click');
                    if (tag === 'Neon Samurai') setPrompt(samplePrompts[0].substring(0, 50));
                    if (tag === 'Golden Astronaut') setPrompt(samplePrompts[1].substring(0, 50));
                    if (tag === 'Cyber City') setPrompt(samplePrompts[2].substring(0, 50));
                    if (tag === 'Retro Synthwave') setPrompt(samplePrompts[3].substring(0, 50));
                  }}
                  onMouseEnter={() => playSfx('hover')}
                  className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 hover:border-primary hover:text-white transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Hero Right Visuals (Before/After Slider) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl border border-cyber-border-glow overflow-hidden shadow-glow-lg group">
              
              <div 
                ref={sliderRef}
                className="relative w-full h-full select-none cursor-ew-resize overflow-hidden"
                onTouchStart={handleMouseDown}
                onMouseDown={handleMouseDown}
              >
                {/* BEFORE (Underneath/Background - sketch style) */}
                <div className="absolute inset-0 w-full h-full bg-zinc-950">
                  <img
                    src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop"
                    alt="Original Wireframe Sketch"
                    className="w-full h-full object-cover filter grayscale contrast-150 brightness-75 opacity-70"
                    draggable="false"
                  />
                  <div className="absolute top-4 left-4 bg-cyber-black/70 border border-zinc-800 text-xs text-zinc-400 font-bold px-3 py-1.5 rounded-md backdrop-blur-sm uppercase tracking-wider">
                    Layout Sketch
                  </div>
                </div>

                {/* AFTER (Top layer - fully rendered yellow-glowing image) */}
                <div 
                  className="absolute inset-y-0 left-0 h-full overflow-hidden bg-zinc-950"
                  style={{ width: `${sliderPos}%` }}
                >
                  {/* Keep image width absolute to prevent squishing */}
                  <div className="absolute inset-0 w-full h-full min-w-[350px] lg:min-w-[440px]">
                    <img
                      src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop"
                      alt="Rendered Cyber AI Art"
                      className="w-full h-full object-cover"
                      style={{ width: sliderRef.current?.getBoundingClientRect().width }}
                      draggable="false"
                    />
                    <div className="absolute top-4 right-4 bg-primary/20 border border-primary text-xs text-primary font-bold px-3 py-1.5 rounded-md backdrop-blur-sm uppercase tracking-wider shadow-glow-yellow">
                      AI Generated Art
                    </div>
                  </div>
                </div>

                {/* SLIDER BAR & HANDLE */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-primary pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="slider-handle">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

              </div>

              {/* Hover Badge info */}
              <div className="absolute bottom-4 left-4 right-4 bg-cyber-black/80 border border-zinc-800 p-3 rounded-xl backdrop-blur-sm flex items-center justify-between translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase">Style Selected</p>
                  <p className="text-sm font-bold text-white">Cyberpunk Yellow Glow</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 font-semibold uppercase">Inference</p>
                  <p className="text-sm font-bold text-primary">1.4s Fast-HD</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
