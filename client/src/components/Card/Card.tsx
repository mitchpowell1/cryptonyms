import React, { Component } from 'react';
import './card.scss';
import { Color } from '../../common/gameboard';

interface CardProps {
  hasBeenGuessed: boolean;
  color: Color;
  onClick: () => void;
}

export class Card extends Component<CardProps, {}> {
  private handleClick() {
    this.props.onClick();
  }

  private colorClassMap = {
    [Color.Blue]: 'blue',
    [Color.Red]: 'red',
    [Color.Assassin]: 'assassin',
    [Color.Neutral]: 'neutral',
    [Color.Unknown]: 'neutral',
  };

  render() {
    const cardClass = this.props.hasBeenGuessed ? `card card--flipped` : 'card';
    const cardBackClass = `card__back card__back--${
      this.colorClassMap[this.props.color]
    }`;
    return (
      <div className={cardClass}>
        <div className="card__inner" onClick={this.handleClick.bind(this)}>
          <div className="card__front">{this.props.children}</div>
          <div className={cardBackClass}></div>
        </div>
      </div>
    );
  }
}
