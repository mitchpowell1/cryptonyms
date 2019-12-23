package main

import (
	"math/rand"
)

type Game struct {
	gameBoard *GameBoard
	clients   []*Client
}

type GameBoard struct {
	ID       string                  `json:"id"`
	WordList *[wordListLength]string `json:"wordList"`
}

const charSet string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
const wordListLength = 25

func createID() string {
	ID := make([]byte, 5)
	for i := 0; i < 5; i++ {
		ID[i] = charSet[rand.Intn(len(charSet))]
	}

	return string(ID)
}

func createWordList(lexicon []string) *[wordListLength]string {
	var wordList [wordListLength]string
	permutation := rand.Perm(len(lexicon))
	for i := 0; i < wordListLength; i++ {
		wordList[i] = lexicon[permutation[i]]
	}
	return &wordList
}

func CreateGame(lexicon []string) *Game {
	id := createID()
	wordList := createWordList(lexicon)
	var gameBoard = &GameBoard{
		ID:       id,
		WordList: wordList,
	}

	return &Game{
		gameBoard: gameBoard,
	}
}
