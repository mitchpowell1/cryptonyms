package main

type ClientType int

const (
	Spy       ClientType = 0
	SpyMaster ClientType = 1
)

type Client struct {
	game       *Game
	clientType ClientType
}
