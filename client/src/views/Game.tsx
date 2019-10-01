import React from 'react';
import { GameBoard, Card } from '../components';
import './game.scss';

export const Game: React.FC = () => {
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
};
