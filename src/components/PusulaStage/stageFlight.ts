import { isMobile } from '@lego/helpers/isMobile';

import { compassLayout, flightRayHub } from './flightPath';

export type PlainPosition = { x: number; y: number };

export const IDLE_POSITION: PlainPosition = { x: 0, y: 0 };

export function parabolaY(a: number, x: number) {
  return a * x ** 2;
}

export function parabolaRunFromClimb(a: number, climb: number) {
  if (!a || climb <= 0) return 0;
  return Math.sqrt(climb / a);
}

export const PLAIN_VOL = isMobile() ? 20 : 80;
export const PLAIN_HOVER_STEP = isMobile() ? 0.2 : 0.5;
export const PLAIN_Y_STEP = isMobile() ? 1.4 : 3.4;
export const CHART_TIP_OFFSET_Y = 10;
/** jugu PlayBoard — extra upward lift when plane flies away on crash. */
export const CRASH_FLY_LIFT = 150;

export function chartCurveScale(canvasW: number, canvasH: number) {
  if (!canvasW) return isMobile() ? 0.9 : 1.4;
  return Math.min(canvasW, canvasH) / Math.max(canvasW, canvasH);
}

export function parabolaCoeff(
  canvasW: number,
  canvasH: number,
  hollywood = false,
) {
  if (!canvasW) return 0;
  const base = canvasH / canvasW ** 2;
  if (hollywood) return base * (isMobile() ? 0.86 : 1.22);
  return isMobile() ? base * 0.82 : base;
}

export function canClimb(
  pos: PlainPosition,
  canvasW: number,
  canvasH: number,
  markerW: number,
  markerH: number,
  hollywood = false,
) {
  if (hollywood) {
    return (
      pos.y < canvasW * 0.97 - markerW &&
      pos.x < canvasH * 0.94 - markerH
    );
  }
  return (
    pos.y < canvasW * 0.92 - markerW &&
    pos.x < canvasH * 0.7 - markerH
  );
}

export const MARKER_ATTACH_X = 45.9159 / 110;
export const MARKER_ATTACH_Y = 82.1712 / 115;
export const MARKER_SVG_LEAN_DEG =
  (Math.atan2(68.5578 - 45.9159, -(18.8127 - 82.1712)) * 180) / Math.PI;
export const MARKER_FLOOR_ROTATE_FROM_UP = 90;
export const MARKER_VISUAL_PITCH_DEG = -5;
export const PLAIN_TIP_OFFSET_X = 20;

export function floorRunLength(canvasW: number, hollywood = false) {
  if (hollywood) {
    if (!isMobile()) return 0;
    if (!canvasW) return 48;
    return Math.round(Math.min(72, Math.max(40, canvasW * 0.17)));
  }
  if (!canvasW) return isMobile() ? 64 : 80;
  return isMobile()
    ? Math.round(Math.min(98, Math.max(64, canvasW * 0.22)))
    : Math.round(Math.min(100, Math.max(72, canvasW * 0.11)));
}

/** Vertical climb — ease-in so the round does not snap upward. */
export function hollywoodClimbStepEase(climb: number, canvasW: number) {
  const ramp = climbRampLength(canvasW) * 0.72;
  const t = smoothstep01(Math.min(1, climb / ramp));
  return 0.28 + 0.72 * (t * t);
}

/** Horizontal drift — stays near zero until climb is well underway. */
export function hollywoodRunBlend(climb: number, canvasW: number) {
  const ramp = climbRampLength(canvasW) * (isMobile() ? 2.55 : 1.85);
  const t = smoothstep01(Math.min(1, climb / ramp));
  return isMobile() ? t * t * t : t * t * t * t;
}

/** @deprecated use hollywoodRunBlend — kept for climbBlend alias */
export function hollywoodClimbBlend(nextRun: number, canvasW: number) {
  return hollywoodRunBlend(nextRun, canvasW);
}

