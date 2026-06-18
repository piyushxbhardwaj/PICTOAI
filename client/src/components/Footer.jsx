import { useApp } from '../context/useApp';
import { Sparkles, Code, Send, MessageSquare, Mail, Globe } from 'lucide-react';

const Footer = () => {
  const { playSfx, setActiveTab } = useApp();

  const handleLinkClick = (e, label) => {
    playSfx('click');
    if (label === 'Home') {
      e.preventDefault();
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-cyber-black border-t border-cyber-border/80 pt-16 pb-8 overflow-hidden z-10">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/3 h-[250px] w-[250px] rounded-full bg-primary/3 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer group" onClick={(e) => handleLinkClick(e, 'Home')}>
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-cyber-black shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Picto<span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              PictoAI is a next-generation neural art canvas. Create, upscale, and download gorgeous stable-diffusion artwork in seconds.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              {[
                { icon: <Send className="h-4.5 w-4.5" />, href: '#', label: 'Telegram' },
                { icon: <Code className="h-4.5 w-4.5" />, href: '#', label: 'GitHub' },
                { icon: <MessageSquare className="h-4.5 w-4.5" />, href: '#', label: 'Discord' },
                { icon: <Globe className="h-4.5 w-4.5" />, href: '#', label: 'Website' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  onClick={() => playSfx('click')}
                  onMouseEnter={() => playSfx('hover')}
                  className="rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-zinc-400 hover:text-primary hover:border-primary/45 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-500">
              {['Home', 'Features', 'Gallery', 'Pricing'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={(e) => handleLinkClick(e, item)}
                    onMouseEnter={() => playSfx('hover')}
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Stable Diffusion Tech</h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-500">
              <li><span className="text-zinc-500">API Provider:</span> <a href="https://clipdrop.co" className="hover:text-primary transition-colors">Clipdrop API</a></li>
              <li><span className="text-zinc-500">Model:</span> Stable Diffusion XL</li>
              <li><span className="text-zinc-500">GPU Nodes:</span> Nvidia H100 Clusters</li>
              <li><span className="text-zinc-500">Host Engine:</span> Express.js & Flask</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contact & Info</h4>
            <div className="space-y-2 text-xs font-medium text-zinc-500">
              <p className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@pictoai.io</span>
              </p>
              <p className="text-xxs text-zinc-600 leading-normal">
                Demo-ready presentation layout built with React, Tailwind CSS, and Framer Motion.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[11px] text-zinc-600 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} PictoAI Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" onClick={() => playSfx('click')} className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" onClick={() => playSfx('click')} className="hover:text-zinc-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
