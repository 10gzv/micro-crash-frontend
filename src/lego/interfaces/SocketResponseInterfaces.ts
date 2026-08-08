export interface OddUpdateInterface {
  odd: string | number;
}

export interface UserBalanceInterface {
  balance: number;
  currency: string;
  userId: number;
}

export interface GameStateUpdateInterface {
  id: number;
  is_crashed: number;
  is_started: number;
  crash_value: number;
  launch_time: number;
  current_time: number;
  sha256_next_server_seed?: string;
}

export interface IUserConfigs {
  min_bet: number;
  max_bet: number;
  max_win: number;
  denomination: number;
  amount_ranges: number[];
  min_auto_cashout_odd: number;
  default_bet_amount: number;
  chat_enabled: boolean;
  chat_max_length: number;
  avatars: IAvatar[];
}
export interface IAvatar {
  avatarId: number;
  avatarUrl: string;
  avatarName: string;
}
export interface UserStateInterface {
  userBets: UserBetInterface[];
}

export interface UserBetInterface {
  id: number;
  nickname: string;
  amount: number;
  currency: string;
  is_won: number;
  ticket_name: number;
  auto_cash_out_odd: number | null;
  cashout_amount: number | null;
  cashout_odd: number | null;
}

export interface BetAcceptedInterface {
  id: number;
  amount: number;
  ticket_name: number;
}

export interface BetCanceledInterface {
  removed: boolean;
  id: number;
  ticket_name: number;
}

export interface BetCashoutedInterface {
  id: number;
  avatar: string;
  ticket_name: number;
  amount: number;
  cashout_amount: number;
  cashout_odd: number;
  cashout_time: number;
  currency: string;
  freebet_id: number;
}

export interface GamePreviousResultsInterface {
  previousResults: GamePreviousResultInterface[];
}

export interface GamePreviousResultInterface {
  id: number;
  crashValue: number;
}
