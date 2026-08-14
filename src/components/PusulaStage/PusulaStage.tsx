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
  PLAIN_Y_STEP,
  IDLE_POSITION,
  MARKER_ATTACH_X,
  MARKER_ATTACH_Y,
  MARKER_SVG_LEAN_DEG,
  MARKER_VISUAL_PITCH_DEG,
  canClimb,
  chartTipFromPlain,
  parabolaCoeff,
  parabolaY,
  plainXNext,
  HOLLYWOOD_CRANE_FIGMA,
  hollywoodCraneSize,
  hollywoodCraneRotate,
  hollywoodCranePosition,
  hollywoodCraneLineAttach,
  markerWaitingNudge,
  flightMarkerBox,
  waitingMarkerOffset,
  markerBoxWithWaitingOffset,
  floorRunLength,
  hollywoodFloorRunLength,
  climbBlend,
  CRASH_FLY_LIFT,
  smoothstep01,
} from './stageFlight';
import { PusulaChart } from './PusulaChart';
import { PusulaStageNotice } from '@/lego/components/BetAcceptedNotice';

const MARKER_ASPECT = 110 / 115;

/**
 * Pusulabet stage — parabolic climb + hover.
 */
export const PusulaStage: FC = observer(() => {
  const { isOddStarted, isRoundOver } = gameStore;
  const { numOfBets } = userBetsStore;

  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasSize = useSize(canvasRef);

  const [plainPosition, setPlainPosition] = useState(IDLE_POSITION);
  const [finalized, setFinalized] = useState<{ x: number; y: number } | null>(
    null,
  );

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

  const isWaiting = !isOddStarted && !isRoundOver;

  useEffect(() => {
    if (isWaiting) {
      setPlainPosition(IDLE_POSITION);
      setFinalized(null);
    }
  }, [isWaiting]);

  useEffect(() => {
    let active = isOddStarted && !isRoundOver;
    if (!active || !canvasW || !markerHeight) {
      return undefined;
    }

    setFinalized(null);
    setPlainPosition(IDLE_POSITION);

    const coeff = parabolaCoeff(canvasW, canvasH, isHollywood);

    const animate = () => {
      setPlainPosition(prev => {
        if (
          !canClimb(
            prev,
            canvasW,
            canvasH,
            markerWidth,
            markerHeight,
            isHollywood,
          )
        ) {
          setFinalized({ x: prev.x, y: prev.y });
          active = false;
          return prev;
        }

        const floorRun = isHollywood
          ? hollywoodFloorRunLength(canvasW)
          : floorRunLength(canvasW);
        const stepMul =
          prev.y === 0 && prev.x === 0 ? (isHollywood ? 0.22 : 0.28) : 1;
        const yStep = isHollywood ? PLAIN_Y_STEP * 1.08 : PLAIN_Y_STEP;
        const nextY = prev.y + yStep * stepMul;
        const onFloorRun = prev.x <= 0 && nextY < floorRun;
        let targetX = 0;
        if (!onFloorRun) {
          const raw = parabolaY(coeff, nextY);
          targetX = raw * climbBlend(nextY, canvasW);
        } else if (isHollywood && nextY > floorRun * 0.38) {
          const raw = parabolaY(coeff, nextY);
          const liftT = smoothstep01((nextY - floorRun * 0.38) / (floorRun * 0.62));
          targetX = raw * climbBlend(nextY, canvasW) * liftT;
        }
        return {
          x: plainXNext(
            prev.x,
            targetX,
            nextY,
            canvasW,
            canvasH,
            isHollywood,
          ),
          y: nextY,
        };
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
    isHollywood,
  ]);

  useEffect(() => {
    let active = Boolean(
      finalized && isOddStarted && !isRoundOver && canvasW,
    );
    if (!active) return undefined;

    let reverse = true;

    const animate = () => {
      setPlainPosition(prev => {
        if (!finalized) return prev;

        const xMin = finalized.x - PLAIN_VOL;
        const xMax = finalized.x + PLAIN_VOL;

        if (!reverse && prev.x > xMin) {
          return {
            x: Math.max(prev.x - PLAIN_HOVER_STEP, xMin),
            y: Math.min(prev.y + 0.1, canvasW - markerWidth),
          };
        }
        if (reverse && prev.x < xMax) {
          return {
            x: Math.min(prev.x + PLAIN_HOVER_STEP, xMax),
            y: Math.min(prev.y + 0.1, canvasW - markerWidth),
          };
        }
        reverse = !reverse;
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
    finalized,
    isOddStarted,
    isRoundOver,
    canvasW,
    canvasH,
    markerWidth,
    markerHeight,
  ]);

  const layoutPosition = isWaiting ? IDLE_POSITION : plainPosition;

  const chartPosition =
    isRoundOver ? (finalized ?? plainPosition) : layoutPosition;
  const showChart = canvasW > 0 && isOddStarted && !isRoundOver;
  const crashClimb = (finalized ?? plainPosition).x;
  const takeoffPhase =
    isHollywood &&
    isOddStarted &&
    !isRoundOver &&
    plainPosition.y < hollywoodFloorRunLength(canvasW);

  const tipGeom =
    canvasW > 0 && canvasH > 0 && markerHeight > 0
      ? chartTipFromPlain(chartPosition, canvasW, canvasH, {
          hollywood: isHollywood,
          markerH: markerHeight,
        })
      : null;

  const rotateDeg = tipGeom
    ? tipGeom.rotateFromUp - MARKER_SVG_LEAN_DEG
    : 0;
  const hollywoodRotate = tipGeom
    ? hollywoodCraneRotate(tipGeom.rotateFromUp)
    : 0;

  const onFloor =
    tipGeom != null &&
    tipGeom.endY >= tipGeom.lineH - (markerHeight * (1 - markerAttachY)) - 2;

  const waitT = markerWaitingNudge(
    isWaiting,
    plainPosition.y,
    canvasW,
    isHollywood,
  );

  const flightBox = tipGeom
    ? isHollywood
      ? hollywoodCranePosition(
          tipGeom.tipX,
          tipGeom.endY,
          markerWidth,
          markerHeight,
          tipGeom.curveCtrlX,
          tipGeom.lineH,
        )
      : flightMarkerBox(
          tipGeom.tipX,
          tipGeom.endY,
          markerWidth,
          markerHeight,
          markerAttachX,
          markerAttachY,
        )
    : { left: 0, top: 0 };

  const originTip = tipGeom
    ? chartTipFromPlain(IDLE_POSITION, canvasW, canvasH, {
        hollywood: isHollywood,
        markerH: markerHeight,
      })
    : null;

  const waitingOffset = tipGeom
    ? waitingMarkerOffset(
        tipGeom.lineH,
        markerWidth,
        markerHeight,
        markerAttachX,
        markerAttachY,
        isHollywood,
        originTip
          ? {
              tipX: originTip.tipX,
              endY: originTip.endY,
              curveCtrlX: originTip.curveCtrlX,
            }
          : undefined,
      )
    : { left: 0, top: 0 };

  const { left: markerLeft, top: markerTop } = markerBoxWithWaitingOffset(
    flightBox,
    waitingOffset,
    waitT,
    isHollywood,
    isWaiting,
  );

  const lineAttach = isHollywood
    ? hollywoodCraneLineAttach(
        markerLeft,
        markerTop,
        markerWidth,
        markerHeight,
      )
    : {
        x: markerLeft + markerAttachX * markerWidth,
        y: markerTop + markerAttachY * markerHeight,
      };

  const pitchDeg = onFloor ? 0 : MARKER_VISUAL_PITCH_DEG;

  const markerStyle = {
    left: markerLeft,
    top: markerTop,
    width: markerWidth,
    height: markerHeight,
    transformOrigin: `${markerAttachX * 100}% ${markerAttachY * 100}%`,
    transform: isRoundOver
      ? `translateX(${canvasW + markerWidth}px) translateY(-${crashClimb + CRASH_FLY_LIFT}px) rotate(${(isHollywood ? hollywoodRotate : rotateDeg) + 10}deg)`
      : `rotate(${isHollywood ? hollywoodRotate : rotateDeg + pitchDeg}deg)`,
  } as CSSProperties;

  const showMarker =
    markerHeight > 0 && (isWaiting || isOddStarted || isRoundOver);

  return (
    <div className='PusulaStage'>
      <div
        className={clsx('PusulaStage-Canvas', {
          'PusulaStage-Canvas_roundOver': isRoundOver,
          'PusulaStage-Canvas_oddStarted': isOddStarted,
          'PusulaStage-Canvas_waiting': isWaiting,
        })}
        ref={canvasRef}
      >
        <PusulaStageNotice />

        <img
          className='PusulaStage-Rays'
          src={raysUrl}
          alt=''
          draggable={false}
          aria-hidden
        />

        <div className='PusulaStage-Glow' aria-hidden />

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

        {isWaiting && <Timer />}
        <RoundOdd />

        <div className='PusulaStage-Chart'>
          {showChart && (
            <PusulaChart
              plainPosition={chartPosition}
              canvasWidth={canvasW}
              canvasHeight={canvasH}
              markerHeight={markerHeight}
              lineEnd={lineAttach}
            />
          )}
        </div>

        {showMarker &&
          (isHollywood ? (
            <div
              key={isWaiting ? 'hw-crane-wait' : 'hw-crane-active'}
              className={clsx('PusulaStage-Crane', {
                'PusulaStage-Crane_flapping': isOddStarted && !isRoundOver,
                'PusulaStage-Crane_takeoff': takeoffPhase,
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

        <div
          className={clsx('PusulaStage-Players', {
            'PusulaStage-Players_hollywood': isHollywood,
          })}
        >
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
