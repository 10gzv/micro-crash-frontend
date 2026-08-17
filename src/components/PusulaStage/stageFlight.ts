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

/** Mobile pre-lift parabola offset for smooth takeoff. */
export const MOBILE_TAKEOFF_OFFSET = 70;
export const MOBILE_PLAIN_STEP = 0.9;
export const DESKTOP_PLAIN_STEP = 2;
export const HOLLYWOOD_MOBILE_TAKEOFF_OFFSET = 55;

export function takeoffRunOffset(run: number, hollywood = false) {
  if (!isMobile()) return 0;
  const max = hollywood
    ? HOLLYWOOD_MOBILE_TAKEOFF_OFFSET
    : MOBILE_TAKEOFF_OFFSET;
  const ramp = hollywood ? 30 : 26;
  return max * smoothstep01(Math.min(1, run / ramp));
}

export function advancePlainStep(
  prev: PlainPosition,
  coeff: number,
  hollywood = false,
): PlainPosition {
  const runOffset = takeoffRunOffset(prev.y, hollywood);
  const yStep = isMobile()
    ? MOBILE_PLAIN_STEP
    : hollywood
      ? PLAIN_Y_STEP * 1.08
      : DESKTOP_PLAIN_STEP;
  const nextY = prev.y + yStep;
  return {
    x: parabolaY(coeff, nextY + runOffset),
    y: nextY,
  };
}

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
    return 0;
  }
  if (!canvasW) return isMobile() ? 64 : 80;
  return isMobile()
    ? Math.round(Math.min(98, Math.max(64, canvasW * 0.22)))
    : Math.round(Math.min(100, Math.max(72, canvasW * 0.11)));
}

export function hollywoodClimbStepEase(climb: number, canvasW: number) {
  const ramp = climbRampLength(canvasW) * 0.72;
  const t = smoothstep01(Math.min(1, climb / ramp));
  return 0.28 + 0.72 * (t * t);
}

export function hollywoodRunBlend(climb: number, canvasW: number) {
  const ramp = climbRampLength(canvasW) * (isMobile() ? 2.55 : 1.85);
  const t = smoothstep01(Math.min(1, climb / ramp));
  return isMobile() ? t * t * t : t * t * t * t;
}

export function hollywoodClimbBlend(nextRun: number, canvasW: number) {
  return hollywoodRunBlend(nextRun, canvasW);
}

export function climbRampLength(canvasW: number) {
  if (!canvasW) return isMobile() ? 84 : 72;
  return isMobile()
    ? Math.round(Math.min(150, Math.max(90, canvasW * 0.34)))
    : Math.round(Math.min(96, Math.max(72, canvasW * 0.14)));
}

export const MARKER_WAITING_LEFT = -37;
export const MARKER_WAITING_LEFT_MOBILE = -31;
export const MARKER_WAITING_GROUND_RATIO = 0.75;
export const MARKER_WAITING_GROUND_RATIO_MOBILE = 0.79;
export const MARKER_WAITING_PITCH_MOBILE = -4;
export const MARKER_WAITING_ORIGIN_Y_MOBILE = 0.88;
export const MARKER_FLIGHT_NUDGE_X_MOBILE = -3;
export const MARKER_FLIGHT_NUDGE_Y_MOBILE = 3;

export function smoothstep01(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export const ODD_BG_BLEND_START = 1.72;
export const ODD_BG_BLEND_END = 2.28;

export function oddBackgroundBlend(
  odd: number | string | null | undefined,
): number {
  const n = Number(odd);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n <= ODD_BG_BLEND_START) return 0;
  if (n >= ODD_BG_BLEND_END) return 1;
  const t = (n - ODD_BG_BLEND_START) / (ODD_BG_BLEND_END - ODD_BG_BLEND_START);
  return smoothstep01(t);
}

