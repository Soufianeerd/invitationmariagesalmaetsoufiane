"use client";
import React, { useState, useEffect } from "react";
import { ENVELOPE_CALIBRATION, EnvelopeAssetPlacement } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";
import CalibrationControls from "./CalibrationControls";
import EnvelopeFlap from "./EnvelopeFlap";
import { createPortal } from "react-dom";

export default function OpenEnvelopeView() {
  const [baseConfig, setBaseConfig] = useState(ENVELOPE_CALIBRATION["back-base"]);
  const [cardConfig, setCardConfig] = useState(ENVELOPE_CALIBRATION["invitation-card"]);
  const [shadowConfig, setShadowConfig] = useState(ENVELOPE_CALIBRATION["slot-shadow"]);
  const [pocketConfig, setPocketConfig] = useState(ENVELOPE_CALIBRATION["front-pocket"]);
  const [flapInnerConfig, setFlapInnerConfig] = useState(ENVELOPE_CALIBRATION["flap-inner"]);
  const [flapOuterConfig, setFlapOuterConfig] = useState(ENVELOPE_CALIBRATION["flap-outer"]);
  
  const [showCard, setShowCard] = useState(false);
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

  const controls = (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" checked={showCard} onChange={e => setShowCard(e.target.checked)} />
          Show Invitation Card
        </label>
      </div>
      <CalibrationControls name="Back Base" config={baseConfig} onChange={setBaseConfig} />
      {showCard && <CalibrationControls name="Card" config={cardConfig} onChange={setCardConfig} />}
      <CalibrationControls name="Slot Shadow" config={shadowConfig} onChange={setShadowConfig} />
      <CalibrationControls name="Front Pocket" config={pocketConfig} onChange={setPocketConfig} />
      <CalibrationControls name="Flap Inner" config={flapInnerConfig} onChange={setFlapInnerConfig} />
      <CalibrationControls name="Flap Outer" config={flapOuterConfig} onChange={setFlapOuterConfig} />
    </>
  );

  return (
    <>
      {/* LAYER 1: Back base */}
      {renderAsset(baseConfig, "envelope-back-base")}
      
      {/* LAYER 2: Invitation Card */}
      {showCard && renderAsset(cardConfig, "invitation-card-clean")}
      
      {/* LAYER 3: Slot Shadow */}
      {renderAsset(shadowConfig, "envelope-slot-shadow")}
      
      {/* LAYER 4: Front Pocket */}
      {renderAsset(pocketConfig, "envelope-front-pocket")}
      
      {/* LAYER 5: Flap */}
      <EnvelopeFlap innerConfig={flapInnerConfig} outerConfig={flapOuterConfig} />
      
      {controlsContainer && createPortal(controls, controlsContainer)}
    </>
  );
}
