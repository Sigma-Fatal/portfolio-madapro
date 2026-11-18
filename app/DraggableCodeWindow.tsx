'use client';

import React, { useState, useRef, useEffect } from 'react';

// Fonction de coloration syntaxique basique
const highlightCode = (code: string) => {
  return code
    .replace(/\b(const|return|for|let)\b/g, '<span class="text-pink-400">$1</span>')
    .replace(/&lt;(\/?[a-zA-Z0-9]+)/g, '&lt;<span class="text-green-400">$1</span>')
    .replace(/(className=)/g, '<span class="text-yellow-300">$1</span>')
    .replace(/("[^"]*")/g, '<span class="text-orange-300">$1</span>');
};

export default function DraggableCodeWindow() {
  const [position, setPosition] = useState({ x: -120, y: -40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const [displayedCode, setDisplayedCode] = useState('');
  const fullCode = `const Developer = () => {\n  return (\n    <div className="passion">\n      <h1>Build solutions</h1>\n      <p>for a better tomorrow</p>\n    </div>\n  );\n}`;

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeLoop = () => {
      if (!isDeleting && currentIndex <= fullCode.length) {
        // En train d'écrire
        setDisplayedCode(fullCode.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(typeLoop, currentIndex === fullCode.length ? 2000 : 30); // Pause 2s à la fin
      } else if (isDeleting && currentIndex >= 0) {
        // En train d'effacer
        setDisplayedCode(fullCode.slice(0, currentIndex));
        currentIndex--;
        timeoutId = setTimeout(typeLoop, 15);
      } else {
        // Recommencer
        isDeleting = !isDeleting;
        if (!isDeleting) currentIndex = 0;
        timeoutId = setTimeout(typeLoop, 500);
      }
    };

    typeLoop();
    return () => clearTimeout(timeoutId);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
      }
    };
    const onMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`absolute z-30 bg-[#141414]/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl w-64 md:w-80 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:border-green-500/50'
      } transition-shadow duration-200`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, userSelect: isDragging ? 'none' : 'auto' }}
      onMouseDown={onMouseDown}
    >
      <div className="flex gap-1.5 mb-3 cursor-grab">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="text-xs text-gray-500 ml-2 font-mono">Delmas.tsx</span>
      </div>
      
      <div className="font-mono text-xs md:text-sm text-gray-300 h-40 overflow-hidden relative">
        <pre className="whitespace-pre-wrap pointer-events-none">
          <span dangerouslySetInnerHTML={{ __html: highlightCode(displayedCode) }} />
          <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1 align-middle"></span>
        </pre>
      </div>
    </div>
  );
}