"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ENVELOPE_CONSTANTS, EnvelopeState } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";

interface Envelope3DProps {
  state: EnvelopeState;
  onEntranceComplete: () => void;
  onFlipComplete: () => void;
  onClick: () => void;
  debugAngle?: number; // For /dev/hanna-motion
}

export const Envelope3D: React.FC<Envelope3DProps> = ({
  state,
  onEntranceComplete,
  onFlipComplete,
  onClick,
  debugAngle,
}) => {
  const motionWrapperRef = useRef<HTMLDivElement>(null);
  const flipWrapperRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLImageElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  
  // Track timelines to kill them cleanly
  const floatTl = useRef<gsap.core.Timeline | null>(null);

  // Constants
  const { BASE_X, BASE_Y, BASE_SCALE, FRONT_FACE_WIDTH, FRONT_FACE_HEIGHT, FRONT_FACE_SCALE_X, FRONT_FACE_SCALE_Y, FRONT_FACE_X, FRONT_FACE_Y, EDGE_LOGICAL_WIDTH, EDGE_LOGICAL_HEIGHT } = ENVELOPE_CONSTANTS;

  useGSAP(() => {
    // 1. Entrance Animation
    if (state === "ENVELOPE_ENTERING") {
      gsap.fromTo(
        motionWrapperRef.current,
        { y: "110dvh", scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.45, ease: "power2.out", onComplete: onEntranceComplete }
      );
      gsap.fromTo(
        shadowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.3, scale: 1, duration: 1.45, ease: "power2.out" }
      );
    }

    // 2. Idle Floating Animation
    if (state === "ENVELOPE_IDLE") {
      // Ensure we start from a clean slate
      if (floatTl.current) floatTl.current.kill();
      
      floatTl.current = gsap.timeline({ repeat: -1, yoyo: true });
      floatTl.current.to(motionWrapperRef.current, {
        y: "-=4",
        rotationZ: 0.2,
        duration: 3.2,
        ease: "sine.inOut",
      }, 0);
      floatTl.current.to(shadowRef.current, {
        scale: 1.02,
        opacity: 0.2, // weaker when envelope is higher
        duration: 3.2,
        ease: "sine.inOut",
      }, 0);
    }

    // 3. Flip Animation
    if (state === "ENVELOPE_TURNING") {
      // Kill float and gently stabilize
      if (floatTl.current) {
        floatTl.current.kill();
        floatTl.current = null;
      }
      
      const flipTl = gsap.timeline({
        onComplete: onFlipComplete,
      });

      // Stabilize
      flipTl.to(motionWrapperRef.current, {
        y: 0,
        rotationZ: 0,
        duration: 0.2,
        ease: "power2.inOut",
      }, 0);
      flipTl.to(shadowRef.current, {
        scale: 1,
        opacity: 0.3,
        duration: 0.2,
        ease: "power2.inOut",
      }, 0);

      // Flip
      flipTl.to(
        flipWrapperRef.current,
        {
          rotationY: 180,
          duration: 0.85,
          ease: "power2.inOut",
        },
        ">" // start right after stabilization
      );
      
      // Slight scale depth effect
      flipTl.to(
        flipWrapperRef.current,
        {
          scale: 0.985,
          duration: 0.425,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        "<"
      );

      // Edge visibility
      flipTl.to(
        edgeRef.current,
        {
          opacity: 1,
          duration: 0.1,
        },
        "<0.35"
      );
      flipTl.to(
        edgeRef.current,
        {
          opacity: 0,
          duration: 0.1,
        },
        ">0.1"
      );

      // Shading / Lighting on Front
      flipTl.to(
        frontFaceRef.current,
        {
          filter: "brightness(0.7)",
          duration: 0.425,
          ease: "power1.in",
        },
        "<0"
      );
      // Shading / Lighting on Back
      gsap.set(backFaceRef.current, { filter: "brightness(0.7)" });
      flipTl.to(
        backFaceRef.current,
        {
          filter: "brightness(1)",
          duration: 0.425,
          ease: "power1.out",
        },
        ">"
      );
    }
  }, [state]);

  // Dev debugging override
  useGSAP(() => {
    if (debugAngle !== undefined && flipWrapperRef.current) {
      if (floatTl.current) floatTl.current.kill();
      gsap.killTweensOf(flipWrapperRef.current);
      gsap.killTweensOf(frontFaceRef.current);
      gsap.killTweensOf(backFaceRef.current);
      gsap.killTweensOf(edgeRef.current);
      
      gsap.set(flipWrapperRef.current, { rotationY: debugAngle });
      gsap.set(edgeRef.current, { opacity: debugAngle > 70 && debugAngle < 110 ? 1 : 0 });
      gsap.set(frontFaceRef.current, { filter: debugAngle > 45 ? "brightness(0.7)" : "brightness(1)" });
      gsap.set(backFaceRef.current, { filter: debugAngle < 135 ? "brightness(0.7)" : "brightness(1)" });
    }
  }, [debugAngle]);

  const interactable = state === "ENVELOPE_IDLE" && debugAngle === undefined;

  return (
    <div
      ref={motionWrapperRef}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 1672 * BASE_SCALE,
        height: 941 * BASE_SCALE,
        marginLeft: -1672 * BASE_SCALE / 2 + BASE_X,
        marginTop: -941 * BASE_SCALE / 2 + BASE_Y,
        cursor: interactable ? "pointer" : "default",
        pointerEvents: interactable ? "auto" : "none",
        willChange: "transform, opacity",
      }}
      onClick={() => {
        if (interactable) onClick();
      }}
      role="button"
      tabIndex={0}
      aria-label="Ouvrir l'enveloppe"
      onKeyDown={(e) => {
        if (interactable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* GROUND SHADOW */}
      <div
        ref={shadowRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          width: 1400 * BASE_SCALE,
          height: 100 * BASE_SCALE,
          marginLeft: -700 * BASE_SCALE,
          marginTop: 20, // slightly below envelope
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 70%)",
          opacity: 0,
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      />
      {/* 3D Rotator */}
      <div
        ref={flipWrapperRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* FRONT FACE */}
        <div
          ref={frontFaceRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: FRONT_FACE_WIDTH,
            height: FRONT_FACE_HEIGHT,
            marginLeft: -FRONT_FACE_WIDTH / 2,
            marginTop: -FRONT_FACE_HEIGHT / 2,
            transform: `translate(${FRONT_FACE_X}px, ${FRONT_FACE_Y}px) scale(${FRONT_FACE_SCALE_X}, ${FRONT_FACE_SCALE_Y})`,
            backfaceVisibility: "hidden",
            backgroundImage: `url(/assets/hanna${HANNA_ASSETS["envelope-front"].sourcePath})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        {/* EDGE */}
        <img
          ref={edgeRef}
          src={`/assets/hanna${HANNA_ASSETS["envelope-edge"].sourcePath}`}
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: EDGE_LOGICAL_WIDTH,
            height: EDGE_LOGICAL_HEIGHT,
            marginLeft: -EDGE_LOGICAL_WIDTH / 2,
            marginTop: -EDGE_LOGICAL_HEIGHT / 2,
            opacity: 0,
            transform: `translateZ(-1px)`, // Slightly behind the front to avoid z-fighting at exactly 90 deg
            pointerEvents: "none",
          }}
        />

        {/* BACK FACE */}
        <div
          ref={backFaceRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: `url(/assets/hanna${HANNA_ASSETS["envelope-back-closed"].sourcePath})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* SEAL */}
          <img
            src={`/assets/hanna${HANNA_ASSETS["envelope-seal"].sourcePath}`}
            alt="Seal"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 1254,
              height: 1254,
              marginLeft: -1254 / 2,
              marginTop: -1254 / 2,
              transform: `translate(-0.88px, 148.09px) scale(0.1214)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
