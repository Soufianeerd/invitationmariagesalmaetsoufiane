"use client";
import React, { useState } from "react";
import { HANNA_ASSETS, HannaAsset } from "@/config/hannaAssets";

export default function IndividualAssetsView() {
  const assets = Object.values(HANNA_ASSETS);
  const [selectedId, setSelectedId] = useState(assets[0]?.id || "");

  const selectedAsset = assets.find(a => a.id === selectedId);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "1rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <select 
          value={selectedId} 
          onChange={e => setSelectedId(e.target.value)}
          style={{ padding: "0.5rem", background: "#333", color: "white", border: "1px solid #555" }}
        >
          {assets.map(a => (
            <option key={a.id} value={a.id}>{a.id} ({a.role})</option>
          ))}
        </select>
      </div>

      {selectedAsset && (
        <div style={{ display: "flex", flex: 1, gap: "2rem", overflow: "hidden" }}>
          <div style={{ 
            flex: 1, 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            background: "#111",
            border: "1px dashed #444",
            position: "relative"
          }}>
            <img 
              src={`/assets/hanna${selectedAsset.sourcePath}`} 
              alt={selectedAsset.id}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
              }}
            />
            {/* Visual bounding box for alpha images */}
            {selectedAsset.hasAlpha && selectedAsset.bbox && (
              <div style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${selectedAsset.width}px`,
                height: `${selectedAsset.height}px`,
                transform: `translate(-50%, -50%) scale(${Math.min(1, 800/selectedAsset.height)})`, // very rough visual scaling for the box
                pointerEvents: "none",
                display: "none" // complex to get perfect without knowing actual rendered size, better to just show raw image.
              }}>
              </div>
            )}
          </div>
          
          <div style={{ width: "300px", background: "#222", padding: "1rem", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 1rem 0" }}>Asset Details</h3>
            <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(selectedAsset, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
