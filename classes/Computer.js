class Computer {
    #secretKey = null;
    #randomValue = null;
    diceChoice = null;
    hmac = null;
    sumResult = 0;
    throw = 0;

    constructor() {
    }

    set randomValue(value) {
        this.#randomValue = value;
    }

    set secretKey(value) {
        this.#secretKey = value;
    }

    get randomValue() {
        return this.#randomValue;
    }
    get secretKey() {
        return this.#secretKey;
    }

    chooseDie(diceOptions) {
        const randomDiceIndex = Math.floor(Math.random() * diceOptions.length);
        this.diceChoice = diceOptions[randomDiceIndex];
    }

}

module.exports = Computer;