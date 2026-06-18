import { useState } from 'react';
import { useApp } from '../context/useApp';
import { Download, Copy, Maximize2, X, CornerUpLeft } from 'lucide-react';

const Gallery = () => {
  const { playSfx, setPrefilledPrompt, setActiveTab } = useApp();
  const [lightboxImg, setLightboxImg] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const galleryItems = [
    {
      id: 'gal1',
      title: 'Neon Ronin',
      prompt: 'Cyberpunk samurai warrior standing in neon rain, Tokyo alleyway, neon signs reflections, dark environment, gold trim katana, volumetric fog, Unreal Engine 5 render, 8k resolution',
      style: 'Cyberpunk',
      aspect: '9:16',
      resolution: '1024 x 1820',
      url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'gal2',
      title: 'Solitude in Space',
      prompt: 'Photorealistic golden astronaut exploring a lush, neon biome jungle on an alien planet, glowing plants, cosmic sky with gas giant in background, cinematic composition, award winning shot',
      style: 'Photorealistic',
      aspect: '1:1',
      resolution: '1024 x 1024',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'gal3',
      title: 'Cyber Renaissance',
      prompt: 'Oil painting of a cybernetic angel with wings made of golden optic fibers, classical renaissance art style mixed with futuristic technology, dramatic side lighting, rich gold accents',
      style: 'Oil Painting',
      aspect: '16:9',
      resolution: '1456 x 816',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'gal4',
      title: 'Retro Grid City',
      prompt: 'Sleek yellow futuristic sports car driving down a digital synthwave highway grid toward a setting neon sun, wireframe mountains, retro 80s synth aesthetic',
      style: 'Anime / Retro',
      aspect: '16:9',
      resolution: '1456 x 816',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'gal5',
      title: 'Mech-Geisha',
      prompt: 'Cybernetic Geisha portrait, white ceramic skin plates, yellow neon tubing running through neck wires, futuristic cyberpunk fashion, high contrast studio lighting',
      style: '3D Render',
      aspect: '9:16',
      resolution: '1024 x 1820',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'gal6',
      title: 'Sanctuary of Light',
      prompt: 'Ancient golden floating temple complex drifting above clouds at sunrise, glowing yellow energy bridges, ethereal light rays, architectural concept art, highly detailed',
      style: '3D Render',
      aspect: '1:1',
      resolution: '1024 x 1024',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const handleCopyPrompt = (e, id, promptText) => {
    e.stopPropagation();
    playSfx('click');
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (promptText) => {
    playSfx('click');
    setPrefilledPrompt(promptText);
    setActiveTab('workspace');
    setLightboxImg(null);
  };

  const triggerDownload = (e, url, title) => {
    e.stopPropagation();
    playSfx('success');
    
    // Simulate file download by creating a virtual link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_pictoai.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="gallery" className="relative py-20 bg-cyber-dark overflow-hidden border-b border-cyber-border">
      
      {/* Light glow */}
      <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">PictoAI Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            Curated Community Masterpieces
          </h2>
          <p className="text-zinc-400">
            Browse through gorgeous AI artwork created by other users. Hover to copy prompts, view details, or import prompts directly.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => { playSfx('click'); setLightboxImg(item); }}
              onMouseEnter={() => playSfx('hover')}
              className="group relative rounded-2xl border border-zinc-800 bg-cyber-black overflow-hidden cursor-pointer shadow-lg hover:border-primary/40 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
            >
              
              {/* Image Aspect ratio container */}
              <div className={`relative overflow-hidden w-full ${
                item.aspect === '9:16' ? 'aspect-[3/4]' : item.aspect === '16:9' ? 'aspect-[16/9]' : 'aspect-square'
              }`}>
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Glow tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/90 via-cyber-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  
                  <span className="text-xs font-black uppercase text-primary mb-1 tracking-widest font-display">
                    {item.style}
                  </span>
                  
                  <h4 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4">
                    {item.prompt}
                  </p>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => handleCopyPrompt(e, item.id, item.prompt)}
                      className="rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-zinc-400 hover:text-white hover:border-primary/50 transition-colors"
                      title="Copy Prompt"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => triggerDownload(e, item.url, item.title)}
                      className="rounded-lg bg-zinc-900 border border-zinc-800 p-2 text-zinc-400 hover:text-white hover:border-primary/50 transition-colors"
                      title="Download Image"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <div className="flex-1 flex justify-end">
                      <button className="flex items-center space-x-1 text-xs text-primary font-bold hover:underline">
                        <span>Details</span>
                        <Maximize2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status banner (copystate) */}
              {copiedId === item.id && (
                <div className="absolute top-4 left-4 bg-emerald-500 text-cyber-black font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-lg animate-fade-in">
                  Prompt Copied!
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Preview Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-cyber-border-glow bg-cyber-dark shadow-glow-lg flex flex-col md:flex-row">
            
            {/* Close */}
            <button
              onClick={() => { playSfx('click'); setLightboxImg(null); }}
              className="absolute top-4 right-4 z-10 rounded-full bg-cyber-black/75 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left Image Side */}
            <div className="w-full md:w-1/2 bg-zinc-950 flex items-center justify-center max-h-[50vh] md:max-h-none">
              <img
                src={lightboxImg.url}
                alt={lightboxImg.title}
                className="w-full h-full object-contain max-h-[40vh] md:max-h-[70vh]"
              />
            </div>

            {/* Right Meta details Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <div>
                  <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold text-primary font-display">
                    {lightboxImg.style}
                  </span>
                  <h3 className="text-2xl font-display font-extrabold text-white mt-3">
                    {lightboxImg.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Prompt</h4>
                  <div className="rounded-xl border border-zinc-800 bg-cyber-black p-4 text-sm text-zinc-300 leading-relaxed font-sans select-all">
                    {lightboxImg.prompt}
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/40 p-3">
                    <p className="text-xxs text-zinc-500 uppercase tracking-wider font-semibold">Dimensions</p>
                    <p className="text-sm font-bold text-white">{lightboxImg.resolution}</p>
                  </div>
                  <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/40 p-3">
                    <p className="text-xxs text-zinc-500 uppercase tracking-wider font-semibold">Aspect Ratio</p>
                    <p className="text-sm font-bold text-white">{lightboxImg.aspect}</p>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => handleUsePrompt(lightboxImg.prompt)}
                  className="flex-1 flex justify-center items-center space-x-2 rounded-xl bg-primary hover:bg-primary-hover py-3 text-sm font-bold text-cyber-black shadow-glow"
                >
                  <CornerUpLeft className="h-4 w-4" />
                  <span>Import Prompt</span>
                </button>
                <button
                  onClick={(e) => handleCopyPrompt(e, lightboxImg.id, lightboxImg.prompt)}
                  className="flex justify-center items-center space-x-2 rounded-xl border border-zinc-700 hover:border-white px-5 py-3 text-sm font-bold text-zinc-300 hover:text-white transition-all"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedId === lightboxImg.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={(e) => triggerDownload(e, lightboxImg.url, lightboxImg.title)}
                  className="flex justify-center items-center space-x-2 rounded-xl border border-zinc-700 hover:border-white px-5 py-3 text-sm font-bold text-zinc-300 hover:text-white transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Gallery;
