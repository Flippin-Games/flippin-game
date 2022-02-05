class User {
  username: string;
  localCounter: number;
  flipped: number;

  constructor(username) {
    this.username = username;
    this.localCounter = 0;
    this.flipped = 0;
  }

  getUsername(): string {
    return this.username;
  }

  getLocalCounter(): number {
    return this.localCounter;
  }

  getFlipped(): number {
    return this.flipped;
  }

  flip(): void {
    if (this.localCounter > 0) {
      this.localCounter = this.localCounter - 1;
      this.flipped = this.flipped + 1;
    }
  }

  removeFlipped(amount: number): void {
    if (this.flipped - amount >= 0) {
      this.flipped = this.flipped - amount;
    } else {
      this.flipped = 0;
    }
  }

  addToLocalCounter(amount: number): void {
    this.localCounter = this.localCounter + amount;
  }

  resetCounters() {
    this.flipped = 0;
    this.localCounter = 0;
  }
}

export default User;
