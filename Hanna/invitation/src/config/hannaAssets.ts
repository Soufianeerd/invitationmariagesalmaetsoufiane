export type AssetRole =
  | "envelope-back-base"
  | "envelope-seal"
  | "envelope-front"
  | "envelope-slot-shadow"
  | "envelope-front-pocket"
  | "envelope-flap-inner"
  | "envelope-flap-outer"
  | "envelope-back-closed"
  | "envelope-edge"
  | "invitation-card"
  | "effect"
  | "reference";

export type BoundingBox = [number, number, number, number]; // [left, top, right, bottom]

export type HannaAsset = {
  id: string;
  sourcePath: string; // Relative to /assets/hanna
  width: number;
  height: number;
  aspectRatio: number;
  hasAlpha: boolean;
  sizeBytes: number;
  role: AssetRole;
  bbox: BoundingBox;
  pctCoverage: number;
  centerX: number;
  centerY: number;
};

export const HANNA_ASSETS: Record<string, HannaAsset> = {
  "envelope-back-closed-master": {
    id: "envelope-back-closed-master",
    sourcePath: "/references/envelope-back-closed-master.png",
    width: 1620,
    height: 971,
    aspectRatio: 1620 / 971,
    hasAlpha: true,
    sizeBytes: 2719409,
    role: "reference",
    bbox: [11, 3, 1607, 971],
    pctCoverage: 98.21,
    centerX: 809.0,
    centerY: 487.0
  },
  "envelope-open-master": {
    id: "envelope-open-master",
    sourcePath: "/references/envelope-open-master.png",
    width: 1536,
    height: 1024,
    aspectRatio: 1536 / 1024,
    hasAlpha: true,
    sizeBytes: 2450811,
    role: "reference",
    bbox: [16, 0, 1520, 1024],
    pctCoverage: 97.92,
    centerX: 768.0,
    centerY: 512.0
  },
  "envelope-back-base": {
    id: "envelope-back-base",
    sourcePath: "/envelope/envelope-back-base.png",
    width: 1672,
    height: 941,
    aspectRatio: 1672 / 941,
    hasAlpha: true,
    sizeBytes: 2350373,
    role: "envelope-back-base",
    bbox: [0, 32, 1644, 941],
    pctCoverage: 94.98,
    centerX: 822.0,
    centerY: 486.5
  },
  "envelope-seal": {
    id: "envelope-seal",
    sourcePath: "/envelope/envelope-seal.png",
    width: 1254,
    height: 1254,
    aspectRatio: 1,
    hasAlpha: true,
    sizeBytes: 2333945,
    role: "envelope-seal",
    bbox: [0, 21, 1240, 1214],
    pctCoverage: 94.07,
    centerX: 620.0,
    centerY: 617.5
  },
  "envelope-front": {
    id: "envelope-front",
    sourcePath: "/envelope/envelope-front.png",
    width: 1536,
    height: 1024,
    aspectRatio: 1536 / 1024,
    hasAlpha: true,
    sizeBytes: 3016092,
    role: "envelope-front",
    bbox: [15, 33, 1520, 1024],
    pctCoverage: 94.82,
    centerX: 767.5,
    centerY: 528.5
  },
  "envelope-slot-shadow": {
    id: "envelope-slot-shadow",
    sourcePath: "/envelope/envelope-slot-shadow.png",
    width: 2172,
    height: 724,
    aspectRatio: 2172 / 724,
    hasAlpha: true,
    sizeBytes: 286332,
    role: "envelope-slot-shadow",
    bbox: [74, 103, 2158, 700],
    pctCoverage: 79.12,
    centerX: 1116.0,
    centerY: 401.5
  },
  "envelope-front-pocket": {
    id: "envelope-front-pocket",
    sourcePath: "/envelope/envelope-front-pocket.png",
    width: 1536,
    height: 1024,
    aspectRatio: 1536 / 1024,
    hasAlpha: true,
    sizeBytes: 1383578,
    role: "envelope-front-pocket",
    bbox: [17, 21, 1513, 982],
    pctCoverage: 91.4,
    centerX: 765.0,
    centerY: 501.5
  },
  "envelope-flap-inner": {
    id: "envelope-flap-inner",
    sourcePath: "/envelope/envelope-flap-inner.png",
    width: 1672,
    height: 941,
    aspectRatio: 1672 / 941,
    hasAlpha: true,
    sizeBytes: 1252501,
    role: "envelope-flap-inner",
    bbox: [0, 72, 1664, 915],
    pctCoverage: 89.16,
    centerX: 832.0,
    centerY: 493.5
  },
  "envelope-flap-outer": {
    id: "envelope-flap-outer",
    sourcePath: "/envelope/envelope-flap-outer.png",
    width: 1672,
    height: 941,
    aspectRatio: 1672 / 941,
    hasAlpha: true,
    sizeBytes: 1307160,
    role: "envelope-flap-outer",
    bbox: [11, 32, 1661, 884],
    pctCoverage: 89.35,
    centerX: 836.0,
    centerY: 458.0
  },
  "envelope-back-closed": {
    id: "envelope-back-closed",
    sourcePath: "/envelope/envelope-back-closed.png",
    width: 1672,
    height: 941,
    aspectRatio: 1672 / 941,
    hasAlpha: true,
    sizeBytes: 2498798,
    role: "envelope-back-closed",
    bbox: [29, 0, 1644, 928],
    pctCoverage: 95.26,
    centerX: 836.5,
    centerY: 464.0
  },
  "envelope-edge": {
    id: "envelope-edge",
    sourcePath: "/envelope/envelope-edge.png",
    width: 2084,
    height: 754,
    aspectRatio: 2084 / 754,
    hasAlpha: true,
    sizeBytes: 137218,
    role: "envelope-edge",
    bbox: [41, 167, 2042, 691],
    pctCoverage: 66.73,
    centerX: 1041.5,
    centerY: 429.0
  },
  "invitation-card-clean": {
    id: "invitation-card-clean",
    sourcePath: "/invitation/invitation-card-clean.png",
    width: 941,
    height: 1672,
    aspectRatio: 941 / 1672,
    hasAlpha: false,
    sizeBytes: 2013863,
    role: "invitation-card",
    bbox: [0, 0, 941, 1672],
    pctCoverage: 100,
    centerX: 470.5,
    centerY: 836.0
  }
};
