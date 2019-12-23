package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

var lexicons map[string][]string
var gameManager *GameManager

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

func createGameHandler(w http.ResponseWriter, r *http.Request) {
	game := CreateGame(lexicons["Standard"])
	response, err := json.Marshal(game.gameBoard)
	if err != nil {
		println("Got an error")
	}

	gameManager.Add(game)

	w.Write(response)
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

func main() {
	lexicons, _ = LoadLexicons("../lexicons")
	gameManager = gameManager.NewGameManager()

	r := mux.NewRouter()

	r.HandleFunc("/game", createGameHandler).Methods(http.MethodPost, http.MethodOptions)
	r.HandleFunc("/game/{gameID}", getGameHandler).Methods(http.MethodGet)
	r.HandleFunc("/game/{gameID}/ws", handleWebSocketsUpgradeRequest).Methods(http.MethodGet)

	r.Use(mux.CORSMethodMiddleware(r), configurationMiddleware)
	log.Fatal(http.ListenAndServe(":8080", r))
}
