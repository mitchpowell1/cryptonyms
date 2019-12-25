package main

import (
	"math/rand"
)

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

func createCards(words *[wordListLength]string) *[wordListLength]*GameCard {
	var cards [wordListLength]*GameCard
	for i := 0; i < wordListLength; i++ {
		cards[i] = &GameCard{
			Word:           words[i],
			HasBeenGuessed: false,
			Color:          UNKNOWN,
		}
	}
	return &cards
}

func getTeamAssignments(startingTeam Color) *[wordListLength]Color {
	var teamList [wordListLength]Color
	var firstTeam Color
	var secondTeam Color

	if startingTeam == RED {
		firstTeam = RED
		secondTeam = BLUE
	} else {
		firstTeam = BLUE
		secondTeam = RED
	}

	i := 0

	for i < 9 {
		teamList[i] = firstTeam
		i++
	}

	for i < 17 {
		teamList[i] = secondTeam
		i++
	}

	for i < 24 {
		teamList[i] = NEUTRAL
		i++
	}

	teamList[24] = ASSASSIN

	rand.Shuffle(wordListLength, func(i, j int) {
		teamList[i], teamList[j] = teamList[j], teamList[i]
	})

	return &teamList
}

func CreateGame(lexicon []string) *Game {
	id := createID()
	wordList := createWordList(lexicon)
	cards := createCards(wordList)
	teamList := getTeamAssignments(RED)
	println(teamList)
	var gameBoard = &GameBoard{
		ID:    id,
		Cards: cards,
	}

	return &Game{
		gameBoard:       gameBoard,
		teamAssignments: teamList,
		clients:         make(map[*Client]bool),
		broadcast:       make(chan []byte),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
	}
}
