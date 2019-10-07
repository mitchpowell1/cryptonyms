package main

import (
	"errors"
)

type GameManager struct {
	games map[string]*Game
}

func (gm *GameManager) Add(game *Game) error {
	gameID := game.gameBoard.ID
	if _, ok := gm.games[gameID]; ok {
		return errors.New("Could not create a game with ID" + gameID)
	}

	gm.games[gameID] = game

	return nil
}

func (gm *GameManager) Get(gameID string) (*Game, error) {
	if game, ok := gm.games[gameID]; ok {
		return game, nil
	}
	return nil, errors.New("No game with ID " + gameID + " found.")
}

func (gm *GameManager) NewGameManager() *GameManager {
	return &GameManager{
		games: make(map[string]*Game),
	}
}
