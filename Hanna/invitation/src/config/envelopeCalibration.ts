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

export type EnvelopeState = 
  | "LOADING"
  | "ENVELOPE_ENTERING"
  | "ENVELOPE_IDLE"
  | "ENVELOPE_TURNING"
  | "ENVELOPE_BACK_READY";


// Calculated Structural Constants
export const ENVELOPE_CONSTANTS = {
  BASE_X: 12.14, // Common X offset for envelope structural elements
  BASE_Y: -13.87, // Common Y offset for envelope structural elements
  BASE_SCALE: 0.8669, // Common scale to fit 1600x960 stage
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
  FRONT_FACE_WIDTH: 1536,
  FRONT_FACE_HEIGHT: 1024,
  FRONT_FACE_SCALE_X: 0.93026,
  FRONT_FACE_SCALE_Y: 0.81179,
  FRONT_FACE_X: 13.04,
  FRONT_FACE_Y: -32.89,
};

// Initial default placements to be calibrated
export const ENVELOPE_CALIBRATION: Record<string, EnvelopeAssetPlacement> = {
  "back-base": {
    x: ENVELOPE_CONSTANTS.BASE_X,
    y: ENVELOPE_CONSTANTS.BASE_Y,
    width: 1672,
    height: 941,
    scaleX: ENVELOPE_CONSTANTS.BASE_SCALE,
    scaleY: ENVELOPE_CONSTANTS.BASE_SCALE,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  },
  "invitation-card": {
    x: ENVELOPE_CONSTANTS.CARD_INSIDE_X, 
    y: ENVELOPE_CONSTANTS.CARD_INSIDE_Y, 
    width: ENVELOPE_CONSTANTS.CARD_INSIDE_WIDTH, 
    height: ENVELOPE_CONSTANTS.CARD_INSIDE_HEIGHT,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 20,
  },
  "slot-shadow": {
    x: ENVELOPE_CONSTANTS.SHADOW_X,
    y: ENVELOPE_CONSTANTS.SHADOW_Y, 
    width: 2172, // Actual asset width
    height: 724, // Actual asset height
    scaleX: 0.8669, // Consistent scale
    scaleY: ENVELOPE_CONSTANTS.SHADOW_SCALE_Y,
    rotation: 0,
    opacity: ENVELOPE_CONSTANTS.SHADOW_OPACITY,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 30,
  },
  "front-pocket": {
    x: ENVELOPE_CONSTANTS.BASE_X,
    y: ENVELOPE_CONSTANTS.BASE_Y, 
    width: 1536,
    height: 1024,
    scaleX: ENVELOPE_CONSTANTS.BASE_SCALE,
    scaleY: ENVELOPE_CONSTANTS.BASE_SCALE,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 40,
  },
  "flap-inner": {
    x: ENVELOPE_CONSTANTS.BASE_X,
    y: ENVELOPE_CONSTANTS.BASE_Y, 
    width: 1672,
    height: 941,
    scaleX: ENVELOPE_CONSTANTS.BASE_SCALE,
    scaleY: ENVELOPE_CONSTANTS.BASE_SCALE,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%", 
    layer: 50,
  },
  "flap-outer": {
    x: ENVELOPE_CONSTANTS.BASE_X,
    y: ENVELOPE_CONSTANTS.BASE_Y,
    width: 1672,
    height: 941,
    scaleX: ENVELOPE_CONSTANTS.BASE_SCALE,
    scaleY: ENVELOPE_CONSTANTS.BASE_SCALE,
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
    scaleX: ENVELOPE_CONSTANTS.BASE_SCALE,
    scaleY: ENVELOPE_CONSTANTS.BASE_SCALE,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  }
};
