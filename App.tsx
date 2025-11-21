import React, { useState, useEffect, useMemo } from 'react';
import { TiltCard } from './components/TiltCard';
import { QuantumCat } from './components/QuantumCat';
import { CheckItem } from './components/CheckItem';
import { physicsData } from './data';
import { ProgressState } from './types';
import { motion } from 'framer-motion';
import { Atom, Sparkles, RotateCcw, Camera, Share2, Download } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

const STORAGE_KEY = 'schrodinger_study_progress_v1';

const App: React.FC = () => {
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Initialize / Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const toggleItem = (itemLabel: string) => {
    setProgress(prev => ({
      ...prev,
      [itemLabel]: !prev[itemLabel]
    }));
  };

  const resetProgress = () => {
    if (confirm("Are you sure you want to collapse the wave function to zero? (Reset all progress)")) {
      setProgress({});
    }
  };

  const handleScreenshot = async () => {
    setIsCapturing(true);
    // Small delay to update UI state (e.g., show "Saving...")
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = document.getElementById('root');
    if (element) {
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: '#0f172a', // Match background color
          useCORS: true,
          scale: 2, // High resolution
          logging: false,
          // Crucial for capturing full scrollable content
          height: element.scrollHeight,
          windowHeight: element.scrollHeight, 
          scrollY: 0, // Start capturing from the very top
          onclone: (clonedDoc) => {
            const clonedRoot = clonedDoc.getElementById('root');
            const clonedHeader = clonedDoc.querySelector('header');
            
            // Ensure container expands to fit all content
            if (clonedRoot) {
              clonedRoot.style.height = 'auto';
              clonedRoot.style.overflow = 'visible';
              clonedRoot.style.maxHeight = 'none';
            }

            // Fix sticky header in screenshot: make it static/relative so it sits at the top
            // instead of floating over the content in the middle of the long image
            if (clonedHeader) {
              clonedHeader.style.position = 'relative';
              clonedHeader.style.top = '0';
              clonedHeader.style.backdropFilter = 'none'; // Remove blur for cleaner capture
              clonedHeader.style.background = '#0f172a'; // Solid bg for header
            }
          },
          ignoreElements: (element: Element) => {
            // Ignore the floating watermark during capture as we have a static footer one
            return element.classList.contains('fixed-watermark');
          }
        });
        
        const link = document.createElement('a');
        link.download = `薛定谔的自习室-复习长图-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Screenshot failed", err);
        alert("无法生成长图，请尝试使用浏览器自带截图功能。");
      }
    }
    setIsCapturing(false);
  };

  // Statistics
  const stats = useMemo(() => {
    let total = 0;
    let checked = 0;
    physicsData.forEach(chapter => {
      chapter.sections.forEach(sec => {
        sec.items.forEach(item => {
          total++;
          if (progress[item]) checked++;
        });
      });
    });
    return { total, checked, percentage: total === 0 ? 0 : Math.round((checked / total) * 100) };
  }, [progress]);

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Quantum State...</div>;

  return (
    <div id="root" className="min-h-screen bg-slate-900 text-slate-200 relative overflow-x-hidden selection:bg-purple-500 selection:text-white pb-20">
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.1) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      {/* Header */}
      <header className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-purple-400"
          >
            <Atom size={48} strokeWidth={1.5} />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 font-serif">
              必修三 - 电学上
            </h1>
            <p className="text-sm text-slate-400 font-tech tracking-widest mt-1 flex items-center gap-2">
              PHYSICS REVISION SYSTEM <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </p>
          </div>
        </div>

        {/* Global Progress & Actions */}
        <div className="flex items-center gap-6 w-full md:w-auto bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="flex-1 md:w-64">
            <div className="flex justify-between text-xs mb-2 font-tech">
              <span>QUANTUM COHERENCE</span>
              <span>{stats.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-purple-600 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="text-[10px] text-slate-500">
                {stats.checked} / {stats.total} OBSERVATIONS
              </div>
              
              {/* Screenshot Button */}
              <button 
                onClick={handleScreenshot}
                disabled={isCapturing}
                className="group flex items-center gap-2 text-xs bg-cyan-900/30 hover:bg-cyan-800/50 text-cyan-400 px-3 py-1.5 rounded-lg transition-all border border-cyan-800/50 hover:border-cyan-400/50 ml-4"
                title="Save entire page as image"
              >
                {isCapturing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span className="font-bold">导出长图</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <QuantumCat />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
          
          {physicsData.map((chapter) => {
            // Calculate chapter progress
            let chapTotal = 0;
            let chapChecked = 0;
            chapter.sections.forEach(s => s.items.forEach(i => {
              chapTotal++;
              if (progress[i]) chapChecked++;
            }));
            const chapPercent = chapTotal === 0 ? 0 : Math.round((chapChecked / chapTotal) * 100);
            const isComplete = chapPercent === 100;

            return (
              <TiltCard key={chapter.id} className="h-full">
                <div className={`
                  h-full p-6 rounded-2xl 
                  bg-slate-800/40 backdrop-blur-md 
                  border border-white/10 
                  shadow-xl
                  flex flex-col
                  group
                  relative
                  overflow-hidden
                `}>
                  {/* Card Header */}
                  <div className="mb-6 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-purple-200 font-serif leading-tight">
                        {chapter.title}
                      </h2>
                      {isComplete && <Sparkles className="text-yellow-400 animate-pulse" size={20} />}
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
                       <motion.div 
                          className="h-full bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${chapPercent}%` }}
                       />
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="flex-1 space-y-6 relative z-10">
                    {chapter.sections.map((section, sIdx) => (
                      <div key={sIdx}>
                        <h3 className="text-xs font-tech text-cyan-400 uppercase tracking-wider mb-3 border-b border-white/5 pb-1">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <CheckItem 
                              key={item} 
                              label={item} 
                              isChecked={!!progress[item]} 
                              onToggle={() => toggleItem(item)} 
                            />
                          ))}
                          {section.items.length === 0 && <p className="text-xs text-slate-600 italic">Content loading...</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Decorative Backing */}
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="relative z-10 mt-10 border-t border-white/10 bg-slate-900 p-8 flex flex-col items-center justify-center gap-4 text-slate-500">
        <button 
          onClick={resetProgress}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors text-sm"
        >
          <RotateCcw size={14} />
          Reset Universe
        </button>
        <p className="text-xs font-serif italic opacity-50">
          "God does not play dice with the universe." - Einstein
        </p>

        {/* Static Watermark for Screenshots */}
        <div className="mt-4 p-4 border border-white/20 rounded-xl bg-slate-800/50 flex flex-col items-center">
          <span className="text-xl font-bold text-white font-serif tracking-widest mb-1">
            薛定谔的自习室
          </span>
          <span className="text-[10px] text-cyan-400 font-tech tracking-[0.3em] uppercase">
            Physics Revision Verified
          </span>
          <div className="text-[10px] text-slate-400 mt-2">
            {new Date().toLocaleDateString()} • {stats.percentage}% COMPLETED
          </div>
        </div>
      </footer>

      {/* Floating Anti-Counterfeit Watermark - Hidden during screenshot via 'fixed-watermark' class logic */}
      <div className="fixed-watermark fixed bottom-6 right-6 z-50 pointer-events-none opacity-40 select-none mix-blend-screen hidden md:block">
        <div className="relative transform rotate-[-12deg] border-2 border-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <div className="absolute inset-0 border border-white/50 m-1 rounded"></div>
          <span className="text-2xl font-bold text-white font-serif tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            薛定谔的自习室
          </span>
          <div className="text-[10px] text-center text-white/80 font-tech mt-1 tracking-[0.5em]">VERIFIED</div>
        </div>
      </div>
      
      {/* Mobile Watermark */}
       <div className="fixed-watermark fixed bottom-2 right-2 z-50 pointer-events-none opacity-30 select-none md:hidden text-[10px] font-serif text-white border border-white/20 px-2 py-1 rounded bg-black/20">
          薛定谔的自习室
       </div>

    </div>
  );
};

export default App;