export function climbRampLength(canvasW: number) {
  if (!canvasW) return isMobile() ? 84 : 72;
  return isMobile()
    ? Math.round(Math.min(150, Math.max(90, canvasW * 0.34)))
    : Math.round(Math.min(96, Math.max(72, canvasW * 0.14)));
}
/** Waiting marker — raised above floor, tucked into bottom-left corner. */
export const MARKER_WAITING_LEFT = -19;
export const MARKER_WAITING_LEFT_MOBILE = -13;
export const MARKER_WAITING_VISIBLE = 0.72;
export const MARKER_WAITING_VISIBLE_MOBILE = 0.77;

export function smoothstep01(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function climbLiftEase(climb: number, hollywood = false) {
  if (climb <= 0) return 0;
  const span =
    hollywood && isMobile() ? 52 : hollywood ? 20 : isMobile() ? 24 : 16;
  const t = smoothstep01(Math.min(1, climb / span));
  if (hollywood && isMobile()) return t;
  return isMobile() ? t * t : t;
}

export function floorRunEase(
  run: number,
  canvasW: number,
  hollywood = false,
) {
  if (run <= 0) return 0;
  const span = hollywood
    ? Math.max(
        12,
        isMobile()
          ? hollywoodFloorRunLength(canvasW)
          : climbRampLength(canvasW) * 0.45,
      )
    : floorRunLength(canvasW);
  return smoothstep01(Math.min(1, run / span));
}

export function climbBlend(
  nextRun: number,
  canvasW: number,
  hollywood = false,
) {
  if (hollywood) return hollywoodClimbBlend(nextRun, canvasW);
  const floor = floorRunLength(canvasW);
  const ramp = climbRampLength(canvasW);
  if (nextRun <= floor) return 0;
  const t = smoothstep01(Math.min(1, (nextRun - floor) / ramp));
  return isMobile() ? t * t : t;
}

export function hollywoodFloorRunLength(canvasW: number) {
  return Math.round(floorRunLength(canvasW) * 0.55);
}

export function markerWaitingNudge(
  waiting: boolean,
  run: number,
  canvasW: number,
  hollywood = false,
) {
  if (waiting) return 1;
  const span = hollywood ? hollywoodFloorRunLength(canvasW) : floorRunLength(canvasW);
  const t = 1 - smoothstep01(Math.min(1, run / Math.max(1, span)));
  return smoothstep01(t);
}

export type MarkerBox = { left: number; top: number };

export function flightMarkerBox(
  tipX: number,
  endY: number,
  markerW: number,
  markerH: number,
  attachX: number,
  attachY: number,
): MarkerBox {
  return {
    left: tipX - attachX * markerW,
    top: endY - attachY * markerH,
  };
}

export function waitingMarkerBox(
  lineH: number,
  markerH: number,
  hollywood = false,
): MarkerBox {
  const mobile = isMobile();
  if (hollywood) {
    const { attachY, attachNudgeY, waitingLiftY } = HOLLYWOOD_CRANE_FIGMA;
    return {
      left: mobile
        ? HOLLYWOOD_CRANE_FIGMA.waitingLeftMobile
        : HOLLYWOOD_CRANE_FIGMA.waitingLeft,
      top:
        lineH -
        attachY * markerH +
        attachNudgeY * markerH -
        waitingLiftY * markerH,
    };
  }
  return {
    left: mobile ? MARKER_WAITING_LEFT_MOBILE : MARKER_WAITING_LEFT,
    top: lineH - markerH * (mobile ? MARKER_WAITING_VISIBLE_MOBILE : MARKER_WAITING_VISIBLE),
  };
}

export function waitingMarkerOffset(
  lineH: number,
  markerW: number,
  markerH: number,
  attachX: number,
  attachY: number,
  hollywood = false,
  originTip?: { tipX: number; endY: number; curveCtrlX: number },
): MarkerBox {
  const flightAtOrigin = hollywood
    ? hollywoodCranePosition(
        originTip?.tipX ?? 0,
        originTip?.endY ?? lineH,
        markerW,
        markerH,
        originTip?.curveCtrlX ?? 0,
        lineH,
      )
    : flightMarkerBox(0, lineH, markerW, markerH, attachX, attachY);
  const waiting = waitingMarkerBox(lineH, markerH, hollywood);
  return {
    left: waiting.left - flightAtOrigin.left,
    top: waiting.top - flightAtOrigin.top,
  };
}

export function markerBoxWithWaitingOffset(
  flight: MarkerBox,
  offset: MarkerBox,
  waitT: number,
  hollywood = false,
  waiting = false,
): MarkerBox {
  if (hollywood && !waiting) {
    return {
      left: flight.left + offset.left * waitT,
      top: flight.top,
    };
  }
  return {
    left: flight.left + offset.left * waitT,
    top: flight.top + offset.top * waitT,
  };
}

/** Shared quadratic control for hollywood vs default stage chart. */
function chartCurveControl(
  plainPosition: PlainPosition,
  canvasWidth: number,
  lineH: number,
  tipX: number,
  endY: number,
  hollywood: boolean,
) {
  const hub = flightRayHub(canvasWidth, lineH);
  const scale = chartCurveScale(canvasWidth, lineH);
  const climbBoost = hollywood ? (isMobile() ? 0.78 : 1.24) : 1;
  const runBoost = hollywood
    ? isMobile()
      ? 1.02
      : 1.52
    : isMobile()
      ? 1.15
      : 1.35;
  const fromClimb = plainPosition.x * scale * climbBoost;
  const fromRun = plainPosition.y * scale * runBoost;
  const onChartFloor = endY >= lineH - 0.5;
  const tipCap = hollywood ? (isMobile() ? 0.58 : 0.72) : 0.62;
  const runCtrl = Math.min(fromRun, tipX * tipCap);
  const climbCtrl = Math.min(Math.max(fromClimb, fromRun), tipX * tipCap);
  const ctrlSpan = hollywood ? (isMobile() ? 42 : 20) : 32;
  const ctrlLift = onChartFloor
    ? 0
    : smoothstep01(Math.min(1, (lineH - endY) / ctrlSpan));
  return {
    hub,
    curveCtrlX: hub.x + runCtrl + (climbCtrl - runCtrl) * ctrlLift,
    curveCtrlY: lineH,
    lineH,
  };
}

/** Chart quadratic — M(0,H) Q(climb·scale,H) (run+20, H−climb−10). */
export function chartTipFromPlain(
  plainPosition: PlainPosition,
  canvasWidth: number,
  canvasHeight: number,
  options?: { hollywood?: boolean; markerH?: number },
) {
  const hollywood = options?.hollywood ?? false;
  const lineH = canvasHeight;

  const markerAttachY = hollywood
    ? HOLLYWOOD_CRANE_FIGMA.attachY
    : MARKER_ATTACH_Y;

  const tipOffsetY = hollywood ? 6 : CHART_TIP_OFFSET_Y;
  const baseTipOffsetX = PLAIN_TIP_OFFSET_X;
  const runEase = floorRunEase(plainPosition.y, canvasWidth, hollywood);
  const tipOffsetX = baseTipOffsetX * runEase;
  const liftEase = climbLiftEase(plainPosition.x, hollywood);

  let tipY = lineH - plainPosition.x - tipOffsetY * liftEase;
  let tipX = plainPosition.y + tipOffsetX;
  let endY = tipY >= lineH ? lineH : tipY;

  const { hub, curveCtrlX, curveCtrlY } = chartCurveControl(
    plainPosition,
    canvasWidth,
    lineH,
    tipX,
    endY,
    hollywood,
  );

  const tanX = tipX - curveCtrlX;
  const tanY = endY - curveCtrlY;
  const pathRotate = (Math.atan2(tanX, -tanY) * 180) / Math.PI;
  const tailPad =
    options?.markerH && options.markerH > 0
      ? (1 - markerAttachY) * options.markerH
      : 18;
  const floorY = lineH - tailPad;

  let rotateFromUp = pathRotate;
  if (endY >= floorY - 1) {
    rotateFromUp = MARKER_FLOOR_ROTATE_FROM_UP;
  } else {
    const lift = Math.min(1, (floorY - endY) / (hollywood ? (isMobile() ? 36 : 22) : 28));
    rotateFromUp =
      MARKER_FLOOR_ROTATE_FROM_UP +
      (pathRotate - MARKER_FLOOR_ROTATE_FROM_UP) * lift;
  }

  return { hub, tipX, endY, curveCtrlX, curveCtrlY, lineH, rotateFromUp };
}

/** Quadratic control for a tail ending at an arbitrary screen point. */
export function chartCurveCtrl(
  plainPosition: PlainPosition,
  canvasWidth: number,
  canvasHeight: number,
  tipX: number,
  endY: number,
  hollywood = false,
) {
  return chartCurveControl(
    plainPosition,
    canvasWidth,
    canvasHeight,
    tipX,
    endY,
    hollywood,
  );
}

export function plainXNext(
  prevX: number,
  targetX: number,
  nextY: number,
  canvasW: number,
  canvasH: number,
  hollywood = false,
) {
  const eased = plainXUnderCompass(
    prevX,
    targetX,
    nextY,
    canvasW,
    canvasH,
    hollywood,
  );
  if (hollywood) {
    const chase = targetX > prevX ? 0.26 : 0.38;
    return prevX + (eased - prevX) * chase;
  }
  if (!isMobile()) return eased;
  const chase = targetX > prevX ? 0.36 : 0.5;
  return prevX + (eased - prevX) * chase;
}

export function plainXUnderCompass(
  prevX: number,
  targetX: number,
  nextY: number,
  canvasW: number,
  canvasH: number,
  hollywood = false,
) {
  if (hollywood) return targetX;
  const { cx, r } = compassLayout(canvasW, canvasH);
  const inZone = nextY > cx - r * 0.65 && nextY < cx + r * 1.15;
  if (!inZone) return targetX;
  const blend = isMobile() ? 0.34 : 0.38;
  return prevX + (targetX - prevX) * blend;
}

/** Smooth hollywood horizontal chase — no snap forward at round start. */
export function plainYNext(
  prevY: number,
  targetY: number,
  hollywood = false,
) {
  if (!hollywood) return targetY;
  const chase = targetY > prevY ? 0.11 : 0.2;
  return prevY + (targetY - prevY) * chase;
}

export const HOLLYWOOD_CRANE_FIGMA = {
  frameW: 1484,
  frameH: 672,
  assetW: 560,
  assetH: 526,
  width: 231.98332503678895,
  height: 186.26167529663883,
  leanDeg: 88,
  pitchDeg: 2,
  /** Pivot + stroke end — tail root / «попа» (560×526 PNG). */
  attachX: 0.26,
  attachY: 0.63,
  /** PNG padding — butt meets gold stroke (positive = lower on line). */
  attachNudgeY: 0.008,
  tipOffsetX: -32,
  tipOffsetY: 0,
  /** Body ahead of stroke end — line trails from tail (× marker width). */
  pathBack: 0.15,
  flapCycleMs: 600,
  /** Waiting — 0 = feet on floor line (same as takeoff origin). */
  waitingLiftY: 0,
  /** Waiting — tucked into bottom-left. */
  waitingLeft: -28,
  waitingLeftMobile: -15,
} as const;

export function hollywoodCraneLineAttach(
  left: number,
  top: number,
  markerW: number,
  markerH: number,
) {
  const { attachX, attachY } = HOLLYWOOD_CRANE_FIGMA;
  return {
    x: left + attachX * markerW,
    y: top + attachY * markerH,
  };
}

/** Anchor crane PNG — stroke exits at tail root; body sits ahead on curve. */
export function hollywoodCranePosition(
  tipX: number,
  endY: number,
  markerW: number,
  markerH: number,
  curveCtrlX?: number,
  lineH?: number,
): MarkerBox {
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
