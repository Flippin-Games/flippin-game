import { GameController } from "../api/controllers/gameController";

class Time {
  startTime: number;
  currentTime: number;
  timestampBatch: number;
  timer: ReturnType<typeof setInterval>;
  roomId: number;

  constructor(startTime, currentTime, timestampBatch, timer, roomId) {
    this.startTime = startTime;
    this.currentTime = currentTime;
    this.timestampBatch = timestampBatch;
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
          console.log(this.timestampBatch);
          console.log("STOP TIME AT: ", this.currentTime);
        }
        GameController.updateUsers(this.roomId);

        GameController.emitUpateGame(io, this.roomId);
      }.bind(this),
      200
    );
  };

  setTimestampBatch = () => {
    this.timestampBatch = Date.now() - this.startTime;
  };

  stopTime = () => clearInterval(this.timer);
}

export default Time;
