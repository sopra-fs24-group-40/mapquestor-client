class Game {
  constructor(data = {}) {
    this.gameId = null;
    this.gameCode = null;
    this.creator = null;
    this.playerCount = null;
    this.maxPlayers = null;
    this.roundCount = null;
    this.gameType = null;
    this.gameStatus = null;
    Object.assign(this, data);
  }
}

export default Game;