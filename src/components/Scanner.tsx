import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, X, RefreshCw, Zap } from 'lucide-react';

interface ScannerProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6">
            <p className="mb-4">{error}</p>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white text-black rounded-full font-semibold"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Scanner Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 border-2 border-white/30 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-[2.5rem] animate-pulse-soft" />
                
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10"
                />

                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Align Ingredients
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
              <button 
                onClick={onClose}
                className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex gap-3">
                 <button className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                  <Zap className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12">
               <button className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
                <RefreshCw className="w-6 h-6" />
              </button>
              
              <button 
                onClick={capture}
                disabled={!isReady}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-stone-300 active:scale-90 transition-transform disabled:opacity-50"
              >
                <div className="w-16 h-16 rounded-full border-2 border-stone-800" />
              </button>

              <div className="w-14 h-14" /> {/* Spacer */}
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};
