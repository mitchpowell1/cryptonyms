package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
)

type ClientType int

const (
	Spy       ClientType = iota
	SpyMaster ClientType = iota
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// TODO: Find a better way to decide whether or not we trust requests
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Client struct {
	game       *Game
	clientType ClientType
	conn       *websocket.Conn
}

func serveWS(game *Game, w http.ResponseWriter, r *http.Request) error {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}
	var client = &Client{
		game:       game,
		clientType: Spy,
		conn:       conn,
	}

	game.clients = append(game.clients, client)

	go client.readPump()
	go client.writePump()

	return nil
}

func (client *Client) readPump() {
	client.conn.ReadMessage()
}

func (client *Client) writePump() {
	for i := 0; i < 100; i++ {
		message := []byte("Writing message " + strconv.Itoa(i))
		client.conn.WriteMessage(websocket.TextMessage, message)
		time.Sleep(2 * time.Second)
	}
}
