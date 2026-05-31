import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for a fluid high-end feel
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Increased rotation for a more dramatic 3D effect
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const spotlightBackground = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 80%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    
    mouseX.set(relX);
    mouseY.set(relY);
    
    x.set(relX / width - 0.5);
    y.set(relY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <div style={{ perspective: 1500 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative group"
      >
        <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="w-full h-full relative rounded-2xl">
          {children}
          
          {/* 3D Glare / Spotlight overlay */}
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none rounded-2xl mix-blend-screen transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: spotlightBackground }}
          />
        </div>
        
        {/* Floating 3D Backlight */}
        <div style={{ transform: "translateZ(10px)" }} className="absolute inset-0 z-[-1] rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </div>
  );
}
