import { Color } from './common/gameboard';

enum GameAction {
  Flip = 'Flip',
  Reveal = 'Reveal',
}

interface WSPayload {
  action: GameAction;
  data: object;
}

interface CardFlipPayload extends WSPayload {
  action: GameAction.Flip;
  data: {
    cardIndex: number;
  };
}

interface CardRevealData {
  index: number;
  color: Color;
}

export class WSConnection {
  private ws: WebSocket;
  private revealHandlers: Array<(index: number, color: Color) => any>;

  public constructor(gameId: string) {
    this.ws = new WebSocket(`${process.env.REACT_APP_WS_URL}game/${gameId}/ws`);
    this.ws.onmessage = this.handleWSMessage.bind(this);
    this.revealHandlers = [];
  }

  private handleWSMessage(event: MessageEvent) {
    const payload = JSON.parse(event.data);
    if (payload['action'] && payload['action'] === GameAction.Reveal) {
      this.handleCardReveal(payload['data']);
    }
  }

  private handleCardReveal(cardRevealData: CardRevealData) {
    for (const handler of this.revealHandlers) {
      handler(cardRevealData.index, cardRevealData.color);
    }
  }

  public subscribeRevealHandler(
    revealHandler: (index: number, color: Color) => any
  ) {
    this.revealHandlers.push(revealHandler);
  }

  public sendCardFlip(cardIndex: number) {
    const message: CardFlipPayload = {
      action: GameAction.Flip,
      data: {
        cardIndex,
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public close() {
    this.ws.close();
  }
}
