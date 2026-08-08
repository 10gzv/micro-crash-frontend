export interface IBetPanelProps {
  betPanelIndex: 0 | 1;
}

export enum BetState {
  DEFAULT,
  WAITING,
  CANCEL,
  CASHOUT,
}
