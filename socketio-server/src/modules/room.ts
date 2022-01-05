import { GameController } from "../api/controllers/gameController";

interface IUser {
  username: string;
  localCounter: number;
  flipped: number;
}

class Room {
  id: string;
  users: IUser[];
  settings: {
    autoMoveCoins: boolean;
    startAmount: number;
    batchSize: number;
  }; // TODO
  counter?: number;
  started?: boolean; // TODO: shouldn't be optional
  startTime?: number;
  time?: number;
  timer: any; // TODO

  constructor(id, users, counter, settings) {
    this.id = id;
    this.users = users;
    this.counter = counter;
    this.settings = settings;
    this.startTime = 0;
    this.time = 0;
    this.timer = null;
  }

  startTimer = (io) => {
    this.startTime = Date.now();
    console.log("==== START TIMER ====");
    this.timer = setInterval(
      function () {
        this.time = Date.now() - this.startTime;

        if (GameController.didGameEnd(this.id)) {
          GameController.stopTimer(this.id);
          return;
        }

        GameController.emitUpateGame(io, this.id);
      }.bind(this),
      200
    );
  };

  clearInterval = () => clearInterval(this.timer);

  updateCounter(): void {
    this.counter = this.counter + 1;
  }
}

export default Room;
