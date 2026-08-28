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

// Initial default placements to be calibrated
export const ENVELOPE_CALIBRATION: Record<string, EnvelopeAssetPlacement> = {
  "back-base": {
    x: 0,
    y: 0,
    width: 1672,
    height: 941,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  },
  "invitation-card": {
    x: 0, // Centered horizontally
    y: 0, // Centered vertically
    width: 800, // scaled down to fit inside envelope roughly
    height: 1421,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 20,
  },
  "slot-shadow": {
    x: 0,
    y: 0, // positioned inside pocket
    width: 1672,
    height: 100, // flattened horizontally
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 0.5,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 30,
  },
  "front-pocket": {
    x: 0,
    y: 0, // positioned at bottom
    width: 1536,
    height: 1024,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 40,
  },
  "flap-inner": {
    x: 0,
    y: 0, // positioned at top
    width: 1672,
    height: 941,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "top", // Hinge is at the top
    layer: 50,
  },
  "flap-outer": {
    x: 0,
    y: 0,
    width: 1672,
    height: 941,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "top", // Hinge is at the top
    layer: 60,
  },
  "seal": {
    x: 0,
    y: 0,
    width: 1254,
    height: 1254,
    scaleX: 0.2, // scaled down
    scaleY: 0.2,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 70,
  },
  "back-closed": {
    x: 0,
    y: 0,
    width: 1672,
    height: 941,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    opacity: 1,
    transformOriginX: "50%",
    transformOriginY: "50%",
    layer: 10,
  }
};
