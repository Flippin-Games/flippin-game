import Settings from "./settings";
import Time from "./time";
import User from "./user";

class Room {
  id: string;
  users: User[];
  settings: Settings;
  counter?: number;
  isPlaying?: boolean; // TODO: shouldn't be optional
  time: Time;
  gamesPlayed: { timeAllCompleted: number; timeBatchCompleted: number }[];

  constructor(id, users, counter) {
    this.id = id;
    this.users = users;
    this.counter = counter;
    this.isPlaying = false;
    this.settings = new Settings(true, 4, 5);
    this.time = new Time(0, 0, 0, null, this.id);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUser(username: string): User {
    const user = this.users.find((user) => user.username === username);

    return user;
  }

  getUserByIndex(index: number): User {
    return this.users[index];
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  removeUser(username: string): void {
    this.users = this.users.filter((user) => user.username !== username);
  }

  getUserIndex(username: string): number {
    return this.users.findIndex((user) => user.username === username);
  }

  setFirstUserCounter(): void {
    this.users[0].localCounter = this.settings.startAmount || 20;
  }

  setIsPlaying(option: boolean): void {
    this.isPlaying = option;
  }

  getCounter(): number {
    return this.counter;
  }

  updateCounter(): number {
    this.counter = this.counter + 1;
    return this.counter;
  }

  updateCoinsTaken(from, to): void {
    const userToTakeFrom = this.getUser(from);
    const userToGiveTo = this.getUser(to);
    const batchSize = this.settings.getBatchSize();

    userToTakeFrom.removeFlipped(batchSize);
    userToGiveTo.addToLocalCounter(batchSize);
  }

  updateGamesPlayed(): void {
    const game = {
      timeAllCompleted: this.time.currentTime,
      timeBatchCompleted: this.time.timestampBatch,
    };

    if (this.gamesPlayed) {
      this.gamesPlayed = [...this.gamesPlayed, game];
    } else {
      this.gamesPlayed = [game];
    }

    this.setIsPlaying(false);
    this.resetTimeInRoom();
    this.resetAllCounters();
  }

  resetTimeInRoom(): void {
    this.time = new Time(0, 0, 0, null, this.id);
  }

  resetAllCounters(): void {
    this.users.forEach((user) => user.resetCounters());
  }
}

export default Room;
