'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function ProjectGallery({ images, title }: { images: string[], title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="mt-4 mb-4">
      {/* Image principale */}
      <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/10">
        <Image 
          src={`/projets/${images[activeIdx]}`} 
          alt={`${title} - capture ${activeIdx + 1}`} 
          fill 
          className="object-contain" 
        />
      </div>
      
      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeIdx === idx ? 'border-green-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <Image src={`/projets/${img}`} alt="miniature" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}