import { useApp } from '../context/useApp';
import { Sparkles, Zap, Image, Palette, Shield } from 'lucide-react';

const Features = () => {
  const { playSfx } = useApp();

  const features = [
    {
      icon: <Sparkles className="h-7 w-7 text-primary" />,
      title: 'Text-to-Image Generation',
      description: 'Describe any scene, character, or dream you imagine, and watch our next-gen neural network paint it instantly.'
    },
    {
      icon: <Zap className="h-7 w-7 text-primary" />,
      title: 'Fast AI Processing',
      description: 'Built on dedicated cluster GPUs, PictoAI delivers high-fidelity artwork generation in less than 2 seconds.'
    },
    {
      icon: <Image className="h-7 w-7 text-primary" />,
      title: 'High Quality Output',
      description: 'Generate high-resolution upscaled outputs up to 4K, perfect for digital designs, printing, or wallpaper layouts.'
    },
    {
      icon: <Palette className="h-7 w-7 text-primary" />,
      title: 'Multiple Art Styles',
      description: 'Choose from multiple pre-curated styles: Cyberpunk, Anime, Photorealistic, Oil Painting, 3D Render, and more.'
    },
    {
      icon: <Shield className="h-7 w-7 text-primary" />,
      title: 'Secure & Easy to Use',
      description: 'Secure authentication, credit tracking, and instant downloads. Creative ownership of your generated art is 100% yours.'
    }
  ];

  return (
    <section id="features" className="relative py-20 bg-cyber-dark overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 h-[400px] w-[200px] rounded-r-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Advanced Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Designed for Next-Generation Creativity
          </h2>
          <p className="text-zinc-400">
            Discover a comprehensive suite of AI generation tools built for artists, developers, and visionaries alike.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => playSfx('hover')}
              className={`glass-panel rounded-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:border-primary/30 hover:shadow-glow group ${
                idx === 3 || idx === 4 ? 'lg:col-span-1 md:col-span-2 lg:mx-auto lg:max-w-md w-full' : ''
              }`}
            >
              <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
                {feat.icon}
                <div className="absolute -inset-0.5 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {feat.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
