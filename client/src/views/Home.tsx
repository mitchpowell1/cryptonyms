import React from 'react';
import './home.scss';

interface HomeState {
  isLoading: boolean;
  gameId: string;
}

export class Home extends React.Component<unknown, HomeState> {
  public constructor(props: unknown) {
    super(props);
    this.state = {
      isLoading: false,
      gameId: ''
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
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // no-referrer, *client
      });
      const gameBoard = await gameResponse.json();
      console.log(gameBoard);
    } catch (error) {
      console.log('Encountered error: ', error);
    }
  }

  private joinExistingGame() {
    console.log(`Joining an existing game: ${this.state.gameId}`);
  }

  render() {
    return (
      <main className="home-content">
        <div className="menu">
          <h1>Start a new game</h1>
          <button onClick={() => this.startNewGame()}>Click Here</button>
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
            <button onClick={() => this.joinExistingGame()}>Join Now</button>
          </div>
        </div>
      </main>
    );
  }
}
