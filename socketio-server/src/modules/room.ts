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
    amountOfBatches: number;
    batchSize: number;
    startAmount: number;
  }; // TODO
  counter?: number;
  started?: boolean; // TODO: shouldn't be optional
  time?: {
    startTime: number;
    currentTime: number;
    timestampBatch: number;
    timestampFive: number;
    timer: any; // TODO
  };

  constructor(id, users, counter, settings) {
    this.id = id;
    this.users = users;
    this.counter = counter;
    this.settings = settings;
    this.time = {
      startTime: 0,
      currentTime: 0,
      timestampBatch: 0,
      timestampFive: 0,
      timer: null,
    };
  }

  startTimer = (io): void => {
    this.time.startTime = Date.now();
    console.log("==== START TIMER ====");
    this.time.timer = setInterval(
      function () {
        this.time.currentTime = Date.now() - this.time.startTime;

        if (GameController.didGameEnd(this.id)) {
          GameController.stopTimer(this.id);
          return;
        }

        GameController.emitUpateGame(io, this.id);
      }.bind(this),
      200
    );
  };

  setTimestamp = () => {
    this.time.timestampBatch = Date.now() - this.time.startTime;
  };

  clearInterval = () => clearInterval(this.time.timer);
}

export default Room;
