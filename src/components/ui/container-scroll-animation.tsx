import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Update window width on mount and resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1.2, 1]
  );
  
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    [0.3, 1, 1, 0.8]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    [1, 0.5, 0, 0]
  );

  const titleTranslateY = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0, -100]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black py-40"
      style={{
        perspective: "1000px",
      }}
    >
      <div className="relative flex flex-col items-center justify-start min-h-[80vh]">
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleTranslateY,
          }}
          className="relative z-10 text-center mb-10 px-4"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          ref={objectRef}
          style={{
            scale: imageScale,
            opacity: imageOpacity,
          }}
          className="relative z-0 w-full max-w-5xl mx-auto rounded-lg overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};