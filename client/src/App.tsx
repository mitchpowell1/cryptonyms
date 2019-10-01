import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';
import { Home } from './views/Home';
import { Game } from './views/Game';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/game/:gameId">
          <Game />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
