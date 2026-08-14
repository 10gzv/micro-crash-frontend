export type FlightPoint = { x: number; y: number };

export type FlightCubic = {
  p0: FlightPoint;
  p1: FlightPoint;
  p2: FlightPoint;
  p3: FlightPoint;
};

export function compassLayout(W: number, H: number) {
  const size = Math.min(340, W * 0.42);
  const cx = W * 0.5;
  const cy = H * 0.48;
  const r = size * 0.5;
  return { cx, cy, r, size };
}

function lerpPt(a: FlightPoint, b: FlightPoint, t: number): FlightPoint {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function flightRayHub(_W: number, H: number): FlightPoint {
  return { x: 0, y: H };
}

export const FLIGHT_CRUISE_PROGRESS = 0.86;

export function flightCubic(W: number, H: number): FlightCubic {
  const { cx, cy, r } = compassLayout(W, H);
  const origin = flightRayHub(W, H);

  const tip = {
    x: Math.min(W * 0.92, cx + r * 1.78),
    y: Math.max(H * 0.1, cy - r * 0.78),
  };

  return {
    p0: origin,
    p1: { x: W * 0.62, y: origin.y },
    p2: { x: cx + r * 0.28, y: cy + r + Math.max(12, r * 0.2) },
    p3: tip,
  };
}

export function cubicAt(c: FlightCubic, t: number): FlightPoint {
  const u = 1 - t;
  const { p0, p1, p2, p3 } = c;
  return {
    x:
      u * u * u * p0.x +
      3 * u * u * t * p1.x +
      3 * u * t * t * p2.x +
      t * t * t * p3.x,
    y:
      u * u * u * p0.y +
      3 * u * u * t * p1.y +
      3 * u * t * t * p2.y +
      t * t * t * p3.y,
  };
}

export function cubicTangent(c: FlightCubic, t: number): FlightPoint {
  const u = 1 - t;
  const { p0, p1, p2, p3 } = c;
  return {
    x:
      3 * u * u * (p1.x - p0.x) +
      6 * u * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x),
    y:
      3 * u * u * (p1.y - p0.y) +
      6 * u * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y),
  };
}

export function cubicLeft(c: FlightCubic, t: number): FlightCubic {
  const tt = Math.min(1, Math.max(0, t));
  const { p0, p1, p2, p3 } = c;
  const p01 = lerpPt(p0, p1, tt);
  const p12 = lerpPt(p1, p2, tt);
  const p23 = lerpPt(p2, p3, tt);
  const p012 = lerpPt(p01, p12, tt);
  const p123 = lerpPt(p12, p23, tt);
  const p0123 = lerpPt(p012, p123, tt);
  return { p0, p1: p01, p2: p012, p3: p0123 };
}

export function tipFromProgress(W: number, H: number, progress: number) {
  const c = flightCubic(W, H);
  const t = Math.min(1, Math.max(0, progress));
  const pt = cubicAt(c, t);
  const tan = cubicTangent(c, Math.max(t, 0.002));
  const fromUpDeg = (Math.atan2(tan.x, -tan.y) * 180) / Math.PI;
  return {
    x: pt.x,
    y: H - pt.y,
    rotateFromUp: fromUpDeg,
  };
}
