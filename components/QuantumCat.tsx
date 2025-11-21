import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const QuantumCat: React.FC = () => {
  const [isAlive, setIsAlive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Randomly collapse the state occasionally to look "alive/dead" or glitchy
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setIsAlive(prev => !prev);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative w-32 h-32 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsAlive(prev => !prev)}
      title="Click to Observe"
    >
      {/* Box Container */}
      <motion.div 
        className="absolute inset-0 border-4 border-purple-500/50 rounded-xl bg-purple-900/20 backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        animate={{
          rotateY: isHovered ? 180 : 0,
          boxShadow: isAlive 
            ? "0 0 20px rgba(168,85,247,0.6)" 
            : "0 0 20px rgba(239,68,68,0.6)"
        }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {/* The Cat Content */}
        <div className="w-full h-full flex items-center justify-center">
          <motion.svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              opacity: isAlive ? 1 : 0.3,
              scale: isAlive ? 1 : 0.9,
              filter: isAlive ? "blur(0px)" : "blur(2px) grayscale(100%)"
            }}
          >
            {/* Ears */}
            <path d="M20 30 L30 10 L45 25" stroke={isAlive ? "#a855f7" : "#555"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M80 30 L70 10 L55 25" stroke={isAlive ? "#a855f7" : "#555"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Head */}
            <path d="M20 30 Q50 20 80 30 Q90 60 50 90 Q10 60 20 30" stroke={isAlive ? "#a855f7" : "#555"} strokeWidth="4" fill="transparent"/>
            
            {/* Eyes */}
            <motion.circle 
              cx="35" cy="50" r="5" 
              fill={isAlive ? "#22d3ee" : "#555"}
              animate={{ scaleY: isAlive ? [1, 0.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
            />
            <motion.circle 
              cx="65" cy="50" r="5" 
              fill={isAlive ? "#22d3ee" : "#555"}
              animate={{ scaleY: isAlive ? [1, 0.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 4, repeatDelay: 1.2 }}
            />

            {/* Nose */}
            <path d="M45 65 L55 65 L50 72 Z" fill={isAlive ? "#f472b6" : "#555"} />

            {/* Dead Eyes (X) - Only visible when dead */}
            {!isAlive && (
              <>
                <path d="M30 45 L40 55 M40 45 L30 55" stroke="#ef4444" strokeWidth="2" />
                <path d="M60 45 L70 55 M70 45 L60 55" stroke="#ef4444" strokeWidth="2" />
              </>
            )}
          </motion.svg>
        </div>
      </motion.div>

      {/* Label */}
      <motion.div 
        className="absolute -bottom-8 w-full text-center text-xs font-tech tracking-wider text-purple-300"
        animate={{ opacity: isHovered ? 1 : 0.6 }}
      >
        {isAlive ? "ALIVE" : "DEAD"}
      </motion.div>
    </div>
  );
};