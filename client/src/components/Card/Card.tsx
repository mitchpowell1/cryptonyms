import React, { Component } from 'react';
import './card.scss';
import { Color } from '../../common/gameboard';

interface CardProps {
  word: string;
  spymasterMode: boolean;
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
    const {
      word,
      hasBeenGuessed,
      spymasterMode,
    } = this.props;

    const guessedCheckboxId = `${word}-flipped-checkbox`;
    const cardClass = (hasBeenGuessed || spymasterMode) ? `card card--flipped` : 'card';
    const cardBackClass = `card__back card__back--${
      this.colorClassMap[this.props.color]
    }`;
    return (
      <div className={cardClass}>
        <div className="card__inner" onClick={this.handleClick.bind(this)}>
          <div className="card__front">
            {word}
          </div>
          <div className={cardBackClass}>
            {
              spymasterMode && (
                <div className="card__guessed-checkbox">
                  <label htmlFor={guessedCheckboxId}>Guessed</label>
                  <input 
                    disabled
                    id={guessedCheckboxId}
                    type="checkbox"
                    checked={this.props.hasBeenGuessed}
                  />
                </div>
              )
            }
            {word}
          </div>
        </div>
      </div>
    );
  }
}
