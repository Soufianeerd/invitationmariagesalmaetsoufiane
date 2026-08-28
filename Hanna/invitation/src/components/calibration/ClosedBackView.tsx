"use client";
import React, { useState, useEffect } from "react";
import { ENVELOPE_CALIBRATION, EnvelopeAssetPlacement } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";
import CalibrationControls from "./CalibrationControls";
import { createPortal } from "react-dom";

export default function ClosedBackView() {
  const [backConfig, setBackConfig] = useState(ENVELOPE_CALIBRATION["back-closed"]);
  const [sealConfig, setSealConfig] = useState(ENVELOPE_CALIBRATION["seal"]);
  const [controlsContainer, setControlsContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("calibration-controls-container");
    if (el) {
      setTimeout(() => setControlsContainer(el), 0);
    }
  }, []);

  const renderAsset = (config: EnvelopeAssetPlacement, assetId: string) => {
    const asset = HANNA_ASSETS[assetId];
    if (!asset) return null;

    return (
      <img
        src={`/assets/hanna${asset.sourcePath}`}
        alt={assetId}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: `${config.width}px`,
          height: `${config.height}px`,
          marginLeft: `-${config.width / 2}px`,
          marginTop: `-${config.height / 2}px`,
          transform: `translate(${config.x}px, ${config.y}px) scale(${config.scaleX}, ${config.scaleY}) rotate(${config.rotation}deg)`,
          transformOrigin: `${config.transformOriginX} ${config.transformOriginY}`,
          opacity: config.opacity,
          zIndex: config.layer,
          pointerEvents: "none",
        }}
      />
    );
  };

  const handleCopyJSON = () => {
    const json = {
      "back-closed": backConfig,
      "seal": sealConfig
    };
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    alert("Copied to clipboard!");
  };

  const controls = (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end" }}>
        <button 
          onClick={handleCopyJSON}
          style={{ padding: "0.25rem 0.5rem", background: "#0066cc", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Copy JSON
        </button>
      </div>
      <CalibrationControls name="Back Closed" config={backConfig} onChange={setBackConfig} />
      <CalibrationControls name="Seal" config={sealConfig} onChange={setSealConfig} />
    </>
  );

  return (
    <>
      {renderAsset(backConfig, "envelope-back-closed")}
      {renderAsset(sealConfig, "envelope-seal")}
      
      {controlsContainer && createPortal(controls, controlsContainer)}
    </>
  );
}
