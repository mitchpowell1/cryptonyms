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
  playerHasRegistered: boolean;
  playerIsSpymaster: boolean;
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
      playerHasRegistered: false,
      playerIsSpymaster: false,
    };
  }

  componentWillUnmount() {
    this.wsConnection.close();
  }

  handleCardClick(cardIndex: number) {
    this.wsConnection.sendCardFlip(cardIndex);
  }

  async registerPlayer(spymaster: boolean) {
    const registerPayload = { spymaster };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}game/${this.props.match.params.gameId}`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(registerPayload),
      }
    );
    const responseBody = await response.json();
    this.setState({
      cards: responseBody.cards,
      playerHasRegistered: true,
      playerIsSpymaster: spymaster,
    });
  }

  render() {
    if (!this.state.playerHasRegistered) {
      return (
        <div>
          <h1>Register as SpyMaster</h1>
          <button onClick={() => this.registerPlayer(true)}>Yes</button>
          <button onClick={() => this.registerPlayer(false)}>No</button>
        </div>
      );
    }
    return (
      <div className="game">
        <header className="header">
          <h1 className="header__title">Cryptonyms</h1>
        </header>
        <GameBoard>
          {this.state.cards.map((card, index) => (
            <Card
              hasBeenGuessed={
                card.hasBeenGuessed || this.state.playerIsSpymaster
              }
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
