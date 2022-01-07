class Settings {
  autoMoveCoins: boolean;
  amountOfBatches: number;
  batchSize: number;
  startAmount: number;

  constructor(autoMoveCoins, amountOfBatches, batchSize) {
    this.autoMoveCoins = autoMoveCoins;
    this.amountOfBatches = amountOfBatches;
    this.batchSize = batchSize;
    this.startAmount = batchSize * amountOfBatches;
  }

  // TODO
  update(autoMoveCoins, amountOfBatches, batchSize) {
    this.autoMoveCoins = autoMoveCoins;
    this.amountOfBatches = amountOfBatches;
    this.batchSize = batchSize;
    this.startAmount = batchSize * amountOfBatches;
  }

  get() {
    return this;
  }

  getBatchSize() {
    return this.batchSize;
  }
}

export default Settings;
