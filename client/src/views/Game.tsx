import React from 'react';
import { GameBoard, Card } from '../components';
import './game.scss';
import { GameBoard as GB } from '../common';

interface GameProps {
  match: {
    params: {
      gameId: string;
    };
  };
  gameId: string;
}

interface GameState {
  cards: string[];
}
export class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);

    this.state = {
      cards: [],
    };
  }

  async componentDidMount() {
    const { gameId } = this.props.match.params;
    const result = await fetch(
      `${process.env.REACT_APP_API_URL}game/${gameId}`
    );
    const { wordList: cards }: GB = await result.json();
    this.setState({ cards });
    this.establishWSConnection();
  }

  private establishWSConnection() {
    const { gameId } = this.props.match.params;
    const ws = new WebSocket(
      `${process.env.REACT_APP_WS_URL}game/${gameId}/ws`
    );
    ws.onmessage = event => {
      const messageText = event.data;
      console.log('Received a websockets message');
      console.log(messageText);
    };
    console.log('Established web socket connection');
    console.log();
  }

  render() {
    return (
      <div className="game">
        <header className="header">
          <h1 className="header__title">Cryptonyms</h1>
        </header>
        <GameBoard>
          {this.state.cards.map(card => (
            <Card key={card}>{card}</Card>
          ))}
        </GameBoard>
        <footer className="footer"></footer>
      </div>
    );
  }
}
