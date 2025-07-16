import React from 'react';
import { motion } from 'framer-motion';

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0,100 C30,90 70,90 100,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,80 C30,70 70,90 100,80"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.path
          d="M0,60 C20,75 50,60 100,60"
          fill="none"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.path
          d="M0,40 C40,45 60,30 100,40"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.path
          d="M0,20 C30,10 70,30 100,20"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.path
          d="M0,0 C30,10 70,0 100,0"
          fill="none"
          stroke="rgba(168, 85, 247, 0.1)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4.5, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Vertical paths */}
        <motion.path
          d="M20,0 C15,30 25,70 20,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 1.2 }}
        />
        <motion.path
          d="M40,0 C45,30 35,70 40,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.5, ease: "easeInOut", delay: 1.4 }}
        />
        <motion.path
          d="M60,0 C55,30 65,70 60,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 1.6 }}
        />
        <motion.path
          d="M80,0 C85,30 75,70 80,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.1)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4.5, ease: "easeInOut", delay: 1.8 }}
        />
        
        {/* Diagonal paths */}
        <motion.path
          d="M0,0 C30,30 70,70 100,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, ease: "easeInOut", delay: 2 }}
        />
        <motion.path
          d="M100,0 C70,30 30,70 0,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 5, ease: "easeInOut", delay: 2.2 }}
        />
        
        {/* Curved paths */}
        <motion.path
          d="M0,50 C25,25 75,75 100,50"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 2.4 }}
        />
        <motion.path
          d="M50,0 C25,25 75,75 50,100"
          fill="none"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 2.6 }}
        />
      </svg>
    </div>
  );
}