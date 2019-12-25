import React from 'react';
import { GameBoard, Card } from '../components';
import './game.scss';
import { GameBoard as GB } from '../common';
import { WSConnection } from '../WSConnection';
import { GameCard } from '../common/gameboard';

export interface GameProps {
  match: {
    params: {
      gameId: string;
    };
  };
  gameId: string;
}

interface GameState {
  cards: GameCard[];
}
export class Game extends React.Component<GameProps, GameState> {
  private wsConnection: WSConnection;

  constructor(props: GameProps) {
    super(props);

    this.wsConnection = new WSConnection(props.match.params.gameId);
    this.wsConnection.subscribeRevealHandler((index, color) => {
      this.state.cards[index].hasBeenGuessed = true;
      this.state.cards[index].color = color;
      this.setState({ cards: this.state.cards });
    });

    this.state = {
      cards: [],
    };
  }

  async componentDidMount() {
    const { gameId } = this.props.match.params;
    const result = await fetch(
      `${process.env.REACT_APP_API_URL}game/${gameId}`
    );
    const { cards }: GB = await result.json();
    this.setState({ cards });
  }

  componentWillUnmount() {
    this.wsConnection.close();
  }

  handleCardClick(cardIndex: number) {
    this.wsConnection.sendCardFlip(cardIndex);
  }

  render() {
    return (
      <div className="game">
        <header className="header">
          <h1 className="header__title">Cryptonyms</h1>
        </header>
        <GameBoard>
          {this.state.cards.map((card, index) => (
            <Card
              hasBeenGuessed={card.hasBeenGuessed}
              color={card.color}
              key={card.word}
              onClick={() => this.handleCardClick(index)}
            >
              {card.word}
            </Card>
          ))}
        </GameBoard>
        <footer className="footer"></footer>
      </div>
    );
  }
}
