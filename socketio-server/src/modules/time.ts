import { GameController } from "../api/controllers/gameController";

class Time {
  startTime: number;
  currentTime: number;
  timestampBatch: number;
  timestampFive: number;
  timer: ReturnType<typeof setInterval>;
  roomId: number;

  constructor(
    startTime,
    currentTime,
    timestampBatch,
    timestampFive,
    timer,
    roomId
  ) {
    this.startTime = startTime;
    this.currentTime = currentTime;
    this.timestampBatch = timestampBatch;
    this.timestampFive = timestampFive;
    this.timer = timer;
    this.roomId = roomId;
    console.log(this.roomId);
  }

  startTimer = (io): void => {
    console.log("==== START TIMER ====");

    this.startTime = Date.now();
    this.timer = setInterval(
      function () {
        this.currentTime = Date.now() - this.startTime;

        if (GameController.didGameEnd(this.roomId)) {
          this.stopTime();
          return;
        }

        GameController.emitUpateGame(io, this.roomId);
      }.bind(this),
      200
    );
  };

  setTimestamp = () => {
    this.timestampBatch = Date.now() - this.startTime;
  };

  stopTime = () => clearInterval(this.timer);
}

export default Time;
