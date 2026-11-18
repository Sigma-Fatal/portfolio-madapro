'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

type GalleryImage = { src: string; alt: string };
type CardStackProps = {
  title: string;
  images: GalleryImage[];
};

export default function CardStack({ title, images }: CardStackProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Sécurité si images est undefined
  const safeImages = images || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayImages = safeImages.slice(0, 3);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
    setZoom(1);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (safeImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    setZoom(1);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (safeImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setZoom(1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) setZoom(prev => Math.min(prev + 0.2, 3));
    else setZoom(prev => Math.max(prev - 0.2, 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === '+') setZoom(prev => Math.min(prev + 0.2, 3));
      if (e.key === '-') setZoom(prev => Math.max(prev - 0.2, 1));
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, safeImages.length]);

  if (safeImages.length === 0) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={() => setIsModalOpen(false)}
    >
      <div 
        className="relative w-[90vw] h-[80vh] md:w-[70vw] md:h-[70vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-[#0a0a0a]"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#141414] z-10">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 1))} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors" title="Zoom arrière">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors" title="Zoom avant">
              <ZoomIn className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div 
          className="relative flex-grow bg-black flex items-center justify-center overflow-hidden cursor-crosshair"
          onWheel={handleWheel}
        >
          <div 
            className="relative w-full h-full transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
            <Image 
              src={`/parcours/${safeImages[currentIndex].src}`} 
              alt={safeImages[currentIndex].alt} 
              fill 
              className="object-contain" 
              sizes="(max-width: 768px) 90vw, 70vw"
              priority
            />
          </div>
          
          {safeImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 p-3 bg-black/50 hover:bg-green-500 text-white rounded-full transition-all backdrop-blur-md border border-white/10 z-10">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button onClick={nextImage} className="absolute right-4 p-3 bg-black/50 hover:bg-green-500 text-white rounded-full transition-all backdrop-blur-md border border-white/10 z-10">
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-sm border border-white/10 z-10">
            {currentIndex + 1} / {safeImages.length} • Zoom: {Math.round(zoom * 100)}%
          </div>
        </div>

        <div className="flex gap-3 p-4 overflow-x-auto bg-[#141414] border-t border-white/10 scrollbar-hide z-10">
          {safeImages.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => { setCurrentIndex(idx); setZoom(1); }}
              className={`relative w-20 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-green-500 scale-105 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <Image src={`/parcours/${img.src}`} alt={img.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full group perspective-1000 cursor-pointer">
        <div className="relative w-64 h-64 md:w-72 md:h-72" onClick={() => openModal(0)}>
          {displayImages.map((img, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={index}
                className={`absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ease-out ${
                  isFirst ? 'z-30' : index === 1 ? 'z-20' : 'z-10'
                }`}
                style={{
                  transform: `translateY(${index * -10}px) translateX(${index * 10}px) rotate(${index * 5 - 5}deg) scale(${1 - index * 0.05})`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `translateY(${index * -20}px) translateX(${index * 30}px) rotate(${index * 15 - 10}deg) scale(1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = `translateY(${index * -10}px) translateX(${index * 10}px) rotate(${index * 5 - 5}deg) scale(${1 - index * 0.05})`;
                }}
              >
                <Image src={`/parcours/${img.src}`} alt={img.alt} fill className="object-cover" />
                <div className={`absolute inset-0 transition-colors duration-500 flex items-center justify-center ${isFirst ? 'bg-black/20 group-hover:bg-black/40' : 'bg-black/60 group-hover:bg-black/30'}`}>
                   {isFirst && <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{safeImages.length} photo{safeImages.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {mounted && isModalOpen && createPortal(modalContent, document.body)}
    </>
  );
}