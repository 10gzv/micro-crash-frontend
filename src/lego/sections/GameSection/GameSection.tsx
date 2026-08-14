

import {
  FC,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useMediaQuery } from "react-responsive";

import { useStickyDetector } from "@/lego/hooks/useStickyDetector";

import { IGameSectionProps } from "./GameSection.types";
import { PusulaStage } from "@/components/PusulaStage";

const CONTENT_MAX_HEIGHT = 250;
const CONTENT_MIN_HEIGHT = 120;

export const GameSection: FC<PropsWithChildren<IGameSectionProps>> = observer(
  ({ children }) => {
    const isMobile = useMediaQuery({ query: "(max-width: 1024px)" });

    const ref = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    const isSticky = useStickyDetector(ref);

    const contentMaxHeightRef = useRef(CONTENT_MAX_HEIGHT);

    const [drawChart, setDrawChart] = useState(false);

    useLayoutEffect(() => {
      const contentElement = contentRef.current;
      if (!isMobile || !contentElement) {
        return;
      }

      contentMaxHeightRef.current = contentElement.clientHeight;
    }, [isMobile]);

    useEffect(() => {
      const contentElement = contentRef.current;
      if (isMobile && isSticky && contentElement) {
        const scrollCallback = (event: Event) => {
          const target = event.target as HTMLElement;
          const currentHeight =
            contentMaxHeightRef.current - target.scrollTop;
          const height = Math.max(CONTENT_MIN_HEIGHT, currentHeight);

          contentElement.style.height = `${height}px`;
        };
        document.body.addEventListener("scroll", scrollCallback);
        return () => {
          document.body.removeEventListener("scroll", scrollCallback);
          contentElement.style.height = "100%";
        };
      }
    }, [isMobile, isSticky]);

    useEffect(() => {
      if (chartRef.current && contentRef.current) {
        setDrawChart(true);
      }
    }, []);

    return (
      <div
        ref={ref}
        className={clsx("Lego-GameSection", {
          "Lego-GameSection_stickyActive": isSticky,
          "Lego-GameSection_pusula": true,
        })}
      >
        <div className="Lego-GameSection-Content" ref={contentRef}>
          <div className="Lego-GameSection-Content-Chart" ref={chartRef}>
            {drawChart && <PusulaStage />}
          </div>
          {children}
        </div>
      </div>
    );
  },
);
