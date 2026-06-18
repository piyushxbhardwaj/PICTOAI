import { useApp } from '../context/useApp';
import { Edit3, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
  const { playSfx } = useApp();

  const steps = [
    {
      num: '01',
      icon: <Edit3 className="h-6 w-6 text-primary" />,
      title: 'Enter Prompt',
      subtitle: 'Type your prompt describing the image details, art style (e.g. anime, cyberpunk), lighting, and aspect ratio.'
    },
    {
      num: '02',
      icon: <Cpu className="h-6 w-6 text-primary" />,
      title: 'AI Creates',
      subtitle: 'PictoAI processes your prompt through Stable Diffusion model weights, rendering your image in high resolution.'
    },
    {
      num: '03',
      icon: <Download className="h-6 w-6 text-primary" />,
      title: 'Download & Share',
      subtitle: 'Save the masterpiece directly to your device, generate variants, upscale resolution, or share it on the community gallery.'
    }
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-cyber-black overflow-hidden border-t border-b border-cyber-border">
      
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 z-0"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            From Imagination to Reality in 3 Steps
          </h2>
          <p className="text-zinc-400">
            Generating custom high-fidelity digital art has never been more straightforward or powerful.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting line (Desktop) */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 -translate-y-12 hidden lg:block z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={idx}
                onMouseEnter={() => playSfx('hover')}
                className="flex flex-col items-center text-center space-y-6 group"
              >
                {/* Step Circle */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-cyber-dark border border-zinc-800 group-hover:border-primary group-hover:shadow-glow transition-all duration-300">
                  {step.icon}
                  
                  {/* Step Number Badge */}
                  <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-cyber-black font-display shadow-glow-yellow">
                    {step.num}
                  </span>

                  <div className="absolute -inset-1 rounded-full border border-primary/20 scale-105 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="space-y-3 max-w-sm">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
