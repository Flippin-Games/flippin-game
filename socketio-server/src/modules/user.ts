class User {
  username: string;
  localCounter: number;
  flipped: number;

  constructor(username) {
    this.username = username;
    this.localCounter = 0;
    this.flipped = 0;
  }
}

export default User;
