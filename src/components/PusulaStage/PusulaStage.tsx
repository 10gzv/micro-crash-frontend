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
import { isMobile } from '@lego/helpers/isMobile';
import { RoundOdd } from '@/components/RoundOdd';
import { Timer } from '@/components/Timer';
import { PusulaPersonAvatar } from '@/lego/components/Avatar/PusulaPersonAvatar';

import {
  PLAIN_HOVER_STEP,
  PLAIN_VOL,
  IDLE_POSITION,
  MARKER_ATTACH_X,
  MARKER_ATTACH_Y,
  MARKER_SVG_LEAN_DEG,
  MARKER_VISUAL_PITCH_DEG,
  canClimb,
  chartTipFromPlain,
  parabolaCoeff,
  advancePlainStep,
  HOLLYWOOD_CRANE_FIGMA,
  hollywoodCraneSize,
  hollywoodCraneRotateWithWait,
  hollywoodCraneOriginY,
  hollywoodCranePosition,
  hollywoodCraneLineAttach,
  hollywoodCraneStrokeEnd,
  markerWaitingNudge,
  flightMarkerBox,
  waitingMarkerOffset,
  waitingMarkerBox,
  markerBoxWithWaitingOffset,
  crashFlyTranslate,
  chartTrailReveal,
  hollywoodCraneWaitT,
  MARKER_WAITING_PITCH_MOBILE,
  MARKER_WAITING_ORIGIN_Y_MOBILE,
} from './stageFlight';
import { PusulaChart } from './PusulaChart';
import { StageRays } from './StageRays';
import { PusulaStageNotice } from '@/lego/components/BetAcceptedNotice';

