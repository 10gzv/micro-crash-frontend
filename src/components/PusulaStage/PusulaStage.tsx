import { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { gameStore, userBetsStore } from '@10gzv/crash-core';
import { useSize } from '@/lego/hooks/useSize';
import {
  gameAsset,
  GAME_ASSET_PATHS,
  HOLLYWOOD_CRANE_FRAMES,
} from '@lego/constants/gameAssets';
import { resolvedTheme } from '@lego/helpers/applyTheme';
import { GAME_SLUG } from '@lego/helpers/assetUrl';
import { RoundOdd } from '@/components/RoundOdd';
import { Timer } from '@/components/Timer';
import { PusulaPersonAvatar } from '@/lego/components/Avatar/PusulaPersonAvatar';

import {
  PLAIN_HOVER_STEP,
  PLAIN_VOL,
  PLAIN_Y_KICK,
  PLAIN_Y_STEP,
  MARKER_ATTACH_X,
  MARKER_ATTACH_Y,
  MARKER_SVG_LEAN_DEG,
  MARKER_VISUAL_PITCH_DEG,
  canClimb,
  chartTipFromPlain,
  parabolaCoeff,
  parabolaY,
  plainXUnderCompass,
  HOLLYWOOD_CRANE_FIGMA,
  hollywoodCraneSize,
  hollywoodCraneRotate,
  hollywoodCranePosition,
} from './stageFlight';
import { PusulaChart } from './PusulaChart';
import { PusulaStageNotice } from '@/lego/components/BetAcceptedNotice';

const MARKER_ASPECT = 110 / 115;

/**
 * Pusulabet stage — marker trajectory + hover (parabola, pixel wobble).
 */
export const PusulaStage: FC = observer(() => {
  const { isOddStarted, isRoundOver } = gameStore;
  const { numOfBets } = userBetsStore;

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useSize(canvasRef);

  const [plainPosition, setPlainPosition] = useState({ x: 0, y: 0 });
  const [finalized, setFinalized] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [markerWidth, setMarkerWidth] = useState(52);
  const [markerHeight, setMarkerHeight] = useState(0);

  const raysUrl = gameAsset(GAME_ASSET_PATHS.stage.rays);
  const compassUrl = gameAsset(GAME_ASSET_PATHS.stage.compass);
  const markerUrl = resolvedTheme.stageMarkers[0];

  const canvasW = canvasSize?.width || 0;
  const canvasH = canvasSize?.height || 0;

  const isHollywood = GAME_SLUG === 'hollywoodbets-crash';
  const markerAttachX = isHollywood
    ? HOLLYWOOD_CRANE_FIGMA.attachX
    : MARKER_ATTACH_X;
  const markerAttachY = isHollywood
    ? HOLLYWOOD_CRANE_FIGMA.attachY
    : MARKER_ATTACH_Y;

  useEffect(() => {
    if (!canvasW) return;
    if (isHollywood && canvasH) {
      const { width, height } = hollywoodCraneSize(canvasW, canvasH);
      setMarkerWidth(width);
      setMarkerHeight(height);
      return;
    }
    const calculated = canvasW * 0.055;
    setMarkerWidth(Math.min(64, Math.max(44, calculated)));
  }, [canvasW, canvasH, isHollywood]);

  useEffect(() => {
    if (isHollywood) return;
    setMarkerHeight(markerWidth / MARKER_ASPECT);
  }, [markerWidth, isHollywood]);

  useEffect(() => {
    if (!isRoundOver) {
      setPlainPosition({ x: 0, y: 0 });
    }
  }, [isRoundOver]);

  // Phase 1 — parabolic climb until cap
  useEffect(() => {
    let active = isOddStarted && !isRoundOver;
    if (!active || !canvasW || !markerHeight) {
      if (!isOddStarted) setFinalized(null);
      return undefined;
    }

    setFinalized(null);
    setPlainPosition({ x: 0, y: 0 });

    const coeff = parabolaCoeff(canvasW, canvasH);

    const animate = () => {
      setPlainPosition(prev => {
        if (
          canClimb(prev, canvasW, canvasH, markerWidth, markerHeight)
        ) {
          const nextY = prev.y + PLAIN_Y_STEP;
          const targetX = parabolaY(coeff, prev.y + PLAIN_Y_KICK);
          return {
            x: plainXUnderCompass(
              prev.x,
              targetX,
              nextY,
              canvasW,
              canvasH,
            ),
            y: nextY,
          };
        }
        setFinalized({ x: prev.x, y: prev.y });
        active = false;
        return prev;
      });
      if (active) requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => {
      active = false;
      cancelAnimationFrame(id);
    };
  }, [
    isOddStarted,
    isRoundOver,
    canvasW,
    canvasH,
    markerWidth,
    markerHeight,
  ]);

  // Phase 2 — hover (smooth back/forth in px, not progress jumps)
  useEffect(() => {
    let active = Boolean(
      finalized && isOddStarted && !isRoundOver && canvasW,
    );
    if (!active) return undefined;

    let reverse = true;

    const animate = () => {
      setPlainPosition(prev => {
        if (!finalized) return prev;

        if (!reverse && prev.x > finalized.x - PLAIN_VOL) {
          return {
            x: Math.min(prev.x - PLAIN_HOVER_STEP, canvasH - markerHeight),
            y: Math.min(prev.y + 0.1, canvasW - markerWidth),
          };
        }
        if (
          reverse &&
          prev.x < finalized.x + PLAIN_VOL &&
          markerHeight - prev.x < 0
        ) {
          return {
            x: prev.x + PLAIN_HOVER_STEP,
            y: Math.min(prev.y - 0.1, canvasW - markerWidth),
          };
        }
        reverse = !(prev.x > finalized.x - PLAIN_VOL);
        return prev;
      });
      if (active) requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => {
      active = false;
      cancelAnimationFrame(id);
    };
  }, [finalized, isOddStarted, isRoundOver, canvasW, canvasH, markerWidth, markerHeight]);

  const tipGeom =
    canvasW > 0 && canvasH > 0
      ? chartTipFromPlain(plainPosition, canvasW, canvasH, { hollywood: isHollywood })
      : null;

  const rotateDeg = tipGeom
    ? tipGeom.rotateFromUp - MARKER_SVG_LEAN_DEG
    : 0;

  const hollywoodRotate = tipGeom ? hollywoodCraneRotate(tipGeom.rotateFromUp) : 0;

  const hollywoodPos =
    isHollywood && tipGeom
      ? hollywoodCranePosition(
          tipGeom.tipX,
          tipGeom.endY,
          markerWidth,
          markerHeight,
          tipGeom.curveCtrlX,
          tipGeom.lineH,
        )
      : null;

  const markerLeft = hollywoodPos
    ? hollywoodPos.left
    : tipGeom
      ? tipGeom.tipX - markerAttachX * markerWidth
      : 0;
  const markerTop = hollywoodPos
    ? hollywoodPos.top
    : tipGeom
      ? tipGeom.endY - markerAttachY * markerHeight
      : 0;

  const markerStyle = {
    left: markerLeft,
    top: isRoundOver ? markerTop - 120 : markerTop,
    width: markerWidth,
    height: markerHeight,
    opacity: 1,
    transformOrigin: `${markerAttachX * 100}% ${markerAttachY * 100}%`,
    transform: isRoundOver
      ? `translateX(${canvasW + markerWidth}px) rotate(${(isHollywood ? hollywoodRotate : rotateDeg) + 10}deg)`
      : `rotate(${isHollywood ? hollywoodRotate : rotateDeg + MARKER_VISUAL_PITCH_DEG}deg)`,
  } as CSSProperties;

  const showRays = isOddStarted && !isRoundOver;

  return (
    <div className='PusulaStage'>
      <div
        className={clsx('PusulaStage-Canvas', {
          'PusulaStage-Canvas_roundOver': isRoundOver,
          'PusulaStage-Canvas_oddStarted': isOddStarted,
          'PusulaStage-Canvas_flat': !isOddStarted || isRoundOver,
        })}
        ref={canvasRef}
      >
        <PusulaStageNotice />

        {showRays && (
          <img
            className='PusulaStage-Rays'
            src={raysUrl}
            alt=''
            draggable={false}
            aria-hidden
          />
        )}

        {isOddStarted && !isRoundOver && (
          <div className='PusulaStage-Glow' aria-hidden />
        )}

        <div
          className={clsx('PusulaStage-CompassWrap', {
            'PusulaStage-CompassWrap_hidden': !isOddStarted || isRoundOver,
          })}
        >
          <img
            className='PusulaStage-Compass'
            src={compassUrl}
            alt=''
            draggable={false}
          />
        </div>

        {!isOddStarted && !isRoundOver && <Timer />}
        <RoundOdd />

        <div className='PusulaStage-Chart'>
          {isOddStarted && !isRoundOver && canvasW > 0 && (
            <PusulaChart
              plainPosition={plainPosition}
              canvasWidth={canvasW}
              canvasHeight={canvasH}
            />
          )}
        </div>

        {(isOddStarted || isRoundOver) && markerHeight > 0 &&
          (isHollywood ? (
            <div
              className={clsx('PusulaStage-Crane', {
                'PusulaStage-Crane_flapping': isOddStarted && !isRoundOver,
              })}
              style={{
                ...markerStyle,
                ['--hw-crane-cycle-ms' as string]: `${HOLLYWOOD_CRANE_FIGMA.flapCycleMs}ms`,
              }}
            >
              <div className='PusulaStage-CraneBody'>
                {HOLLYWOOD_CRANE_FRAMES.map((frame, index) => (
                    <img
                      key={`${frame}-${index}`}
                      className={clsx(
                        'PusulaStage-Marker',
                        'PusulaStage-Marker_hollywood',
                        `PusulaStage-Marker_hollywood_${index}`,
                      )}
                      src={gameAsset(frame)}
                      alt=''
                      draggable={false}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <img
              className='PusulaStage-Marker'
              src={markerUrl}
              alt=''
              draggable={false}
              style={markerStyle}
            />
          ))}

        <div className={clsx('PusulaStage-Players', { 'PusulaStage-Players_hollywood': isHollywood })}>
          <div className='PusulaStage-PlayersAvatars'>
            {isHollywood ? (
              <>
                <PusulaPersonAvatar tone='c' size={22} />
                <PusulaPersonAvatar tone='a' size={22} />
                <PusulaPersonAvatar tone='b' size={22} />
              </>
            ) : (
              <>
                <PusulaPersonAvatar tone='a' size={16} />
                <PusulaPersonAvatar tone='b' size={16} />
                <PusulaPersonAvatar tone='c' size={16} />
              </>
            )}
          </div>
          <span className='PusulaStage-PlayersCount'>{numOfBets || 0}</span>
        </div>
      </div>
    </div>
  );
});
