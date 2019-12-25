package main

type PayloadAction string

const (
	Flip   PayloadAction = "Flip"
	Reveal PayloadAction = "Reveal"
)

// Client Payloads

type ClientPayload struct {
	Action PayloadAction `json:"action"`
	Data   interface{}   `json:"data"`
}

type CardFlipPayload struct {
	Action PayloadAction `json:"action"`
	Data   *CardFlipData `json:"data"`
}

type CardFlipData struct {
	CardIndex int
}

// Server Payloads

type RevealPayload struct {
	Action PayloadAction `json:"action"`
	Data   *RevealData   `json:"data"`
}

type RevealData struct {
	RevealIndex int   `json:"index"`
	Color       Color `json:"color"`
}
