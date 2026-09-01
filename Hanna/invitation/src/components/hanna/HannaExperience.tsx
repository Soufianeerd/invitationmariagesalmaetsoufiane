"use client";

import React, { useState, useEffect } from "react";
import { EnvelopeState } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";
import { EnvelopeScene } from "./EnvelopeScene";
import styles from "@/app/page.module.css";

export const HannaExperience: React.FC = () => {
  const [state, setState] = useState<EnvelopeState>("LOADING");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Preload required assets for Phase 2A
    const assetsToPreload = [
      `/assets/hanna${HANNA_ASSETS["envelope-front"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-back-closed"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-seal"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-edge"].sourcePath}`,
    ];

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.decode()
          .then(() => resolve())
          .catch((e) => {
            console.error(`Failed to decode image: ${src}`, e);
            reject(e);
          });
      });
    };

    Promise.all(assetsToPreload.map(preloadImage))
      .then(() => {
        setTimeout(() => setState("ENVELOPE_ENTERING"), 100);
      })
      .catch(() => {
        setState("ERROR");
      });

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleEntranceComplete = () => {
    if (state === "ENVELOPE_ENTERING") {
      setState("ENVELOPE_IDLE");
    }
  };

  const handleFlipComplete = () => {
    if (state === "ENVELOPE_TURNING") {
      setState("ENVELOPE_BACK_READY");
    }
  };

  const handleEnvelopeClick = () => {
    if (state === "ENVELOPE_IDLE") {
      setState("ENVELOPE_TURNING");
    }
  };

  return (
    <div className={styles.container}>
      {/* Optional discrete loader */}
      {state === "LOADING" && (
        <div className={styles.loader}>
          <div className={styles.spinner} style={{ animationDuration: reduceMotion ? "0s" : "1s" }} />
        </div>
      )}
      
      {state === "ERROR" && (
        <div className={styles.loader} style={{ textAlign: "center", color: "rgba(0,0,0,0.5)" }}>
          Une erreur est survenue lors du chargement.
        </div>
      )}

      {state !== "LOADING" && state !== "ERROR" && (
        <>
          <EnvelopeScene
            state={state}
            onEntranceComplete={handleEntranceComplete}
            onFlipComplete={handleFlipComplete}
            onClick={handleEnvelopeClick}
            reduceMotion={reduceMotion}
          />
          
          {/* Subtle instruction text during IDLE */}
          <div
            className={styles.instruction}
            style={{
              opacity: state === "ENVELOPE_IDLE" ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 0.6s ease 1s", // 1s delay before showing
            }}
          >
            Toucher pour ouvrir
          </div>
        </>
      )}
    </div>
  );
};
