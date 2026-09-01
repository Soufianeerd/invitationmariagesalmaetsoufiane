"use client";

import React, { useState } from "react";
import { EnvelopeState } from "@/config/envelopeCalibration";
import { EnvelopeScene } from "@/components/hanna/EnvelopeScene";
import styles from "@/app/page.module.css";

export default function HannaMotionDevPage() {
  const [state, setState] = useState<EnvelopeState>("LOADING");
  const [debugAngle, setDebugAngle] = useState<number | undefined>(undefined);

  return (
    <div className={styles.container}>
      <EnvelopeScene
        state={state}
        onEntranceComplete={() => {
          if (state === "ENVELOPE_ENTERING") setState("ENVELOPE_IDLE");
        }}
        onFlipComplete={() => {
          if (state === "ENVELOPE_TURNING") setState("ENVELOPE_BACK_READY");
        }}
        onClick={() => {}}
        // @ts-ignore - passing down to EnvelopeScene -> Envelope3D
        debugAngle={debugAngle}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(255,255,255,0.9)",
          padding: 20,
          borderRadius: 8,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16 }}>Dev Motion (Phase 2A)</h2>
        <div style={{ fontSize: 12, fontWeight: "bold" }}>STATE: {state}</div>
        
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: 300 }}>
          <button onClick={() => { setDebugAngle(undefined); setState("ENVELOPE_ENTERING"); }}>
            Replay Entrance
          </button>
          <button onClick={() => { setDebugAngle(undefined); setState("ENVELOPE_IDLE"); }}>
            Force Idle
          </button>
          <button onClick={() => { setDebugAngle(undefined); setState("ENVELOPE_TURNING"); }}>
            Trigger Flip
          </button>
        </div>

        <div style={{ fontSize: 12, fontWeight: "bold", marginTop: 10 }}>DEBUG ANGLES</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", maxWidth: 300 }}>
          <button onClick={() => { setState("ENVELOPE_IDLE"); setDebugAngle(0); }}>0°</button>
          <button onClick={() => { setState("ENVELOPE_IDLE"); setDebugAngle(45); }}>45°</button>
          <button onClick={() => { setState("ENVELOPE_IDLE"); setDebugAngle(90); }}>90°</button>
          <button onClick={() => { setState("ENVELOPE_IDLE"); setDebugAngle(135); }}>135°</button>
          <button onClick={() => { setState("ENVELOPE_IDLE"); setDebugAngle(180); }}>180°</button>
          <button onClick={() => { setDebugAngle(undefined); }}>Reset Angle Debug</button>
        </div>
      </div>
    </div>
  );
}
