package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func gameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	gameID := mux.Vars(r)["gameID"]
	fmt.Fprintf(w, "Received your request for game %s", gameID)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/game/{gameID}", gameHandler)
	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1:8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
