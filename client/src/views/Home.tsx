import React from 'react';
import { Route } from 'react-router-dom';
import './home.scss';
import { GameBoard } from '../common';
import { History } from 'history';

interface HomeState {
  isLoading: boolean;
  gameId: string;
}

export class Home extends React.Component<unknown, HomeState> {
  public constructor(props: unknown) {
    super(props);
    this.state = {
      isLoading: false,
      gameId: '',
    };
  }
  private async startNewGame() {
    try {
      const gameResponse = await fetch(`${process.env.REACT_APP_API_URL}game`, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
      });
      const { id: gameId }: GameBoard = await gameResponse.json();
      this.setState({ gameId });
    } catch (error) {
      console.log('Encountered error: ', error);
    }
  }

  private redirectToGamePage(history: History) {
    history.push(`/game/${this.state.gameId}`);
  }

  render() {
    return (
      <main className="home-content">
        <div className="menu">
          <h1>Start a new game</h1>
          <Route
            render={({ history }) => (
              <button
                onClick={async () => {
                  await this.startNewGame();
                  this.redirectToGamePage(history);
                }}
              >
                Click Here
              </button>
            )}
          ></Route>
        </div>
        <div className="menu">
          <h1>Join an existing game</h1>
          <div className="input-block">
            <input
              className="game-input"
              placeholder="Game ID"
              maxLength={5}
              value={this.state.gameId}
              onChange={e =>
                this.setState({ gameId: e.target.value.toUpperCase() })
              }
            ></input>
            <Route
              render={({ history }) => (
                <button onClick={() => this.redirectToGamePage(history)}>
                  Join Now
                </button>
              )}
            ></Route>
          </div>
        </div>
      </main>
    );
  }
}
