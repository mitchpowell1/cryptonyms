package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

var lexicons map[string][]string
var gameManager *GameManager

func getGameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	gameID := mux.Vars(r)["gameID"]
	game, err := gameManager.Get(gameID)
	if err != nil {
		println("Fucked up")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(err.Error()))
	} else {
		response, _ := json.Marshal(game.gameBoard)
		w.Header().Set("Content-Type", "application/json")
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

	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func main() {
	lexicons, _ = LoadLexicons("../lexicons")
	gameManager = gameManager.NewGameManager()

	r := mux.NewRouter()
	r.HandleFunc("/game", createGameHandler).Methods("POST")
	r.HandleFunc("/game/{gameID}", getGameHandler)
	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
