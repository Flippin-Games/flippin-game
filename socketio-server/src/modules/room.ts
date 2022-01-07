import Settings from "./settings";
import Time from "./time";
import User from "./user";

class Room {
  id: string;
  users: User[];
  settings: Settings;
  counter?: number;
  started?: boolean; // TODO: shouldn't be optional
  time: Time;

  constructor(id, users, counter, settings) {
    this.id = id;
    this.users = users;
    this.counter = counter;
    this.settings = new Settings(
      settings.autoMoveCoins,
      settings.amountOfBatches,
      settings.batchSize,
      settings.startAmount
    );
    this.time = new Time(0, 0, 0, 0, null, this.id);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUser(username: string): User {
    const user = this.users.find((user) => user.username === username);

    return user;
  }

  getCounter(): number {
    return this.counter;
  }

  removeUser(username: string): void {
    this.users = this.users.filter((user) => user.username !== username);
  }

  updateCounter(): number {
    this.counter = this.counter + 1;
    return this.counter;
  }

  // TODO should this be async?
  updateCoinsTaken(from, to): void {
    // TODO error handle and checks

    const userToTakeFrom = this.getUser(from);
    const userToGiveTo = this.getUser(to);

    userToTakeFrom.flipped = userToTakeFrom.flipped - this.settings.batchSize;
    userToGiveTo.localCounter =
      userToGiveTo.localCounter + this.settings.batchSize;
  }
}

export default Room;
