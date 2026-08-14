import { FC, useEffect, useRef } from 'react';

import { resolvedTheme } from '@lego/helpers/applyTheme';
import { GAME_SLUG } from '@lego/helpers/assetUrl';

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
  /** Screen point where stroke meets marker (tail attach). */
  lineEnd?: { x: number; y: number } | null;
};

/** Stage chart — quadratic tail from bottom-left to marker attach. */
export const PusulaChart: FC<PusulaChartProps> = ({
  plainPosition,
  canvasWidth,
  canvasHeight,
  markerHeight,
  lineEnd,
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

    const isHollywood = GAME_SLUG === 'hollywoodbets-crash';
    const flightTip = chartTipFromPlain(
      plainPosition,
      canvasWidth,
      canvasHeight,
      { hollywood: isHollywood, markerH: markerHeight },
    );
    const tipX = lineEnd?.x ?? flightTip.tipX;
    const endY = lineEnd?.y ?? flightTip.endY;
    const { hub, curveCtrlX, curveCtrlY, lineH } = lineEnd
      ? chartCurveCtrl(
          plainPosition,
          canvasWidth,
          canvasHeight,
          tipX,
          endY,
          isHollywood,
        )
      : flightTip;

    const strokePath = () => {
      ctx.beginPath();
      ctx.moveTo(hub.x, lineH);
      ctx.quadraticCurveTo(curveCtrlX, curveCtrlY, tipX, endY);
    };

    strokePath();
    ctx.lineTo(tipX, lineH);
    ctx.lineTo(hub.x, lineH);
    ctx.closePath();

    const { fill, stroke } = resolvedTheme.chart;
    const fillGrad = ctx.createLinearGradient(0, endY, 0, lineH);
    if (GAME_SLUG === 'hollywoodbets-crash') {
      fillGrad.addColorStop(0, 'rgba(199, 125, 255, 0.3)');
      fillGrad.addColorStop(0.55, 'rgba(122, 47, 208, 0.16)');
      fillGrad.addColorStop(1, 'rgba(18, 6, 31, 0)');
    } else {
      fillGrad.addColorStop(0, hexToRgba(fill, 0.38));
      fillGrad.addColorStop(0.55, hexToRgba(fill, 0.12));
      fillGrad.addColorStop(1, 'rgba(18, 6, 31, 0)');
    }
    ctx.fillStyle = fillGrad;
    ctx.fill();

    strokePath();
    ctx.strokeStyle = hexToRgba(stroke, 0.3);
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    strokePath();
    const strokeGrad = ctx.createLinearGradient(hub.x, lineH, tipX, endY);
    strokeGrad.addColorStop(0, fill);
    strokeGrad.addColorStop(1, stroke);
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [plainPosition, canvasWidth, canvasHeight, markerHeight, lineEnd]);

  if (!canvasWidth || !canvasHeight) return null;

  return (
    <canvas
      ref={canvasRef}
      className='PusulaStage-ChartCanvas'
      aria-hidden
    />
  );
};
