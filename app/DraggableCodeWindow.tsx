'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function DraggableCodeWindow() {
  // Position par défaut (Desktop)
  const [position, setPosition] = useState({ x: -120, y: -40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [displayedCode, setDisplayedCode] = useState('');
  const fullCode = `const Developer = () => {\n  return (\n    <div className="passion">\n      <h1>Build solutions</h1>\n      <p>for a better tomorrow</p>\n    </div>\n  );\n}`;

  // Détection de la taille de l'écran pour ajuster la position initiale
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Sur Mobile : on le place tout en bas pour ne pas cacher le visage
        setPosition({ x: 10, y: 280 }); 
      } else {
        // Sur PC : on garde la position initiale
        setPosition({ x: -120, y: -40 });
      }
    };

    handleResize(); // Applique au chargement
    window.addEventListener('resize', handleResize); // Applique si on redimensionne
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logique d'animation de frappe
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeLoop = () => {
      if (!isDeleting && currentIndex <= fullCode.length) {
        setDisplayedCode(fullCode.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeLoop, currentIndex === fullCode.length ? 2000 : 30);
      } else if (isDeleting && currentIndex >= 0) {
        setDisplayedCode(fullCode.slice(0, currentIndex));
        currentIndex--;
        timeoutId = setTimeout(typeLoop, 15);
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) currentIndex = 0;
        timeoutId = setTimeout(typeLoop, 500);
      }
    };

    typeLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { x: clientX - position.x, y: clientY - position.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      // Limites pour ne pas sortir de l'écran
      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.max(0, Math.min(clientX - dragRef.current.x, maxX)),
        y: Math.max(0, Math.min(clientY - dragRef.current.y, maxY)),
      });
    };

    const onUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`absolute z-30 bg-[#141414]/95 backdrop-blur-md border border-white/10 p-2 md:p-4 rounded-xl shadow-2xl transition-shadow duration-200 w-40 md:w-80 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:border-green-500/50'
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        userSelect: isDragging ? 'none' : 'auto',
        touchAction: 'none' // Empêche le scroll de la page quand on déplace la fenêtre
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      <div className="flex gap-1.5 mb-2 md:mb-3 cursor-grab">
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
        <span className="text-[9px] md:text-xs text-gray-500 ml-1 md:ml-2 font-mono">Delmas.tsx</span>
      </div>
      
      <div className="font-mono text-[8px] md:text-sm text-gray-300 h-24 md:h-40 overflow-hidden relative leading-tight md:leading-normal">
        <pre className="whitespace-pre-wrap pointer-events-none">
          {displayedCode.split('\n').map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line}
            </div>
          ))}
          <span className="inline-block w-1 h-2 md:w-2 md:h-4 bg-green-500 animate-pulse ml-0.5 align-middle"></span>
        </pre>
      </div>
    </div>
  );
}