

import * as React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  FloatingPortal,
  FloatingArrow,
  arrow,
  useTransitionStyles,
} from '@floating-ui/react';

import type { Placement } from '@floating-ui/react';

const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 5;

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  arrowRef?: React.RefObject<HTMLElement>;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const { context } = data;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
    }),
    [open, setOpen, interactions, data],
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: { children: React.ReactNode } & TooltipOptions) {

  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ...props,
        ...children.props,
        ref,
        'data-state': context.open ? 'open' : 'closed',
      }),
    );
  }

  return (
    <button
      ref={ref}

      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}>
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function TooltipContent({ style, ...props }, propRef) {
  const toolTipContext = useTooltipContext();
  const ref = useMergeRefs([toolTipContext.refs.setFloating, propRef]);

  const arrowX = toolTipContext.middlewareData.arrow?.x ?? 0;
  const arrowY = toolTipContext.middlewareData.arrow?.y ?? 0;
  const transformX = arrowX + ARROW_WIDTH / 2;
  const transformY = arrowY + ARROW_HEIGHT;

  const { isMounted, styles } = useTransitionStyles(toolTipContext.context, {
    initial: {
      opacity: 0,
      transform: 'scale(0)',
    },
    common: ({ side }) => ({
      transformOrigin: {
        top: `${transformX}px calc(100% + ${ARROW_HEIGHT}px)`,
        bottom: `${transformX}px ${-ARROW_HEIGHT}px`,
        left: `calc(100% + ${ARROW_HEIGHT}px) ${transformY}px`,
        right: `${-ARROW_HEIGHT}px ${transformY}px`,
      }[side],
    }),
    close: {
      opacity: 0,
      transform: 'scale(2)',
    },
  });

  return (
    <FloatingPortal>
      {isMounted && (
        <div
          ref={ref}
          className='Lego-Tooltip'
          style={{
            ...toolTipContext.floatingStyles,
            ...style,
          }}
          {...toolTipContext.getFloatingProps(props)}>
          <div style={styles} className='Lego-Tooltip-Inner'>
            {props.children}
            <FloatingArrow
              ref={toolTipContext.arrowRef}
              context={toolTipContext.context}
              fill='rgb(45, 122, 167)'
            />
          </div>
        </div>
      )}
    </FloatingPortal>
  );
});
