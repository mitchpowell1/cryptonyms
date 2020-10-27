import React from 'react';
import { GameBoard, Card } from '../components';
import './game.scss';
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
  private wsConnection: WSConnection | null = null;

  constructor(props: GameProps) {
    super(props);

    this.state = {
      cards: [],
      playerHasRegistered: false,
      playerIsSpymaster: false,
    };
  }

  componentWillUnmount() {
    if (this.wsConnection) {
      this.wsConnection.close();
    }
  }

  handleCardClick(cardIndex: number) {
    if (!this.state.playerIsSpymaster) {
      this.wsConnection!.sendCardFlip(cardIndex);
    }
  }

  async registerPlayer(isSpymaster: boolean) {
    const registerPayload = { isSpymaster };
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
      playerIsSpymaster: isSpymaster,
    });

    this.wsConnection = new WSConnection(responseBody.id);
    this.wsConnection.subscribeRevealHandler((index, color) => {
      this.state.cards[index].hasBeenGuessed = true;
      this.state.cards[index].color = color;
      this.setState({ cards: this.state.cards });
    });
  }

  render() {
    const { cards, playerIsSpymaster } = this.state;
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
          {cards.map((card, index) => (
            <Card
              hasBeenGuessed={
                card.hasBeenGuessed
              }
              spymasterMode={playerIsSpymaster}
              color={card.color}
              key={card.word}
              onClick={() => this.handleCardClick(index)}
              word={card.word}
            />
          ))}
        </GameBoard>
        <footer className="footer"></footer>
      </div>
    );
  }
}
