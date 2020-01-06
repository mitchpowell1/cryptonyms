package main

import "encoding/json"

type Game struct {
	gameBoard       *GameBoard
	teamAssignments *[wordListLength]Color
	clients         map[*Client]bool
	broadcast       chan []byte
	register        chan *Client
	unregister      chan *Client
}

func (game *Game) getResponse(clientMessage []byte) interface{} {
	var payload ClientPayload
	if err := json.Unmarshal(clientMessage, &payload); err != nil {
		return nil
	}

	if payload.Action == Flip {
		var cardFlipPayload CardFlipPayload
		if err := json.Unmarshal(clientMessage, &cardFlipPayload); err != nil {
			return nil
		}
		return game.handleCardFlip(cardFlipPayload.Data)
	}
	return nil
}

func (game *Game) handleCardFlip(data *CardFlipData) interface{} {
	flippedCard := data.CardIndex
	game.gameBoard.Cards[flippedCard].HasBeenGuessed = true
	game.gameBoard.Cards[flippedCard].Color = game.teamAssignments[flippedCard]

	return &RevealPayload{
		Action: Reveal,
		Data: &RevealData{
			RevealIndex: flippedCard,
			Color:       game.teamAssignments[flippedCard],
		},
	}
}

func (game *Game) Run() {
	for {
		select {
		case client := <-game.register:
			game.clients[client] = true
		case client := <-game.unregister:
			if _, ok := game.clients[client]; ok {
				delete(game.clients, client)
				close(client.send)
			}
		case message := <-game.broadcast:
			response := game.getResponse(message)
			responseBytes, err := json.Marshal(response)
			if err != nil {
				continue
			}
			for client := range game.clients {
				select {
				case client.send <- responseBytes:
				default:
					close(client.send)
					delete(game.clients, client)
				}
			}
		}
	}

}
