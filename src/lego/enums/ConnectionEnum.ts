export enum ConnectionStatus {
  CONNECTING = 0, // The connection is not yet open.
  OPEN, // The connection is open and ready to communicate.
  CLOSING, // The connection is in the process of closing.
  CLOSED, // The connection is closed or couldn't be opened.
}

export enum ConnectionDefaultEvents {
  Close = 'close',
  Error = 'error',
  Message = 'message',
  Open = 'open',
}

export enum ConnectionRequestName {
  MyLast = 'FR:MY_LAST',
  TopBets = 'FR:TOP_BETS',
  ClaimFreeBet = 'FR:CLAIM_FREEBET',
  UserBet = 'FR:USER_BET',
  CancelBet = 'FR:CANCEL_BET',
  CashoutBet = 'FR:CASHOUT_BET',
  PreviousRoundResult = 'FR:ROUND_PREVIOUS_RESULT',
  RoundFairness = 'FR:GET_ROUND_FAIRNESS',
  HasFreebet = 'FR:HAS_USER_FREEBET',
}

export enum ConnectionResponseName {
  UserLastBets = 'USER_LAST_BETS',
  TopBets = 'TOP_BETS',
  Freebets = 'FREEBETS',
  FreeBetClaimed = 'FREEBET_CLAIMED',
  OddUpdate = 'ODD_UPDATE',
  GameStateUpdate = 'GAME_STATE_UPDATE',
  UserBalance = 'USER_BALANCE',
  FreebetStatus = 'FREEBET_STATUS',
  UserConfigs = 'USER_CONFIGS',
  UserState = 'USER_STATE',
  Bets = 'BETS',
  BetAccepted = 'BET_ACCEPTED',
  BetCanceled = 'BET_CANCELED',
  BetCashouted = 'BET_CASHOUTED',
  GamePreviousResults = 'GAME_PREVIOUS_RESULTS',
  PreviousRoundResult = 'ROUND_PREVIOUS_RESULT',
  ExchangeRates = 'EXCHANGE_RATES',
  RoundFairness = 'ROUND_FAIRNESS',
  Notifications = 'NOTIFICATIONS',
}
