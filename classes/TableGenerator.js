const Table = require('cli-table');
const ProbabilityCalculator = require('./ProbabilityCalculator');

class TableGenerator {

    static generateTable(diceArrays) {
        const probabilities = ProbabilityCalculator.generateProbabilities(diceArrays);

        const table = new Table({
            head: ['User Dice v', ...diceArrays.map(dice => dice.join(','))],
        });

        diceArrays.forEach((userDice, i) => {
            const row = [
                userDice.join(','),
                ...probabilities[i].map(prob =>
                    prob === null ? '-' : prob.win.toFixed(4) // Formatear la probabilidad de ganar
                ),
            ];
            table.push(row);
        });

        console.log(table.toString());
        return table.toString();
    }
}


module.exports = TableGenerator;
