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
  shadowRef: React.RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  debugAngle?: number; // For /dev/hanna-motion
}

export const Envelope3D: React.FC<Envelope3DProps> = ({
  state,
  onEntranceComplete,
  onFlipComplete,
  onClick,
  shadowRef,
  reduceMotion,
  debugAngle,
}) => {
  const motionWrapperRef = useRef<HTMLDivElement>(null);
  const flipWrapperRef = useRef<HTMLDivElement>(null);
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
      const duration = reduceMotion ? 0.8 : 1.45;
      
      gsap.fromTo(
        motionWrapperRef.current,
        { y: "110dvh", scale: reduceMotion ? 1 : 0.94, opacity: 0 },
        {
          y: reduceMotion ? 0 : -8,
          scale: 1,
          opacity: 1,
          duration: duration * 0.7,
          ease: "power2.out",
          onComplete: () => {
            if (!reduceMotion) {
              gsap.to(motionWrapperRef.current, {
                y: 0,
                duration: duration * 0.3,
                ease: "power1.inOut",
                onComplete: onEntranceComplete
              });
            } else {
              onEntranceComplete();
            }
          }
        }
      );
      
      if (shadowRef.current) {
        gsap.fromTo(
          shadowRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 0.3, scale: 1, duration: duration, ease: "power2.out" }
        );
      }
    }

    // 2. Idle Floating Animation
    if (state === "ENVELOPE_IDLE") {
      if (floatTl.current) floatTl.current.kill();
      
      if (!reduceMotion) {
        floatTl.current = gsap.timeline({ repeat: -1, yoyo: true });
        floatTl.current.to(motionWrapperRef.current, {
          y: "-=4",
          rotationZ: 0.2,
          duration: 3.2,
          ease: "sine.inOut",
        }, 0);
        
        if (shadowRef.current) {
          floatTl.current.to(shadowRef.current, {
            scale: 1.02,
            opacity: 0.2, // weaker when envelope is higher
            duration: 3.2,
            ease: "sine.inOut",
          }, 0);
        }
      }
    }

    // 3. Flip Animation
    if (state === "ENVELOPE_TURNING") {
      if (floatTl.current) {
        floatTl.current.kill();
        floatTl.current = null;
      }
      
      const flipTl = gsap.timeline({
        onComplete: onFlipComplete,
      });
      
      const flipDuration = reduceMotion ? 0.4 : 0.85;

      flipTl.addLabel("stabilize", 0);
      
      // Stabilize
      flipTl.to(motionWrapperRef.current, {
        y: 0,
        rotationZ: 0,
        duration: 0.2,
        ease: "power2.inOut",
      }, "stabilize");
      
      if (shadowRef.current) {
        flipTl.to(shadowRef.current, {
          scale: 1,
          opacity: 0.3,
          duration: 0.2,
          ease: "power2.inOut",
        }, "stabilize");
      }

      flipTl.addLabel("flipStart", "+=0"); // Starts after stabilize completes due to timeline sequence? No, wait. 
      // Actually, let's sequence manually:
      const flipStartTime = 0.2; // absolute time
      const flipMidTime = flipStartTime + (flipDuration / 2);
      const flipEndTime = flipStartTime + flipDuration;
      
      flipTl.addLabel("flipStart", flipStartTime);
      flipTl.addLabel("flipMid", flipMidTime);
      flipTl.addLabel("flipEnd", flipEndTime);

      // Flip rotateY
      flipTl.to(
        flipWrapperRef.current,
        {
          rotationY: 180,
          duration: flipDuration,
          ease: "power2.inOut",
        },
        "flipStart"
      );
      
      if (!reduceMotion) {
        // Slight scale depth effect
        flipTl.to(
          flipWrapperRef.current,
          {
            scale: 0.985,
            duration: flipDuration / 2,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          "flipStart"
        );
      }

      // Edge visibility based on new angle constants
      // Angle goes from 0 to 180 over `flipDuration` with `power2.inOut`.
      // Using time mapping linearly is an approximation, but close enough.
      const timePerDeg = flipDuration / 180;
      const tFadeIn = flipStartTime + (ENVELOPE_CONSTANTS.EDGE_FADE_IN_START * timePerDeg);
      const tFull = flipStartTime + (ENVELOPE_CONSTANTS.EDGE_FULL_START * timePerDeg);
      const tFullEnd = flipStartTime + (ENVELOPE_CONSTANTS.EDGE_FULL_END * timePerDeg);
      const tFadeOut = flipStartTime + (ENVELOPE_CONSTANTS.EDGE_FADE_OUT_END * timePerDeg);

      flipTl.to(edgeRef.current, { opacity: 1, duration: tFull - tFadeIn, ease: "none" }, tFadeIn);
      flipTl.to(edgeRef.current, { opacity: 0, duration: tFadeOut - tFullEnd, ease: "none" }, tFullEnd);

      // Shading / Lighting on Front
      flipTl.to(
        frontFaceRef.current,
        {
          filter: "brightness(0.72)",
          duration: flipDuration / 2,
          ease: "power1.in",
        },
        "flipStart"
      );
      
      // Shading / Lighting on Back
      gsap.set(backFaceRef.current, { filter: "brightness(0.72)" });
      flipTl.to(
        backFaceRef.current,
        {
          filter: "brightness(1)",
          duration: flipDuration / 2,
          ease: "power1.out",
        },
        "flipMid"
      );
    }
  }, [state, reduceMotion, shadowRef]);

  // Dev debugging override
  useGSAP(() => {
    if (debugAngle !== undefined && flipWrapperRef.current) {
      if (floatTl.current) floatTl.current.kill();
      gsap.killTweensOf(flipWrapperRef.current);
      gsap.killTweensOf(frontFaceRef.current);
      gsap.killTweensOf(backFaceRef.current);
      gsap.killTweensOf(edgeRef.current);
      
      gsap.set(flipWrapperRef.current, { rotationY: debugAngle });
      const isMid = debugAngle > 80 && debugAngle < 100;
      gsap.set(edgeRef.current, { opacity: isMid ? 1 : 0 });
      gsap.set(frontFaceRef.current, { filter: debugAngle > 45 ? "brightness(0.72)" : "brightness(1)" });
      gsap.set(backFaceRef.current, { filter: debugAngle < 135 ? "brightness(0.72)" : "brightness(1)" });
    }
  }, [debugAngle]);

  const isInteractiveState = state === "ENVELOPE_IDLE";
  const isDebugActive = debugAngle !== undefined;
  const interactable = isInteractiveState && !isDebugActive;
  
  // Will-change should only be active during animation
  const isAnimating = state === "ENVELOPE_ENTERING" || state === "ENVELOPE_TURNING" || state === "ENVELOPE_IDLE";
  const willChange = isAnimating ? "transform, opacity" : "auto";

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
        willChange: willChange,
      }}
      onClick={() => {
        if (interactable) onClick();
      }}
      role="button"
      tabIndex={interactable ? 0 : -1}
      aria-disabled={!interactable}
      aria-label="Ouvrir l'enveloppe"
      onKeyDown={(e) => {
        if (interactable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* EDGE - OUTSIDE THE MAIN ROTATE-Y FLOW TO PREVENT SQUASHING */}
      <img
        ref={edgeRef}
        src={`/assets/hanna${HANNA_ASSETS["envelope-edge"].sourcePath}`}
        alt=""
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          // The image is horizontally oriented. We want its physical length to be the envelope's height.
          width: 928 * BASE_SCALE,
          height: 6, // ultra-thin physical width
          marginLeft: -928 * BASE_SCALE / 2,
          marginTop: -3,
          transform: "rotateZ(90deg)", // make it vertical
          opacity: 0,
          pointerEvents: "none",
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
          willChange: isAnimating ? "transform" : "auto",
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
