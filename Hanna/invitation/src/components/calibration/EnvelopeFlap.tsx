"use client";
import React from "react";
import { EnvelopeAssetPlacement } from "@/config/envelopeCalibration";
import { HANNA_ASSETS } from "@/config/hannaAssets";

type Props = {
  innerConfig: EnvelopeAssetPlacement;
  outerConfig: EnvelopeAssetPlacement;
};

export default function EnvelopeFlap({ innerConfig, outerConfig }: Props) {
  const innerAsset = HANNA_ASSETS["envelope-flap-inner"];
  const outerAsset = HANNA_ASSETS["envelope-flap-outer"];

  if (!innerAsset || !outerAsset) return null;

  // For now, no 3D rotation, just display the inner flap or outer flap depending on state.
  // The user requested: "Prépare un composant avec deux faces ... Mais aucune animation ... transform-style: preserve-3d"
  
  return (
    <div 
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${innerConfig.width}px`,
        height: `${innerConfig.height}px`,
        marginLeft: `-${innerConfig.width / 2}px`,
        marginTop: `-${innerConfig.height / 2}px`,
        transform: `translate(${innerConfig.x}px, ${innerConfig.y}px) scale(${innerConfig.scaleX}, ${innerConfig.scaleY}) rotate(${innerConfig.rotation}deg)`,
        transformOrigin: `${innerConfig.transformOriginX} ${innerConfig.transformOriginY}`,
        zIndex: innerConfig.layer,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      {/* Outer Face - Front */}
      <img
        src={`/assets/hanna${outerAsset.sourcePath}`}
        alt="flap-outer"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          opacity: outerConfig.opacity,
        }}
      />

      {/* Inner Face - Back (rotated 180deg to face the other way) */}
      <img
        src={`/assets/hanna${innerAsset.sourcePath}`}
        alt="flap-inner"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          transform: "rotateX(180deg)",
          opacity: innerConfig.opacity,
        }}
      />
    </div>
  );
}
