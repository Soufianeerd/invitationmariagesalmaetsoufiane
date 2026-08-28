export const ENVELOPE_STAGE_WIDTH = 1600;
export const ENVELOPE_STAGE_HEIGHT = 960;

export type EnvelopeAssetPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number; // in degrees
  opacity: number;
  transformOriginX: string | number; // CSS value (e.g. "50%", "top", 100)
  transformOriginY: string | number;
  layer: number; // z-index equivalent
};

// Calculated Structural Constants
export const ENVELOPE_CONSTANTS = {
  CARD_EXIT_LINE_Y: -350, 
  CARD_INSIDE_WIDTH: 484, // Recalculated to fit inside envelope height
  CARD_INSIDE_HEIGHT: 860, // Maintaining 941/1672 ratio
  CARD_INSIDE_X: 12.14,
  CARD_INSIDE_Y: -50,
  EDGE_LOGICAL_WIDTH: 1425, // Envelope logical width
  EDGE_LOGICAL_HEIGHT: 6, // Ultra-thin physical thickness of paper
  SHADOW_X: 12.14,
  SHADOW_Y: -350,
  SHADOW_SCALE_Y: 0.05,
  SHADOW_OPACITY: 0.15,
  FLAP_PHYSICAL_HINGE_X: "50%",
  FLAP_PHYSICAL_HINGE_Y: "3.4%", // 32px / 941px
  INNER_FLAP_OFFSET_Y: 6, // 32 - (941 - 915)
};

// Initial default placements to be calibrated
export const ENVELOPE_CALIBRATION: Record<string, EnvelopeAssetPlacement> = {
  "back-base": {
    x: 12.14,
    y: -13.87,
    width: 1672,
    height: 941,
    scaleX: 0.8669,
    scaleY: 0.8669,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  },
  "invitation-card": {
    x: 126.22, 
    y: -210.84, 
    width: 1219.03, 
    height: 2166.02,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 20,
  },
  "slot-shadow": {
    x: 126.22,
    y: -528.17, 
    width: 1672,
    height: 100, 
    scaleX: 1,
    scaleY: 0.1,
    rotation: 0,
    opacity: 0.2,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 30,
  },
  "front-pocket": {
    x: 12.14,
    y: -13.87, 
    width: 1536,
    height: 1024,
    scaleX: 0.8669,
    scaleY: 0.8669,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 40,
  },
  "flap-inner": {
    x: 12.14,
    y: -13.87, 
    width: 1672,
    height: 941,
    scaleX: 0.8669,
    scaleY: 0.8669,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%", 
    layer: 50,
  },
  "flap-outer": {
    x: 12.14,
    y: -13.87,
    width: 1672,
    height: 941,
    scaleX: 0.8669,
    scaleY: 0.8669,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%", 
    layer: 60,
  },
  "seal": {
    x: -0.88,
    y: 148.09,
    width: 1254,
    height: 1254,
    scaleX: 0.1214, 
    scaleY: 0.1214,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 70,
  },
  "back-closed": {
    x: -0.43,
    y: 5.63,
    width: 1672,
    height: 941,
    scaleX: 0.8669,
    scaleY: 0.8669,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  }
};
