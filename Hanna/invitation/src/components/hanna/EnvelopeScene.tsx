"use client";

import React, { useEffect, useState } from "react";
import { ENVELOPE_STAGE_WIDTH, ENVELOPE_STAGE_HEIGHT, EnvelopeState } from "@/config/envelopeCalibration";
import { Envelope3D } from "./Envelope3D";

interface EnvelopeSceneProps {
  state: EnvelopeState;
  onEntranceComplete: () => void;
  onFlipComplete: () => void;
  onClick: () => void;
  reduceMotion: boolean;
  debugAngle?: number;
}

export const EnvelopeScene: React.FC<EnvelopeSceneProps> = (props) => {
  const [scale, setScale] = useState(1);
  const shadowRef = React.useRef<HTMLDivElement>(null);

  // Responsive scaler
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const isMobile = windowWidth <= 768;
      // Target viewport width occupation
      const targetVw = isMobile ? 0.90 : 0.60;
      
      // Calculate max allowed sizes based on window
      const maxW = windowWidth * targetVw;
      // Leave some padding top and bottom (e.g., 90vh max)
      const maxH = windowHeight * 0.90;

      const scaleX = maxW / ENVELOPE_STAGE_WIDTH;
      const scaleY = maxH / ENVELOPE_STAGE_HEIGHT;
      
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        perspective: "1600px", // 3D Camera depth
      }}
    >
      <div
        style={{
          width: ENVELOPE_STAGE_WIDTH,
          height: ENVELOPE_STAGE_HEIGHT,
          transform: `scale(${scale})`,
          position: "relative",
          transformStyle: "preserve-3d", // Pass 3D to children
        }}
      >
        {/* GROUND SHADOW OUTSIDE THE MOTION WRAPPER */}
        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%", // Stage center
            width: 1400,
            height: 100,
            marginLeft: -700,
            marginTop: 400, // Below envelope
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)",
            opacity: 0,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />
        <Envelope3D {...props} shadowRef={shadowRef} />
      </div>
    </div>
  );
};
