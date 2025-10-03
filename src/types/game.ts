export interface Player {
  id: string;
  name: string;
  balance: number; // в тысячах монет
  isActive: boolean;
}

export interface Transaction {
  id: string;
  timestamp: number;
  type: 'income' | 'expense' | 'transfer' | 'player_added';
  amount: number; // в тысячах монет
  fromPlayerId?: string;
  toPlayerId?: string;
  description: string;
}

export interface GameState {
  players: Player[];
  transactions: Transaction[];
  gameId: string;
}

export const STARTING_BALANCE = 15000; // 15 миллионов в тысячах
export const MIN_BALANCE = -5000; // -5 миллионов в тысячах
