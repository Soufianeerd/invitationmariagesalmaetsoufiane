"use client";

import React, { useState, useEffect } from "react";
import { EnvelopeState } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";
import { EnvelopeScene } from "./EnvelopeScene";
import styles from "@/app/page.module.css";

export const HannaExperience: React.FC = () => {
  const [state, setState] = useState<EnvelopeState>("LOADING");

  useEffect(() => {
    // Preload required assets for Phase 2A
    const assetsToPreload = [
      `/assets/hanna${HANNA_ASSETS["envelope-front"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-back-closed"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-seal"].sourcePath}`,
      `/assets/hanna${HANNA_ASSETS["envelope-edge"].sourcePath}`,
    ];

    let loadedCount = 0;

    const onImageLoaded = () => {
      loadedCount++;
      if (loadedCount === assetsToPreload.length) {
        // A tiny delay feels a bit more natural before flying in
        setTimeout(() => setState("ENVELOPE_ENTERING"), 100);
      }
    };

    assetsToPreload.forEach((src) => {
      const img = new Image();
      img.onload = onImageLoaded;
      img.onerror = onImageLoaded; // continue even if error, to not freeze
      img.src = src;
    });
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
          <div className={styles.spinner} />
        </div>
      )}

      {state !== "LOADING" && (
        <>
          <EnvelopeScene
            state={state}
            onEntranceComplete={handleEntranceComplete}
            onFlipComplete={handleFlipComplete}
            onClick={handleEnvelopeClick}
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
