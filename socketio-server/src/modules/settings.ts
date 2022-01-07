class Settings {
  autoMoveCoins: boolean;
  amountOfBatches: number;
  batchSize: number;
  startAmount: number;

  constructor(autoMoveCoins, amountOfBatches, batchSize, startAmount) {
    this.autoMoveCoins = autoMoveCoins;
    this.amountOfBatches = amountOfBatches;
    this.batchSize = batchSize;
    this.startAmount = startAmount;
  }
}

export default Settings;
