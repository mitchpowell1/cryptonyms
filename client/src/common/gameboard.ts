export interface GameBoard {
  id: string;
  wordList: string[];
  cards: GameCard[];
}

export interface GameCard {
  word: string;
  color: Color;
  hasBeenGuessed: boolean;
}

export enum Color {
  Red = 0,
  Blue = 1,
  Neutral = 2,
  Assassin = 3,
  Unknown = 4,
}
