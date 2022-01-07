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
}

export default User;
