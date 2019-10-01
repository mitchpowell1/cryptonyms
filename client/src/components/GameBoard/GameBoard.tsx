import React from 'react';
import './gameboard.scss';

export const GameBoard: React.FC = ({ children }) => {
  return <div className="gameboard">{children}</div>;
};
