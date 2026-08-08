export interface IUserBetRequest {
  amount: number;
  ticket_name: number;
  seed: string;
  auto_cash_out_odd?: number;
}

export interface IUserCashoutRequest {
  betId: number;
}

export interface IUserCancelRequest {
  betId: number;
}
