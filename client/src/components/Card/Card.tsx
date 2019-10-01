import React, { Component } from 'react';
import './card.scss';

interface CardState {
  flipped: boolean;
}
export class Card extends Component<{}, CardState> {
  constructor(props: any) {
    super(props);
    this.state = {
      flipped: false
    };
  }

  private toggleActiveState() {
    this.setState({ flipped: !this.state.flipped });
  }

  render() {
    var cardClass = this.state.flipped ? 'card card--flipped' : 'card';
    return (
      <div className={cardClass}>
        <div className="card__inner" onClick={() => this.toggleActiveState()}>
          <div className="card__front">{this.props.children}</div>
          <div className="card__back"></div>
        </div>
      </div>
    );
  }
}