export function chartTrailReveal(
  run: number,
  canvasW: number,
  waitT: number,
  hollywood = false,
) {
  if (hollywood) {
    if (waitT > 0.72) return 0;
    const fadeEnd = Math.round(
      Math.min(isMobile() ? 24 : 18, Math.max(12, canvasW * 0.07)),
    );
    if (run <= 0.15) return 0;
    if (run >= fadeEnd) {
      return 1 - smoothstep01(Math.max(0, (waitT - 0.25) / 0.5)) * 0.35;
    }
    const runT = smoothstep01((run - 0.15) / (fadeEnd - 0.15));
    const waitBlend = 1 - smoothstep01(Math.max(0, (waitT - 0.2) / 0.55));
    return runT * waitBlend;
  }

  if (!isMobile()) return run > 0 ? 1 : 0;
  if (waitT > 0.72) return 0;
  const fadeEnd = Math.round(Math.min(18, Math.max(10, canvasW * 0.06)));
  if (run <= 0.15) return 0;
  if (run >= fadeEnd) return 1 - smoothstep01(Math.max(0, (waitT - 0.25) / 0.5)) * 0.35;
  const runT = smoothstep01((run - 0.15) / (fadeEnd - 0.15));
  const waitBlend = 1 - smoothstep01(Math.max(0, (waitT - 0.2) / 0.55));
  return runT * waitBlend;
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

export function hollywoodMarkerBlendSpan(canvasW: number) {
  const floor = hollywoodFloorRunLength(canvasW);
  if (floor > 0) return floor;
  if (isMobile()) {
    return Math.round(Math.min(56, Math.max(36, canvasW * 0.14)));
  }
  return Math.round(Math.min(28, Math.max(16, canvasW * 0.05)));
}

export function hollywoodMobileRunStepMul(run: number, canvasW: number) {
  if (!isMobile()) return 1;
  const ramp = Math.round(Math.min(52, Math.max(28, canvasW * 0.11)));
  const t = smoothstep01(Math.min(1, run / ramp));
  return 0.48 + 0.52 * t;
}

export function pusulaMarkerBlendSpan(canvasW: number) {
  return Math.round(Math.min(32, Math.max(20, canvasW * 0.085)));
}

/** Keep the crane parked until the trail is allowed to show (`chartTrailReveal` waitT > 0.72). */
export const HOLLYWOOD_TRAIL_WAIT_T = 0.72;

export function hollywoodCraneWaitT(waitT: number) {
  if (isMobile()) {
    if (waitT >= 0.9) return 1;
    return waitT / 0.9;
  }
  if (waitT >= HOLLYWOOD_TRAIL_WAIT_T) return 1;
  const t = waitT / HOLLYWOOD_TRAIL_WAIT_T;
  return t * t;
}

export function markerWaitingNudge(
  waiting: boolean,
  run: number,
  canvasW: number,
  hollywood = false,
) {
  if (waiting) return 1;
  const span = hollywood
    ? hollywoodMarkerBlendSpan(canvasW)
    : isMobile()
      ? pusulaMarkerBlendSpan(canvasW)
      : floorRunLength(canvasW);
  const hold = hollywood
    ? Math.min(isMobile() ? 10 : 6, span * (isMobile() ? 0.22 : 0.18))
    : isMobile()
      ? Math.min(6, span * 0.22)
      : 0;
  if (run < hold) return 1;
  const t = 1 - smoothstep01(Math.min(1, (run - hold) / Math.max(1, span - hold)));
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
  const mobile = isMobile();
  return {
    left:
      tipX -
      attachX * markerW +
      (mobile ? MARKER_FLIGHT_NUDGE_X_MOBILE : 0),
    top:
      endY -
      attachY * markerH +
      (mobile ? MARKER_FLIGHT_NUDGE_Y_MOBILE : 0),
  };
}

export function waitingMarkerBox(
  lineH: number,
  markerH: number,
  hollywood = false,
  markerW = 0,
): MarkerBox {
  const mobile = isMobile();
  if (hollywood) {
    const { attachY, attachNudgeY, attachNudgeYMobile, waitingForwardX, waitingForwardXMobile, waitingFloorNudgeY } =
      HOLLYWOOD_CRANE_FIGMA;
    const legsLeft =
      markerW > 0
        ? markerW * (mobile ? 0.3 : 0.36)
        : mobile
          ? 52
          : 84;
    const forward =
      markerW > 0
        ? markerW * (mobile ? waitingForwardXMobile : waitingForwardX)
        : mobile
          ? 24
          : 32;
    return {
      left: -legsLeft + forward,
      top:
        lineH -
        attachY * markerH +
        (mobile ? attachNudgeYMobile : attachNudgeY) * markerH +
        waitingFloorNudgeY * markerH,
    };
  }
  return {
    left: mobile ? MARKER_WAITING_LEFT_MOBILE : MARKER_WAITING_LEFT,
    top:
      lineH -
      markerH *
        (mobile ? MARKER_WAITING_GROUND_RATIO_MOBILE : MARKER_WAITING_GROUND_RATIO),
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
  const waiting = waitingMarkerBox(lineH, markerH, hollywood, markerW);
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
  waitingBox?: MarkerBox,
): MarkerBox {
  if (hollywood && waitingBox) {
    const t = waiting ? 1 : waitT;
    return {
      left: flight.left + (waitingBox.left - flight.left) * t,
      top: flight.top + (waitingBox.top - flight.top) * t,
    };
  }
  return {
    left: flight.left + offset.left * waitT,
    top: flight.top + offset.top * waitT,
  };
}

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
  const baseTipOffsetX =
    hollywood && isMobile() ? 14 : PLAIN_TIP_OFFSET_X;
  const runEase = hollywood
    ? floorRunEase(plainPosition.y, canvasWidth, hollywood)
    : 1;
  const tipOffsetX = hollywood ? baseTipOffsetX * runEase : PLAIN_TIP_OFFSET_X;
  const liftEase = hollywood ? climbLiftEase(plainPosition.x, hollywood) : 1;

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
  pitchDeg: -5,

  attachX: 0.26,
  attachY: 0.63,

  attachNudgeY: -0.02,
  attachNudgeYMobile: -0.07,
  attachNudgeX: -0.08,
  strokeAttachX: 0.105,
  strokeAttachY: 0.668,
  strokeAttachNudgeY: 0.016,
  strokeInset: 0.032,
  strokeInsetMobile: 0.024,
  tipOffsetX: -32,
  tipOffsetY: 0,

  pathBack: 0.13,
  flapCycleMs: 420,

  waitingLiftY: 0,
  waitingFloorNudgeY: 0.022,
  waitingForwardX: 0,
  waitingForwardXMobile: -0.02,

  /** Waiting tilt — less nose-down than in-flight pitch. */
  waitingPitch: -2,
  waitingPitchMobile: -3,
  waitingOriginY: 0.74,
  waitingOriginYMobile: 0.78,
} as const;

export function hollywoodCraneLevelDeg() {
  return (
    MARKER_FLOOR_ROTATE_FROM_UP -
    HOLLYWOOD_CRANE_FIGMA.leanDeg +
    HOLLYWOOD_CRANE_FIGMA.pitchDeg
  );
}

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

export function hollywoodCraneStrokeEnd(
  left: number,
  top: number,
  markerW: number,
  markerH: number,
  curveCtrlX: number,
  lineH: number,
  endY: number,
  tipX: number,
) {
  const {
    strokeAttachX,
    strokeAttachY,
    strokeAttachNudgeY,
    strokeInset,
    strokeInsetMobile,
  } = HOLLYWOOD_CRANE_FIGMA;
  const base = {
    x: left + strokeAttachX * markerW,
    y:
      top +
      strokeAttachY * markerH +
      strokeAttachNudgeY * markerH,
  };
  const tanX = tipX - curveCtrlX;
  const tanY = endY - lineH;
  const len = Math.hypot(tanX, tanY) || 1;
  const inset = (isMobile() ? strokeInsetMobile : strokeInset) * markerW;
  const onFloor = lineH != null && endY >= lineH - 1;
  const tailDrop = markerH * 0.01;
  const tail = {
    x: base.x - (onFloor ? 1 : tanX / len) * inset,
    y: onFloor ? lineH! : base.y - (tanY / len) * inset + tailDrop,
  };
  return tail;
}

export function hollywoodCranePosition(
  tipX: number,
  endY: number,
  markerW: number,
  markerH: number,
  curveCtrlX?: number,
  lineH?: number,
): MarkerBox {
  const { attachX, attachY, attachNudgeY, attachNudgeYMobile, attachNudgeX, pathBack, waitingFloorNudgeY } =
    HOLLYWOOD_CRANE_FIGMA;

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

  const floorDist = lineH != null ? Math.max(0, lineH - endY) : 0;
  const floorSpan = isMobile() ? 56 : 28;
  const floorT = 1 - smoothstep01(Math.min(1, floorDist / floorSpan));
  const floorNudgeY = waitingFloorNudgeY * markerH * floorT;
  const nudgeY = isMobile() ? attachNudgeYMobile : attachNudgeY;

  return {
    left: anchorX - attachX * markerW + attachNudgeX * markerW,
    top: anchorY - attachY * markerH + nudgeY * markerH + floorNudgeY,
  };
}

export function hollywoodCraneRotate(_rotateFromUp?: number) {
  return hollywoodCraneLevelDeg();
}

export function hollywoodCraneRotateWithWait(waitT: number) {
  const { leanDeg, pitchDeg, waitingPitch, waitingPitchMobile } =
    HOLLYWOOD_CRANE_FIGMA;
  const waitingPitchDeg = isMobile() ? waitingPitchMobile : waitingPitch;
  const pitch = waitingPitchDeg * waitT + pitchDeg * (1 - waitT);
  return MARKER_FLOOR_ROTATE_FROM_UP - leanDeg + pitch;
}

export function hollywoodCraneOriginY(waitT: number) {
  const { attachY, waitingOriginY, waitingOriginYMobile } = HOLLYWOOD_CRANE_FIGMA;
  const waitingOrigin = isMobile() ? waitingOriginYMobile : waitingOriginY;
  return waitingOrigin * waitT + attachY * (1 - waitT);
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
