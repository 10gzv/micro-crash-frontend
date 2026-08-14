import { FC, useEffect, useRef } from 'react';

import { resolvedTheme } from '@lego/helpers/applyTheme';
import { GAME_SLUG } from '@lego/helpers/assetUrl';
import { isMobile } from '@lego/helpers/isMobile';

import { chartTipFromPlain, chartCurveCtrl, type PlainPosition } from './stageFlight';

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map(c => c + c)
          .join('')
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type PusulaChartProps = {
  plainPosition: PlainPosition;
  canvasWidth: number;
  canvasHeight: number;
  markerHeight: number;
  lineStart?: { x: number; y: number } | null;
  reveal?: number;
};

export const PusulaChart: FC<PusulaChartProps> = ({
  plainPosition,
  canvasWidth,
  canvasHeight,
  markerHeight,
  lineStart,
  reveal = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el || !canvasWidth || !canvasHeight) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = Math.round(canvasWidth * dpr);
    el.height = Math.round(canvasHeight * dpr);
    el.style.width = `${canvasWidth}px`;
    el.style.height = `${canvasHeight}px`;

    const ctx = el.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (reveal <= 0) return;

    const isHollywood = GAME_SLUG === 'hollywoodbets-crash';
    const flightTip = chartTipFromPlain(
      plainPosition,
      canvasWidth,
      canvasHeight,
      { hollywood: isHollywood, markerH: markerHeight },
    );
    const tipX = flightTip.tipX;
    const endY = flightTip.endY;
    const { hub, curveCtrlX, curveCtrlY, lineH } = lineStart
      ? chartCurveCtrl(
          plainPosition,
          canvasWidth,
          canvasHeight,
          tipX,
          endY,
          isHollywood,
        )
      : flightTip;

    const onChartFloor = endY >= lineH - 1;
    const climbCtrlX = Math.max(
      hub.x + 2,
      Math.min(curveCtrlX, tipX - 1),
    );

    const pathSpan = onChartFloor
      ? tipX - hub.x
      : Math.hypot(tipX - hub.x, endY - lineH);
    if (isHollywood && pathSpan < 4) return;

    let fillLeft = hub.x;

    const drawFillPath = () => {
      ctx.beginPath();
      if (isHollywood && onChartFloor) {
        fillLeft = hub.x;
        ctx.moveTo(hub.x, lineH);
        ctx.lineTo(tipX, lineH);
        return;
      }
      if (isHollywood) {
        fillLeft = hub.x;
        ctx.moveTo(hub.x, lineH);
        ctx.quadraticCurveTo(climbCtrlX, curveCtrlY, tipX, endY);
        return;
      }
      fillLeft = hub.x;
      ctx.moveTo(hub.x, lineH);
      ctx.quadraticCurveTo(curveCtrlX, curveCtrlY, tipX, endY);
    };

    const drawStrokePath = () => {
      ctx.beginPath();
      if (isHollywood && onChartFloor) {
        ctx.moveTo(hub.x, lineH);
        ctx.lineTo(tipX, lineH);
        return;
      }
      if (isHollywood) {
        ctx.moveTo(hub.x, lineH);
        ctx.quadraticCurveTo(climbCtrlX, curveCtrlY, tipX, endY);
        return;
      }
      ctx.moveTo(hub.x, lineH);
      ctx.quadraticCurveTo(curveCtrlX, curveCtrlY, tipX, endY);
    };

    const floorBleed = 8;
    const floorY = lineH + floorBleed;

    drawFillPath();
    ctx.lineTo(tipX, floorY);
    ctx.lineTo(fillLeft, floorY);
    ctx.closePath();

    const { fill, stroke } = resolvedTheme.chart;
    const fillGrad = ctx.createLinearGradient(0, endY, 0, floorY);
    const fillScale = isHollywood ? reveal : 1;
    if (GAME_SLUG === 'hollywoodbets-crash') {
      fillGrad.addColorStop(0, `rgba(199, 125, 255, ${0.3 * fillScale})`);
      fillGrad.addColorStop(0.55, `rgba(122, 47, 208, ${0.16 * fillScale})`);
      fillGrad.addColorStop(0.92, `rgba(122, 47, 208, ${0.14 * fillScale})`);
      fillGrad.addColorStop(1, `rgba(122, 47, 208, ${0.18 * fillScale})`);
    } else {
      fillGrad.addColorStop(0, hexToRgba(fill, 0.38 * fillScale));
      fillGrad.addColorStop(0.55, hexToRgba(fill, 0.12 * fillScale));
      fillGrad.addColorStop(0.92, hexToRgba(fill, 0.16 * fillScale));
      fillGrad.addColorStop(1, hexToRgba(fill, 0.22 * fillScale));
    }
    ctx.fillStyle = fillGrad;
    ctx.fill();

    const mobile = isMobile();
    const glowWidth = mobile ? (isHollywood ? 2.5 : 4) : 6;
    const coreWidth = mobile ? (isHollywood ? 1.5 : 2) : 3;
    const glowAlpha = (mobile && isHollywood ? 0.18 : 0.3) * reveal;

    drawStrokePath();
    ctx.globalAlpha = reveal;
    ctx.strokeStyle = hexToRgba(stroke, glowAlpha);
    ctx.lineWidth = glowWidth;
    ctx.lineCap = isHollywood && onChartFloor ? 'butt' : 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    drawStrokePath();
    const strokeGrad = ctx.createLinearGradient(fillLeft, lineH, tipX, endY);
    strokeGrad.addColorStop(0, fill);
    strokeGrad.addColorStop(1, stroke);
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = coreWidth;
    ctx.lineCap = isHollywood && onChartFloor ? 'butt' : 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [plainPosition, canvasWidth, canvasHeight, markerHeight, lineStart, reveal]);

  if (!canvasWidth || !canvasHeight) return null;

  return (
    <canvas
      ref={canvasRef}
      className='PusulaStage-ChartCanvas'
      aria-hidden
    />
  );
};
