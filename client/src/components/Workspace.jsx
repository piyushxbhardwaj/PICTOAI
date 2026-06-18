import { useState, useEffect } from 'react';
import { useApp } from '../context/useApp';
import { 
  Sparkles, Wand2, RefreshCw, Layers, Sliders, Image, 
  Trash2, Monitor, Smartphone, Square 
} from 'lucide-react';

const Workspace = () => {
  const { 
    credits, 
    prefilledPrompt, 
    generateImage, 
    history,
    clearHistory, 
    deleteHistoryItem, 
    playSfx 
  } = useApp();

  const [prompt, setPrompt] = useState(prefilledPrompt || '');
  const [model, setModel] = useState('HD'); // 'Fast', 'HD', 'Creative'
  const [style, setStyle] = useState('Cyberpunk');
  const [aspect, setAspect] = useState('1:1'); // '1:1', '16:9', '9:16'
  const [strength, setStrength] = useState(75);
  
  // Loading & generation state
  const [generating, setGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Idle');
  const [activeImage, setActiveImage] = useState(null); // The currently displayed image object
  const [toast, setToast] = useState('');

  const safeHistory = Array.isArray(history) ? history : [];



  // Workspace remounts when the route changes back here, so the initial prompt is sufficient.

  // Simulated status message cycler during generation
  useEffect(() => {
    if (!generating) return;

    const statuses = [
      'Establishing GPU secure gateway...',
      'De-noising latent space matrix...',
      'Injecting prompt embeddings...',
      'Synthesizing RGB pixel tensor nodes...',
      'Aligning creative style weights...',
      'Applying final upscaling filters...'
    ];

    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      setLoadingStatus(statuses[statusIdx]);
      statusIdx = (statusIdx + 1) % statuses.length;
    }, 600);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 32);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, [generating]);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (!prompt.trim()) {
      playSfx('error');
      showToastMsg('Please enter a description prompt!');
      return;
    }

    if (credits <= 0) {
      playSfx('error');
      showToastMsg('No credits left! Purchase more credits in Pricing.');
      return;
    }

    setGenerating(true);
    setLoadingProgress(0);
    setLoadingStatus('Initializing H100 Node...');
    
    // Call API
    const res = await generateImage(prompt, model, style, aspect);
    
    setGenerating(false);
    
    if (res.success) {
      showToastMsg('Image Generated Successfully!');
      // Find the newly added item in history
      // Wait for React to sync state, or construct active image locally
      const mockActive = {
        id: Date.now().toString(), // matched with context id constructor
        prompt,
        url: res.image,
        model,
        style,
        aspect,
        timestamp: new Date().toLocaleTimeString(),
        isOffline: res.message && res.message.includes("Offline")
      };
      setActiveImage(mockActive);
    } else {
      showToastMsg(res.message || 'Generation Failed.');
    }
  };

  // Quick actions
  const triggerDownload = () => {
    if (!activeImage) return;
    playSfx('success');
    const link = document.createElement('a');
    link.href = activeImage.url;
    link.download = `pictoai_${activeImage.id}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerUpscale = () => {
    if (!activeImage) return;
    playSfx('click');
    showToastMsg('Upscaling to 4K resolution (simulated)...');
    
    // Trigger tiny delay
    setTimeout(() => {
      playSfx('success');
      showToastMsg('Upscale Complete! 2x detail added.');
    }, 1500);
  };

  const triggerVariation = () => {
    if (!activeImage) return;
    playSfx('click');
    setPrompt(`${activeImage.prompt}, variant style`);
    showToastMsg('Constructed prompt variation. Ready to generate.');
  };

  const selectHistoryItem = (item) => {
    playSfx('click');
    setActiveImage(item);
    setPrompt(item.prompt);
    setModel(item.model);
    setStyle(item.style);
    setAspect(item.aspect);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cyber-dark py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-cyber-black font-extrabold text-sm px-5 py-3 rounded-xl shadow-glow-yellow animate-fade-in flex items-center space-x-2">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Settings Workbench (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
                <div className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-white font-display">Generation Settings</h2>
                </div>
                <span className="text-xs font-semibold text-zinc-500">✨ Balance: {credits} credits</span>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">1. Creative Prompt</label>
                <div className="relative rounded-xl border border-zinc-800 bg-cyber-black p-3 focus-within:border-primary/50 transition-all duration-300">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your creative vision in detail... e.g. A chrome cybernetic lion in neon savanna sunset..."
                    className="w-full h-24 bg-transparent text-sm text-white placeholder-zinc-700 outline-none resize-none"
                    onFocus={() => playSfx('click')}
                  />
                  <button 
                    onClick={() => { playSfx('click'); setPrompt(''); }}
                    className="absolute bottom-2 right-2 text-xxs text-zinc-600 hover:text-zinc-400 underline"
                  >
                    Clear Prompt
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">2. AI Architecture Model</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Fast', label: 'Fast-HD', speed: '1.2s' },
                    { id: 'HD', label: 'Fusion-HD', speed: '1.4s' },
                    { id: 'Creative', label: 'Creative', speed: '1.8s' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { playSfx('click'); setModel(m.id); }}
                      className={`rounded-xl border p-3 text-left transition-all duration-300 cursor-pointer ${
                        model === m.id
                          ? 'border-primary bg-primary/5 shadow-glow-yellow'
                          : 'border-zinc-800 bg-cyber-black/50 hover:border-zinc-700'
                      }`}
                    >
                      <p className={`text-xs font-extrabold ${model === m.id ? 'text-primary' : 'text-white'}`}>{m.label}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{m.speed} render</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">3. Canvas Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1:1', label: '1:1 Square', icon: <Square className="h-4 w-4" /> },
                    { id: '16:9', label: '16:9 Landscape', icon: <Monitor className="h-4 w-4" /> },
                    { id: '9:16', label: '9:16 Portrait', icon: <Smartphone className="h-4 w-4" /> }
                  ].map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { playSfx('click'); setAspect(a.id); }}
                      className={`rounded-xl border p-3 flex flex-col items-center justify-center space-y-2 transition-all duration-300 cursor-pointer ${
                        aspect === a.id
                          ? 'border-primary bg-primary/5 shadow-glow-yellow text-primary'
                          : 'border-zinc-800 bg-cyber-black/50 hover:border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {a.icon}
                      <span className="text-xxs font-bold">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guidance strength */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span>4. Prompt Strength (Guidance)</span>
                  <span className="text-primary">{strength}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full accent-primary bg-zinc-800 h-1.5 rounded-full cursor-pointer"
                />
              </div>

              {/* Trigger Button */}
              <div className="pt-2 relative">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  onMouseEnter={() => playSfx('hover')}
                  className="w-full flex justify-center items-center py-4 bg-primary hover:bg-primary-hover text-cyber-black font-extrabold rounded-xl transition-all duration-300 shadow-glow disabled:opacity-50 cursor-pointer"
                >
                  <Wand2 className="h-5 w-5 mr-2 animate-pulse" />
                  <span>{generating ? 'Processing Render...' : 'Synthesize Art (1 Credit)'}</span>
                </button>
                
                {/* Powered by AI neon badge */}
                <div className="mt-3 flex justify-center items-center space-x-1.5 text-[10px] text-zinc-500 font-semibold tracking-widest uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                  <span className="text-zinc-600 hover:text-primary transition-colors cursor-default">Powered by PictoAI Cluster H100</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: Canvas Render Box (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between items-center flex-1 min-h-[450px] lg:min-h-0 relative overflow-hidden">
              
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-3xl"></div>

              {generating ? (
                /* LOADING SCREEN */
                <div className="flex flex-col items-center justify-center flex-1 space-y-8 w-full p-8 relative z-10">
                  
                  {/* Scanline wrapper */}
                  <div className="relative w-40 h-40 rounded-full border border-primary/20 bg-cyber-black flex items-center justify-center overflow-hidden shadow-glow-yellow">
                    <div className="scanline"></div>
                    <div className="absolute inset-0 bg-grid opacity-10"></div>
                    <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                  </div>

                  <div className="space-y-3 text-center w-full max-w-sm">
                    <p className="text-lg font-bold text-white tracking-wide">Rendering Masterpiece</p>
                    <p className="text-xs text-primary font-bold animate-pulse">{loadingStatus}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-900 border border-zinc-800 h-2.5 rounded-full overflow-hidden p-0.5 mt-2">
                      <div 
                        className="bg-primary h-full rounded-full shadow-glow-yellow transition-all duration-100" 
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xxs text-zinc-500">{loadingProgress}% completed</p>
                  </div>

                </div>
              ) : activeImage ? (
                /* OUTPUT RENDERED STATE */
                <div className="flex flex-col justify-between items-center flex-1 w-full relative z-10">
                  
                  {/* Aspect wrapper */}
                  <div className="flex-1 flex items-center justify-center w-full py-4">
                    <div className={`relative border border-zinc-800 bg-cyber-black rounded-xl overflow-hidden shadow-2xl transition-all duration-300 max-h-[45vh] ${
                      activeImage.aspect === '9:16' ? 'aspect-[9/16] h-[45vh]' : activeImage.aspect === '16:9' ? 'aspect-[16/9] w-full' : 'aspect-square h-[45vh]'
                    }`}>
                      <img 
                        src={activeImage.url} 
                        alt="AI Artwork output" 
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Generation mode badge */}
                      <div className="absolute top-3 right-3 z-20">
                        {activeImage.isOffline ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xxs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 backdrop-blur-md uppercase tracking-wider shadow-sm select-none">
                            <span className="h-1.5 w-1.5 mr-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            Offline Demo Render
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xxs font-extrabold bg-green-500/10 text-green-400 border border-green-500/30 backdrop-blur-md uppercase tracking-wider shadow-sm select-none">
                            <span className="h-1.5 w-1.5 mr-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Real AI Generation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="w-full pt-4 border-t border-zinc-800 flex flex-wrap gap-3 items-center justify-between">
                    <div className="space-y-1 max-w-[55%]">
                      <p className="text-xxs text-zinc-500 font-bold uppercase">Active Prompt</p>
                      <p className="text-xs text-zinc-300 truncate" title={activeImage.prompt}>{activeImage.prompt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={triggerUpscale}
                        onMouseEnter={() => playSfx('hover')}
                        className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:border-primary/50 transition-all cursor-pointer"
                      >
                        Upscale 4K
                      </button>
                      <button
                        onClick={triggerVariation}
                        onMouseEnter={() => playSfx('hover')}
                        className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:border-primary/50 transition-all cursor-pointer"
                      >
                        Variant
                      </button>
                      <button
                        onClick={triggerDownload}
                        onMouseEnter={() => playSfx('hover')}
                        className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-cyber-black hover:bg-primary-hover shadow-glow transition-all cursor-pointer"
                      >
                        Download
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                /* EMPTY PLACEHOLDER STATE */
                <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4 p-8 relative z-10">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-850 text-zinc-600">
                    <Image className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Visualizer Canvas</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Fill out your prompt setting parameters on the left and hit Synthesize Art to render your custom digital graphics.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* BOTTOM: Generation History Drawer */}
        <div className="mt-8">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Generation History ({safeHistory.length})</h3>
              </div>
              {safeHistory.length > 0 && (
                <button
                  onClick={() => { playSfx('click'); clearHistory(); setActiveImage(null); }}
                  onMouseEnter={() => playSfx('hover')}
                  className="flex items-center space-x-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {safeHistory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[220px] overflow-y-auto pr-1 pt-1">
                {safeHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectHistoryItem(item)}
                    onMouseEnter={() => playSfx('hover')}
                    className={`relative rounded-xl overflow-hidden aspect-square border cursor-pointer group transition-all duration-300 ${
                      activeImage && activeImage.id === item.id
                        ? 'border-primary ring-1 ring-primary shadow-glow-yellow'
                        : 'border-zinc-850 hover:border-zinc-700'
                    }`}
                  >
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    
                    {/* Delete item overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSfx('click');
                        deleteHistoryItem(item.id);
                        if (activeImage && activeImage.id === item.id) {
                          setActiveImage(null);
                        }
                      }}
                      className="absolute top-1.5 right-1.5 rounded-md bg-cyber-black/70 p-1 text-zinc-500 hover:text-red-400 hover:bg-cyber-black opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cyber-black/80 to-transparent p-1.5">
                      <p className="text-[8px] text-zinc-400 truncate">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-500">
                No history items found. Generated images will be saved here locally.
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Workspace;
