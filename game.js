const DiceParser = require("./classes/DiceParser");
const Game = require("./classes/Game");


try {
    const args = process.argv.slice(2);
    const diceList = DiceParser.parse(args);
    const game = new Game(diceList);
    game.start();

} catch (error) {
    console.error(`\nError: ${error.message}`);
    console.log("– The game works with 3 or more sets of dice.");
    console.log("– Each dice set is represented by 6 comma-separated integers.");
    console.log("E.g., node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3.\n");
}



