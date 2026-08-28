"use client";
import React from "react";
import { EnvelopeAssetPlacement } from "@/config/envelopeCalibration";

type Props = {
  name: string;
  config: EnvelopeAssetPlacement;
  onChange: (newConfig: EnvelopeAssetPlacement) => void;
};

export default function CalibrationControls({ name, config, onChange }: Props) {
  const handleChange = (field: keyof EnvelopeAssetPlacement, value: number | string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#333", borderRadius: "8px" }}>
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", borderBottom: "1px solid #555", paddingBottom: "0.5rem" }}>
        {name}
      </h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          X
          <input 
            type="number" 
            value={config.x} 
            onChange={e => handleChange("x", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>
        
        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          Y
          <input 
            type="number" 
            value={config.y} 
            onChange={e => handleChange("y", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          Scale X
          <input 
            type="number" step="0.01" 
            value={config.scaleX} 
            onChange={e => handleChange("scaleX", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>
        
        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          Scale Y
          <input 
            type="number" step="0.01" 
            value={config.scaleY} 
            onChange={e => handleChange("scaleY", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          Rotation (deg)
          <input 
            type="number" 
            value={config.rotation} 
            onChange={e => handleChange("rotation", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
          Opacity
          <input 
            type="number" step="0.1" min="0" max="1"
            value={config.opacity} 
            onChange={e => handleChange("opacity", parseFloat(e.target.value))} 
            style={{ width: "100%", padding: "4px", background: "#222", color: "white", border: "1px solid #444" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#aaa" }}>
        Copy to config: <br/>
        <pre style={{ background: "#111", padding: "0.5rem", borderRadius: "4px", overflowX: "auto" }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
}
