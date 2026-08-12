import { isMobile } from '@lego/helpers/isMobile';

import { compassLayout, flightRayHub } from './flightPath';

/** Parabolic climb + pixel hover at cap (internal plainPosition axes). */
export function parabolaY(a: number, x: number) {
  return a * x ** 2;
}

export const PLAIN_VOL = isMobile() ? 20 : 80;
export const PLAIN_HOVER_STEP = isMobile() ? 0.2 : 0.5;
export const PLAIN_Y_STEP = isMobile() ? 1.4 : 3.4;
export const PLAIN_Y_KICK = isMobile() ? 70 : 0;

export function parabolaCoeff(canvasW: number, canvasH: number) {
  if (!canvasW) return 0;
  return canvasH / canvasW ** 2;
}

export type PlainPosition = { x: number; y: number };

/** Climb limits — stop before upper-right corner (not flush to edge). */
export function canClimb(
  pos: PlainPosition,
  canvasW: number,
  canvasH: number,
  markerW: number,
  markerH: number,
) {
  return (
    pos.y < canvasW * 0.94 - markerW &&
    pos.x < canvasH * 0.76 - markerH
  );
}

/** Chart tip — marker attach + quadratic control (stable). */
export function chartTipFromPlain(
  plainPosition: PlainPosition,
  canvasWidth: number,
  canvasHeight: number,
  options?: { hollywood?: boolean },
) {
  const hollywood = options?.hollywood ?? false;
  const hub = flightRayHub(canvasWidth, canvasHeight);
  const lineH = canvasHeight;
  const tipY =
    lineH -
    plainPosition.x -
    (hollywood ? HOLLYWOOD_CRANE_FIGMA.tipOffsetY : 18);
  const tipX =
    plainPosition.y + (hollywood ? HOLLYWOOD_CRANE_FIGMA.tipOffsetX : 20);
  const endY = tipY >= lineH ? lineH : tipY;

  const maxH = Math.max(canvasWidth, canvasHeight);
  const minH = Math.min(canvasWidth, canvasHeight);
  const curve = canvasWidth
    ? plainPosition.x * (minH / maxH)
    : plainPosition.x * (isMobile() ? 0.9 : 1.4);
  const curveCtrlX = hub.x + curve;

  const tanX = tipX - curveCtrlX;
  const tanY = endY - lineH;
  const rotateFromUp = (Math.atan2(tanX, -tanY) * 180) / Math.PI;

  return { hub, tipX, endY, curveCtrlX, lineH, rotateFromUp };
}

/** Ease vertical climb under compass so line + marker rise smoothly (not a snap). */
export function plainXUnderCompass(
  prevX: number,
  targetX: number,
  nextY: number,
  canvasW: number,
  canvasH: number,
) {
  const { cx, r } = compassLayout(canvasW, canvasH);
  const inZone =
    nextY > cx - r * 0.65 && nextY < cx + r * 1.15;
  if (!inZone) return targetX;
  const blend = isMobile() ? 0.4 : 0.44;
  return prevX + (targetX - prevX) * blend;
}

export const MARKER_ATTACH_X = 45.9159 / 110;
export const MARKER_ATTACH_Y = 82.1712 / 115;
export const MARKER_SVG_LEAN_DEG =
  (Math.atan2(68.5578 - 45.9159, -(18.8127 - 82.1712)) * 180) / Math.PI;
/** Nudge nose slightly above path tangent (visual only). */
export const MARKER_VISUAL_PITCH_DEG = -5;

/** Figma Canvas-Glow (1484×672) — Hollywoodbets crane (560×526 PNG sequence). */
export const HOLLYWOOD_CRANE_FIGMA = {
  frameW: 1484,
  frameH: 672,
  assetW: 560,
  assetH: 526,
  width: 231.98332503678895,
  height: 186.26167529663883,
  /** PNG faces right — subtract from path tangent (from-up) to align body with curve */
  leanDeg: 88,
  pitchDeg: 2,
  /** Pivot — leg tips at stroke end (560×526 PNG analysis) */
  attachX: 0.02,
  attachY: 0.705,
  /** Fine-tune feet on gold stroke */
  attachNudgeY: 0.068,
  /** Chart tip — leg tips sit on curve end */
  tipOffsetX: -32,
  tipOffsetY: 0,
  /** Extra shift back along flight tangent (× marker width) */
  pathBack: 0.2,
  /** One full wing cycle (4 frames, ms) — ~150ms per pose */
  flapCycleMs: 600,
} as const;

/** Align east-facing crane sprite with quadratic flight tangent. */
export function hollywoodCraneRotate(rotateFromUp: number) {
  return (
    rotateFromUp -
    HOLLYWOOD_CRANE_FIGMA.leanDeg +
    HOLLYWOOD_CRANE_FIGMA.pitchDeg
  );
}

export function hollywoodCraneSize(canvasW: number, canvasH: number) {
  const scale = Math.min(
    canvasW / HOLLYWOOD_CRANE_FIGMA.frameW,
    canvasH / HOLLYWOOD_CRANE_FIGMA.frameH,
  );
  return {
    width: HOLLYWOOD_CRANE_FIGMA.width * scale,
    height: HOLLYWOOD_CRANE_FIGMA.height * scale,
  };
}

/** Nudge marker box so PNG leg tips land on the stroke end. */
export function hollywoodCranePosition(
  tipX: number,
  endY: number,
  markerW: number,
  markerH: number,
  curveCtrlX?: number,
  lineH?: number,
) {
  const { attachX, attachY, attachNudgeY, pathBack } = HOLLYWOOD_CRANE_FIGMA;

  let anchorX = tipX;
  let anchorY = endY;

  if (curveCtrlX != null && lineH != null) {
    const tanX = tipX - curveCtrlX;
    const tanY = endY - lineH;
    const len = Math.hypot(tanX, tanY) || 1;
    const back = pathBack * markerW;
    anchorX -= (tanX / len) * back;
    anchorY -= (tanY / len) * back;
  }

  return {
    left: anchorX - attachX * markerW,
    top: anchorY - attachY * markerH + attachNudgeY * markerH,
  };
}
