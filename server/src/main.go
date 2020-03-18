package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/mitchpowell/cryptonyms/server/src/lexicons"
)

var lexicon []string
var gameManager *GameManager

type PlayerRegistration struct {
	Spymaster bool
}

func getGameHandler(w http.ResponseWriter, r *http.Request) {
	gameID := strings.ToUpper(mux.Vars(r)["gameID"])
	game, err := gameManager.Get(gameID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(err.Error()))
	} else {
		response, _ := json.Marshal(game.gameBoard)
		w.Write(response)
	}

}

func registerPlayerHandler(w http.ResponseWriter, r *http.Request) {
	gameID := strings.ToUpper(mux.Vars(r)["gameID"])
	game, _ := gameManager.Get(gameID)
	var registrationPayload PlayerRegistration
	json.NewDecoder(r.Body).Decode(&registrationPayload)

	if registrationPayload.Spymaster {
		var cards [len(game.gameBoard.Cards)]*GameCard
		for i := 0; i < len(cards); i++ {
			cards[i] = &GameCard{
				Word:           game.gameBoard.Cards[i].Word,
				Color:          game.teamAssignments[i],
				HasBeenGuessed: game.gameBoard.Cards[i].HasBeenGuessed,
			}
		}

		spyMasterGameboard := &GameBoard{
			ID:    game.gameBoard.ID,
			Cards: &cards,
		}

		response, _ := json.Marshal(spyMasterGameboard)
		w.Write(response)
	} else {
		response, _ := json.Marshal(game.gameBoard)
		w.Write(response)
	}
}

func createGameHandler(w http.ResponseWriter, r *http.Request) {
	game := CreateGame(lexicon)
	response, err := json.Marshal(game.gameBoard)
	if err != nil {
		println("Got an error")
	}

	gameManager.Add(game)

	w.Write(response)
	go game.Run()
}

func handleWebSocketsUpgradeRequest(w http.ResponseWriter, r *http.Request) {
	gameID := strings.ToUpper(mux.Vars(r)["gameID"])
	game, err := gameManager.Get(gameID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(err.Error()))
		return
	}

	serveWS(game, w, r)
}

func configurationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: Fix up the access control settings
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		if r.Method == http.MethodOptions {
			return
		}
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		return ":8080"
	}
	return ":" + port
}

func main() {
	rand.Seed(time.Now().Unix())
	lexicon = lexicons.StandardLexicon
	gameManager = gameManager.NewGameManager()

	r := mux.NewRouter()

	r.HandleFunc("/game", createGameHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/game/{gameID}", getGameHandler).Methods(http.MethodGet)
	r.HandleFunc("/game/{gameID}", registerPlayerHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/game/{gameID}/ws", handleWebSocketsUpgradeRequest).Methods(http.MethodGet)

	r.Use(mux.CORSMethodMiddleware(r), configurationMiddleware)
	port := getPort()
	log.Fatal(http.ListenAndServe(port, r))
}
