package main

type GameBoard struct {
	ID    string                     `json:"id"`
	Cards *[wordListLength]*GameCard `json:"cards"`
}

type GameCard struct {
	Word           string `json:"word"`
	Color          Color  `json:"color"`
	HasBeenGuessed bool   `json:"hasBeenGuessed"`
}

type Color int

const (
	RED Color = iota
	BLUE
	NEUTRAL
	ASSASSIN
	UNKNOWN
)
