"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { ENVELOPE_STAGE_WIDTH, ENVELOPE_STAGE_HEIGHT } from "@/config/envelopeCalibration";
import ClosedBackView from "@/components/calibration/ClosedBackView";
import OpenEnvelopeView from "@/components/calibration/OpenEnvelopeView";
import IndividualAssetsView from "@/components/calibration/IndividualAssetsView";

type ViewMode = "CLOSED_BACK" | "OPEN_ENVELOPE" | "INDIVIDUAL_ASSETS";
type CompareMode = "RECONSTRUCTION" | "MASTER" | "OVERLAY" | "BLINK";

export default function CalibrationPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("CLOSED_BACK");
  const [compareMode, setCompareMode] = useState<CompareMode>("RECONSTRUCTION");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [stageScale, setStageScale] = useState(1);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Blink state
  const [isBlinkMaster, setIsBlinkMaster] = useState(false);
  useEffect(() => {
    if (compareMode !== "BLINK") return;
    const interval = setInterval(() => {
      setIsBlinkMaster(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [compareMode]);

  // Responsive scale
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const { clientWidth, clientHeight } = wrapperRef.current;
        const padding = 40; // 2rem
        const scaleX = (clientWidth - padding * 2) / ENVELOPE_STAGE_WIDTH;
        const scaleY = (clientHeight - padding * 2) / ENVELOPE_STAGE_HEIGHT;
        setStageScale(Math.min(scaleX, scaleY, 1)); // Don't scale up past 1
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMasterImage = () => {
    if (viewMode === "CLOSED_BACK") return "/assets/hanna/references/envelope-back-closed-master.png";
    if (viewMode === "OPEN_ENVELOPE") return "/assets/hanna/references/envelope-open-master.png";
    return "";
  };

  const showReconstruction = compareMode === "RECONSTRUCTION" || compareMode === "OVERLAY" || (compareMode === "BLINK" && !isBlinkMaster);
  const showMaster = compareMode === "MASTER" || compareMode === "OVERLAY" || (compareMode === "BLINK" && isBlinkMaster);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.controls}>
          <select 
            className={styles.select}
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
          >
            <option value="CLOSED_BACK">Closed Back</option>
            <option value="OPEN_ENVELOPE">Open Envelope</option>
            <option value="INDIVIDUAL_ASSETS">Individual Assets</option>
          </select>

          {viewMode !== "INDIVIDUAL_ASSETS" && (
            <>
              <div className={styles.controls}>
                <button 
                  className={`${styles.button} ${compareMode === "RECONSTRUCTION" ? styles.active : ""}`}
                  onClick={() => setCompareMode("RECONSTRUCTION")}
                >
                  Reconstruction
                </button>
                <button 
                  className={`${styles.button} ${compareMode === "MASTER" ? styles.active : ""}`}
                  onClick={() => setCompareMode("MASTER")}
                >
                  Master
                </button>
                <button 
                  className={`${styles.button} ${compareMode === "OVERLAY" ? styles.active : ""}`}
                  onClick={() => setCompareMode("OVERLAY")}
                >
                  Overlay
                </button>
                <button 
                  className={`${styles.button} ${compareMode === "BLINK" ? styles.active : ""}`}
                  onClick={() => setCompareMode("BLINK")}
                >
                  Blink
                </button>
              </div>

              {compareMode === "OVERLAY" && (
                <div className={styles.sliderGroup}>
                  <span>Master Opacity:</span>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={overlayOpacity} 
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                  />
                  <span>{overlayOpacity}%</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.controls}>
          <button 
            className={`${styles.button} ${showGrid ? styles.active : ""}`}
            onClick={() => setShowGrid(!showGrid)}
          >
            Grid
          </button>
          <button 
            className={`${styles.button} ${showAxes ? styles.active : ""}`}
            onClick={() => setShowAxes(!showAxes)}
          >
            Axes
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.stageWrapper} ref={wrapperRef}>
          <div 
            className={styles.stage} 
            style={{ 
              transform: `scale(${stageScale})`,
              width: ENVELOPE_STAGE_WIDTH,
              height: ENVELOPE_STAGE_HEIGHT
            }}
          >
            {showGrid && <div className={styles.grid} />}
            {showAxes && (
              <>
                <div className={styles.axisX} />
                <div className={styles.axisY} />
              </>
            )}

            {showReconstruction && (
              <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
                {viewMode === "CLOSED_BACK" && <ClosedBackView />}
                {viewMode === "OPEN_ENVELOPE" && <OpenEnvelopeView />}
                {viewMode === "INDIVIDUAL_ASSETS" && <IndividualAssetsView />}
              </div>
            )}

            {showMaster && viewMode !== "INDIVIDUAL_ASSETS" && (
              <div 
                className={styles.masterOverlay}
                style={{
                  backgroundImage: `url(${getMasterImage()})`,
                  opacity: compareMode === "OVERLAY" ? overlayOpacity / 100 : 1,
                  zIndex: compareMode === "MASTER" || (compareMode === "BLINK" && isBlinkMaster) ? 100 : 900
                }}
              />
            )}
          </div>
        </div>

        {viewMode !== "INDIVIDUAL_ASSETS" && (
          <aside className={styles.sidebar}>
            {/* CalibrationControls will go here, currently handled via props or context.
                For simplicity we'll let the views render their own controls using a portal or simply floating absolute div, 
                or better, pass a state down. Since requirements said "Un panneau simple suffit", 
                we can just render the controls directly in the view components and absolute position them, 
                or export a component. Let's put the controls inside the components. */}
            <div id="calibration-controls-container"></div>
          </aside>
        )}
      </main>
    </div>
  );
}
