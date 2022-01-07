import { GameController } from "../api/controllers/gameController";
import Time from "./time";

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
  time: Time;

  constructor(id, users, counter, settings) {
    this.id = id;
    this.users = users;
    this.counter = counter;
    this.settings = settings;
    this.time = new Time(0, 0, 0, 0, null, this.id);
  }
}

export default Room;
