import { isMobile } from '@lego/helpers/isMobile';

import { compassLayout, flightRayHub } from './flightPath';

/** Parabolic climb + pixel hover at cap (internal plainPosition axes). */
export function parabolaY(a: number, x: number) {
  return a * x ** 2;
}

export const PLAIN_VOL = isMobile() ? 20 : 80;
export const PLAIN_HOVER_STEP = isMobile() ? 0.2 : 0.5;
export const PLAIN_Y_STEP = isMobile() ? 0.9 : 2;
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
    pos.y < canvasW * 0.92 - markerW &&
    pos.x < canvasH * 0.70 - markerH
  );
}

/** Chart tip — marker attach + quadratic control (stable). */
export function chartTipFromPlain(
  plainPosition: PlainPosition,
  canvasWidth: number,
  canvasHeight: number,
) {
  const hub = flightRayHub(canvasWidth, canvasHeight);
  const lineH = canvasHeight;
  const tipY = lineH - plainPosition.x - 10;
  const tipX = plainPosition.y + 20;
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
  const blend = isMobile() ? 0.34 : 0.38;
  return prevX + (targetX - prevX) * blend;
}

export const MARKER_ATTACH_X = 45.9159 / 110;
export const MARKER_ATTACH_Y = 82.1712 / 115;
export const MARKER_SVG_LEAN_DEG =
  (Math.atan2(68.5578 - 45.9159, -(18.8127 - 82.1712)) * 180) / Math.PI;
/** Nudge nose slightly above path tangent (visual only). */
export const MARKER_VISUAL_PITCH_DEG = -5;
