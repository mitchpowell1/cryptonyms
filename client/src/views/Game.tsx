import React from 'react';
import { GameBoard, Card } from '../components';
import './game.scss';

interface GameProps {
  match: {
    params: {
      gameId: string;
    };
  };
  gameId: string;
}
export class Game extends React.Component<GameProps, {}> {
  async componentDidMount() {
    const { gameId } = this.props.match.params;
    console.log('Grabbing result from server');
    const result = await fetch(`http://localhost:8080/game/${gameId}`);
    const body = await result.text();
    console.log('Fetch Result:', body);
  }

  render() {
    return (
      <div className="game">
        <header className="header">
          <h1 className="header__title">Cryptonyms</h1>
        </header>
        <GameBoard>
          <Card>Buffalo</Card>
          <Card>Cheese Grater</Card>
          <Card>Chuck E. Cheese</Card>
          <Card>Chicken Nuggets</Card>
          <Card>Tooth</Card>
          <Card>Buffalo</Card>
          <Card>Cheese Grater</Card>
          <Card>Chuck E. Cheese</Card>
          <Card>Chicken Nuggets</Card>
          <Card>Tooth</Card>
          <Card>Buffalo</Card>
          <Card>Cheese Grater</Card>
          <Card>Chuck E. Cheese</Card>
          <Card>Chicken Nuggets</Card>
          <Card>Tooth</Card>
          <Card>Buffalo</Card>
          <Card>Cheese Grater</Card>
          <Card>Chuck E. Cheese</Card>
          <Card>Chicken Nuggets</Card>
          <Card>Tooth</Card>
          <Card>Buffalo</Card>
          <Card>Cheese Grater</Card>
          <Card>Chuck E. Cheese</Card>
          <Card>Chicken Nuggets</Card>
          <Card>Tooth</Card>
        </GameBoard>
        <footer className="footer"></footer>
      </div>
    );
  }
}
