'use client';

import React, { useState, useRef, useEffect } from 'react';

const codeLines = [
  [{ text: "const ", color: "text-pink-400" }, { text: "Developer", color: "text-blue-300" }, { text: " = () => {", color: "text-gray-300" }],
  [{ text: "  return (", color: "text-pink-400" }],
  [{ text: "    <", color: "text-gray-400" }, { text: "div", color: "text-green-400" }, { text: " className=", color: "text-yellow-300" }, { text: "\"passion\"", color: "text-orange-300" }, { text: ">", color: "text-gray-400" }],
  [{ text: "      <", color: "text-gray-400" }, { text: "h1", color: "text-green-400" }, { text: ">", color: "text-gray-400" }, { text: "Build solutions", color: "text-gray-300" }, { text: "</", color: "text-gray-400" }, { text: "h1", color: "text-green-400" }, { text: ">", color: "text-gray-400" }],
  [{ text: "      <", color: "text-gray-400" }, { text: "p", color: "text-green-400" }, { text: ">", color: "text-gray-400" }, { text: "for a better tomorrow", color: "text-gray-300" }, { text: "</", color: "text-gray-400" }, { text: "p", color: "text-green-400" }, { text: ">", color: "text-gray-400" }],
  [{ text: "    </", color: "text-gray-400" }, { text: "div", color: "text-green-400" }, { text: ">", color: "text-gray-400" }],
  [{ text: "  );", color: "text-pink-400" }],
  [{ text: "}", color: "text-gray-300" }],
];

export default function DraggableCodeWindow() {
  const [position, setPosition] = useState({ x: -120, y: -40 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const totalChars = codeLines.reduce((acc, line) => acc + line.reduce((sum, segment) => sum + segment.text.length, 0) + 1, 0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Positionnement initial
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPosition({ x: 10, y: 380 }); 
      } else {
        setPosition({ x: -120, y: -40 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logique d'animation de frappe (Boucle infinie)
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charCount < totalChars) {
      // En train d'écrire
      timeout = setTimeout(() => setCharCount(prev => prev + 1), 30);
    } else if (!isDeleting && charCount === totalChars) {
      // Fin de l'écriture : on attend 3 secondes puis on passe en mode effacement
      timeout = setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && charCount > 0) {
      // En train d'effacer
      timeout = setTimeout(() => setCharCount(prev => prev - 1), 15);
    } else if (isDeleting && charCount === 0) {
      // Fin de l'effacement : on attend 500ms puis on repasse en mode écriture
      timeout = setTimeout(() => setIsDeleting(false), 500);
    }

    return () => clearTimeout(timeout);
  }, [charCount, isDeleting, totalChars]);

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

  const renderCode = () => {
    let remainingChars = charCount;
    let isCursorDisplayed = false;

    return codeLines.map((line, lineIndex) => {
      if (remainingChars <= 0) {
        return <div key={lineIndex} className="h-[1.25em]"></div>;
      }

      const lineSegments = [];
      let lineCharsCount = 0;

      for (const segment of line) {
        if (remainingChars > 0) {
          const charsToShow = Math.min(segment.text.length, remainingChars);
          lineSegments.push(
            <span key={lineCharsCount} className={segment.color}>
              {segment.text.slice(0, charsToShow)}
            </span>
          );
          remainingChars -= charsToShow;
          lineCharsCount += charsToShow;
        } else {
          break;
        }
      }

      const cursorHere = remainingChars === 0 && !isCursorDisplayed;
      if (cursorHere) isCursorDisplayed = true;
      
      if (lineIndex < codeLines.length - 1 && remainingChars > 0) {
        remainingChars -= 1;
      }

      return (
        <div key={lineIndex} className="whitespace-pre h-[1.25em] md:h-[1.5em]">
          {lineSegments}
          {cursorHere && (
            <span className="inline-block w-1 md:w-1.5 h-3 md:h-4 bg-green-500 animate-pulse ml-0.5 align-middle"></span>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`absolute z-30 bg-[#141414]/95 backdrop-blur-md border border-white/10 p-2 md:p-4 rounded-xl shadow-2xl transition-shadow duration-200 w-52 md:w-80 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:border-green-500/50'
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        userSelect: isDragging ? 'none' : 'auto',
        touchAction: 'none'
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
      
      <div className="font-mono text-[8px] md:text-sm text-gray-300 h-28 md:h-44 overflow-hidden relative leading-tight md:leading-normal">
        <div className="pointer-events-none">
          {renderCode()}
        </div>
      </div>
    </div>
  );
}