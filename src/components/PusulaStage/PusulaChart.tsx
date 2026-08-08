import { FC, useEffect, useRef } from 'react';

import { chartTipFromPlain, type PlainPosition } from './stageFlight';

type PusulaChartProps = {
  plainPosition: PlainPosition;
  canvasWidth: number;
  canvasHeight: number;
};

/**
 * Stage chart — single quadratic (stable), Pusula colors.
 */
export const PusulaChart: FC<PusulaChartProps> = ({
  plainPosition,
  canvasWidth,
  canvasHeight,
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

    if (plainPosition.x <= 0 && plainPosition.y <= 0) return;

    const { hub, tipX, endY, curveCtrlX, lineH } = chartTipFromPlain(
      plainPosition,
      canvasWidth,
      canvasHeight,
    );

    const strokePath = () => {
      ctx.beginPath();
      ctx.moveTo(hub.x, lineH);
      ctx.quadraticCurveTo(curveCtrlX, lineH, tipX, endY);
    };

    strokePath();
    ctx.lineTo(tipX, lineH);
    ctx.lineTo(hub.x, lineH);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, endY, 0, lineH);
    fillGrad.addColorStop(0, 'rgba(217, 138, 24, 0.38)');
    fillGrad.addColorStop(0.55, 'rgba(196, 122, 24, 0.12)');
    fillGrad.addColorStop(1, 'rgba(13, 23, 48, 0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    strokePath();
    ctx.strokeStyle = 'rgba(255, 214, 138, 0.3)';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    strokePath();
    const strokeGrad = ctx.createLinearGradient(0, lineH, tipX, endY);
    strokeGrad.addColorStop(0, '#D98A18');
    strokeGrad.addColorStop(1, '#FFD68A');
    ctx.strokeStyle = strokeGrad;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [plainPosition, canvasWidth, canvasHeight]);

  if (!canvasWidth || !canvasHeight) return null;

  return (
    <canvas
      ref={canvasRef}
      className='PusulaStage-ChartCanvas'
      aria-hidden
    />
  );
};
