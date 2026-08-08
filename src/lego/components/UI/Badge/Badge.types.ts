export enum EBadgeColor {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

export interface IBadgeProps {
  color?: EBadgeColor;
  className?: string;
  onClick?: () => void;
}