const MARKER_ASPECT = 110 / 115;

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

  const compassUrl = gameAsset(GAME_ASSET_PATHS.stage.compass);
  const markerUrl = resolvedTheme.stageMarkers[0];

  const canvasW = canvasSize?.width || 0;
  const canvasH = canvasSize?.height || 0;
  const stageReady = canvasW > 0 && markerHeight > 0;

  const isHollywood = GAME_SLUG === 'hollywoodbets-crash';
  const layoutRef = useRef({
    canvasW,
    canvasH,
    markerWidth,
    markerHeight,
    isHollywood,
  });
  layoutRef.current = {
    canvasW,
    canvasH,
    markerWidth,
    markerHeight,
    isHollywood,
  };
  const crashPoseRef = useRef<{
    left: number;
    top: number;
    x: number;
    y: number;
    rotate: number;
  } | null>(null);
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
  const oddBlend = 0;

  useEffect(() => {
    if (isWaiting) {
      setPlainPosition(IDLE_POSITION);
      setFinalized(null);
      crashPoseRef.current = null;
    }
  }, [isWaiting]);

  useEffect(() => {
    if (!isOddStarted || isRoundOver || !stageReady) return undefined;

    setFinalized(null);
    setPlainPosition(IDLE_POSITION);

    let active = true;
    const animate = () => {
      const {
        canvasW: w,
        canvasH: h,
        markerWidth: mw,
        markerHeight: mh,
        isHollywood: hw,
      } = layoutRef.current;
      const coeff = parabolaCoeff(w, h, hw);
      setPlainPosition(prev => {
        if (!canClimb(prev, w, h, mw, mh, hw)) {
          setFinalized({ x: prev.x, y: prev.y });
          active = false;
          return prev;
        }
        return advancePlainStep(prev, coeff, hw);
      });
      if (active) requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => {
      active = false;
      cancelAnimationFrame(id);
    };
  }, [isOddStarted, isRoundOver, stageReady]);

  useEffect(() => {
    if (!finalized || !isOddStarted || isRoundOver) return undefined;

    let active = true;
    let reverse = true;

    const animate = () => {
      const { canvasW: w, markerWidth: mw } = layoutRef.current;
      setPlainPosition(prev => {
        const xMin = finalized.x - PLAIN_VOL;
        const xMax = finalized.x + PLAIN_VOL;

        if (!reverse && prev.x > xMin) {
          return {
            x: Math.max(prev.x - PLAIN_HOVER_STEP, xMin),
            y: Math.min(prev.y + 0.1, w - mw),
          };
        }
        if (reverse && prev.x < xMax) {
          return {
            x: Math.min(prev.x + PLAIN_HOVER_STEP, xMax),
            y: Math.min(prev.y + 0.1, w - mw),
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
  }, [finalized, isOddStarted, isRoundOver]);

  const layoutPosition = isWaiting ? IDLE_POSITION : plainPosition;

  const chartPosition =
    isRoundOver ? (finalized ?? plainPosition) : layoutPosition;

  const waitT = markerWaitingNudge(
    isWaiting,
    plainPosition.y,
    canvasW,
    isHollywood,
  );
  const craneWaitT = isHollywood ? hollywoodCraneWaitT(waitT) : waitT;

  const chartReveal =
    isOddStarted && !isRoundOver
      ? chartTrailReveal(plainPosition.y, canvasW, waitT, isHollywood)
      : 1;

  const showChart =
    canvasW > 0 && isOddStarted && !isRoundOver && chartReveal > 0;

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
  const hollywoodRotate = hollywoodCraneRotateWithWait(craneWaitT);

  const onFloor =
    tipGeom != null &&
    tipGeom.endY >= tipGeom.lineH - (markerHeight * (1 - markerAttachY)) - 2;

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

  const hollywoodWaitingBox =
    isHollywood && tipGeom
      ? waitingMarkerBox(
          tipGeom.lineH,
          markerHeight,
          true,
          markerWidth,
        )
      : null;

  const { left: markerLeft, top: markerTop } = markerBoxWithWaitingOffset(
    flightBox,
    waitingOffset,
    craneWaitT,
    isHollywood,
    isWaiting,
    hollywoodWaitingBox ?? undefined,
  );

  const lineAttach = isHollywood
    ? tipGeom
      ? hollywoodCraneStrokeEnd(
          markerLeft,
          markerTop,
          markerWidth,
          markerHeight,
          tipGeom.curveCtrlX,
          tipGeom.lineH,
          tipGeom.endY,
          tipGeom.tipX,
        )
      : hollywoodCraneLineAttach(
          markerLeft,
          markerTop,
          markerWidth,
          markerHeight,
        )
    : {
        x: markerLeft + markerAttachX * markerWidth,
        y: markerTop + markerAttachY * markerHeight,
      };

  const flightPitch = onFloor ? 0 : MARKER_VISUAL_PITCH_DEG;
  const pitchDeg =
    !isHollywood && isMobile()
      ? MARKER_WAITING_PITCH_MOBILE * waitT + flightPitch * (1 - waitT)
      : onFloor
        ? 0
        : MARKER_VISUAL_PITCH_DEG;
  const originY = isHollywood
    ? hollywoodCraneOriginY(craneWaitT)
    : !isHollywood && isMobile()
      ? MARKER_WAITING_ORIGIN_Y_MOBILE * waitT + markerAttachY * (1 - waitT)
      : markerAttachY;

  const liveRotate = isHollywood ? hollywoodRotate : rotateDeg + pitchDeg;
  if (!isRoundOver) {
    crashPoseRef.current = null;
  } else if (!crashPoseRef.current && canvasW > 0) {
    const fly = crashFlyTranslate(canvasW, markerLeft, markerWidth);
    crashPoseRef.current = {
      left: markerLeft,
      top: markerTop,
      x: fly.x,
      y: fly.y,
      rotate: liveRotate,
    };
  }
  const crashPose = crashPoseRef.current;

  const markerStyle = {
    left: crashPose?.left ?? markerLeft,
    top: crashPose?.top ?? markerTop,
    width: markerWidth,
    height: markerHeight,
    transformOrigin:
      isHollywood || (!isHollywood && isMobile())
        ? `${markerAttachX * 100}% ${originY * 100}%`
        : `${markerAttachX * 100}% ${markerAttachY * 100}%`,
    transform: crashPose
      ? `translate(${crashPose.x}px, ${crashPose.y}px) rotate(${crashPose.rotate}deg)`
      : `rotate(${liveRotate}deg)`,
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
        style={{ '--stage-odd-blend': oddBlend } as CSSProperties}
      >
        <PusulaStageNotice />

        <div className='PusulaStage-RaysStack' aria-hidden>
          <StageRays className='PusulaStage-Rays_low' />
          <StageRays className='PusulaStage-Rays_high' />
        </div>

        <div className='PusulaStage-GlowStack' aria-hidden>
          <div className='PusulaStage-Glow PusulaStage-Glow_low' />
          <div className='PusulaStage-Glow PusulaStage-Glow_high' />
        </div>

        <div className='PusulaStage-Vignette' aria-hidden />

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
              lineStart={lineAttach}
              reveal={chartReveal}
            />
          )}
        </div>

        {showMarker &&
          (isHollywood ? (
            <div
              className={clsx('PusulaStage-Crane', {
                'PusulaStage-Crane_waiting': isWaiting,
                'PusulaStage-Crane_flapping':
                  isOddStarted && !isRoundOver && craneWaitT < 1,
              })}
              style={{
                ...markerStyle,
                ['--hw-crane-cycle-ms' as string]: `${HOLLYWOOD_CRANE_FIGMA.flapCycleMs}ms`,
              }}
            >
              <div className='PusulaStage-CraneBody'>
                <img
                  className={clsx(
                    'PusulaStage-Marker',
                    'PusulaStage-Marker_hollywood',
                    'PusulaStage-Marker_hollywood_wait',
                  )}
                  src={gameAsset(GAME_ASSET_PATHS.stage.craneWait)}
                  alt=''
                  draggable={false}
                />
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
