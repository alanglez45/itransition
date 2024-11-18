const InputManager = require('./InputManager');
const Computer = require('./Computer');
const Player = require('./Player');
const FairRandomGenerator = require('./FairRandomGenerator');
const TableGenerator = require('./TableGenerator');


class Game {
    fairRandomGenRef = null;
    computerRef = null;
    playerRef = null;
    isUserTurn = false;
    isComputerThrow = false;

    constructor(diceList) {
        this.diceOptions = diceList;
    }

    start() {
        console.log("\nLet's determine who makes the first move.");
        this.playerRef = new Player();
        this.computerRef = new Computer();
        this.fairRandomGenRef = new FairRandomGenerator();

        this.computerRef.secretKey = this.fairRandomGenRef.revealKey();
        const { hmac, randomValue } = this.fairRandomGenRef.generateRandomValue(2);
        this.computerRef.hmac = hmac;
        this.computerRef.randomValue = randomValue;

        console.log(`I selected a random value in the range 0..1\n(HMAC=${this.computerRef.hmac.toUpperCase()}).`);
        this.askPlayerGuess();

    }

    async askPlayerGuess() {
        console.log("\nTry to guess my selection.");
        console.log("0 - 0");
        console.log("1 - 1");
        this.menuExitHelp();
        let selection = await InputManager.question("Your selection: ");

        selection = selection.trim().toUpperCase();
        const options = {
            'X': () => {
                console.log("Exiting the game...");
                InputManager.close();
            },
            '?': () => this.showHelp(),
            '0': () => this.evaluateGuess(selection),
            '1': () => this.evaluateGuess(selection),
        };
        const action = options[selection];
        if (action) {
            action();
        } else {
            console.log("\nInvalid option. Please try again.\n");
            this.askPlayerGuess();
        }
    }


    evaluateGuess(playerGuess) {
        console.log(`\nMy selection: ${this.computerRef.randomValue} (KEY=${this.computerRef.secretKey.toUpperCase()}).`);
        playerGuess = parseInt(playerGuess);
        if (playerGuess === this.computerRef.randomValue) {

            console.log("You guessed correctly! You make the first move.");
            this.isUserTurn = true;
        } else {
            console.log("I make the first move.");
            this.isUserTurn = false;
        }
        this.nextTurn();
    }

    nextTurn() {

        if (this.isUserTurn) {
            this.userTurn();
        } else {
            this.computerTurn();
        }
    }

    computerTurn() {
        this.computerRef.chooseDie(this.diceOptions);

        console.log(`\nI choose the dice: [${this.computerRef.diceChoice.join(', ')}]`);
        if (!this.playerRef.diceChoice)
            this.userTurn();
    }

    async userTurn() {
        console.log('\nChoose your dice:')
        this.diceOptions.forEach((element, index) => {
            console.log(`${index} - ${element}`);
        });
        this.menuExitHelp();
        const selection = await InputManager.question("Your selection: ");
        this.handleUserDiceSelection(selection);
    }

    async handleUserDiceSelection(selection) {
        selection = selection.trim().toUpperCase();
        if (selection === 'X') {
            console.log("Exiting the game...");
            InputManager.close();
        } else if (selection === '?') {
            this.showHelp();
        } else {
            const diceIndex = parseInt(selection);
            if (!isNaN(diceIndex) && diceIndex >= 0 && diceIndex < this.diceOptions.length) {
                this.playerRef.diceChoice = this.diceOptions[diceIndex];
                this.isUserTurn = false;
                console.log(`You choose the dice: [${this.playerRef.diceChoice.join(', ')}]`);

                this.nextTurn();
                this.computerThrow();
            } else {
                console.log("Invalid option. Please try again.");
                await this.userTurn();
            }
        }
    }


    async computerThrow() {
        console.log("It's time for my throw.");

        this.fairRandomGenRef = new FairRandomGenerator();

        this.computerRef.secretKey = this.fairRandomGenRef.revealKey();
        const { hmac, randomValue } = this.fairRandomGenRef.generateRandomValue(2);
        this.computerRef.hmac = hmac;
        this.computerRef.randomValue = randomValue;


        console.log(`I selected a random value in the range 0..5\n(HMAC=${this.computerRef.hmac.toUpperCase()}).`);

        this.isComputerThrow = true;
        await this.handlePlayerNumberSelection();
        console.log(`My throw is ${this.computerRef.throw}.`)
        this.userThrow();
    }
    async userThrow() {
        console.log("It's time for your throw.")
        this.fairRandomGenRef = new FairRandomGenerator();

        this.computerRef.secretKey = this.fairRandomGenRef.revealKey();
        const { hmac, randomValue } = this.fairRandomGenRef.generateRandomValue(2);
        this.computerRef.hmac = hmac;
        this.computerRef.randomValue = randomValue;
        console.log(`I selected a random value in the range 0..5 \n(HMAC = ${this.computerRef.hmac.toUpperCase()}).`);
        await this.handlePlayerNumberSelection();
        console.log(`Your throw is ${this.playerRef.throw}.`)
        if (this.computerRef.throw > this.playerRef.throw) {
            console.log(`I win (${this.playerRef.throw} > ${this.computerRef.throw})`)
        } else if (this.computerRef.throw < this.playerRef.throw) {
            console.log(`You win (${this.playerRef.throw} < ${this.computerRef.throw})`)
        } else {
            console.log(`It's a tie. (${this.playerRef.throw} = ${this.computerRef.throw})`)
        }

        console.log(this.diceOptions);
        TableGenerator.generateTable(this.diceOptions);
        InputManager.close();

    }
    async handlePlayerNumberSelection() {
        console.log('Add your number modulo 6.')
        for (let index = 0; index < 6; index++) {
            console.log(`${index} - ${index}`);
        }
        this.menuExitHelp();
        let selection = await InputManager.question("Your selection: ");
        if (selection === 'X') {
            console.log("Exiting the game...");
            InputManager.close();
        } else if (selection === '?') {
            this.showHelp();
        } else {
            selection = parseInt(selection);
            if (!isNaN(selection) && selection >= 0 && selection < 6) {
                console.log(`\nMy selection: ${this.computerRef.randomValue} (KEY=${this.computerRef.secretKey.toUpperCase()}).`);
                const index = this.calculateResult(selection, this.computerRef.randomValue);
                if (this.isComputerThrow) {
                    this.computerRef.throw = this.computerRef.diceChoice[index];
                    this.isComputerThrow = false;
                } else {
                    this.playerRef.throw = this.playerRef.diceChoice[index];
                }
            } else {
                console.log("Invalid option. Please try again.");
                await this.handlePlayerNumberSelection();
            }
        }
    }
    calculateResult(playerNumber, computerNumber) {
        const sum = playerNumber + computerNumber;
        const index = sum % 6;
        console.log(`The result is ${computerNumber} + ${playerNumber} = ${index} (mod 6).`);
        return index;
    }

    showHelp() {
        console.log("\nHelp:");
        console.log("The game works with 3 or more sets of dice.");
        console.log("Each dice set is represented by 6 comma-separated integers.");
        console.log("The goal is to guess the computer's selection, and then take turns throwing dice.");
        console.log("Each turn, you'll add your number modulo 6 to the computer's number to determine the winner.\n");
        this.askPlayerGuess();
    }
    menuExitHelp() {
        console.log("X - exit");
        console.log("? - help");
    }

}

module.exports = Game;
