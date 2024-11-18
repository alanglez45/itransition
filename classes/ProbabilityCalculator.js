class ProbabilityCalculator {
    static generateProbabilities(diceArrays) {
        const probabilities = Array(diceArrays.length)
            .fill(null)
            .map(() => Array(diceArrays.length).fill(null));

        for (let i = 0; i < diceArrays.length; i++) {
            for (let j = 0; j < diceArrays.length; j++) {
                if (i === j) {
                    probabilities[i][j] = null; // Empate
                } else {
                    probabilities[i][j] = ProbabilityCalculator.calculateProbability(
                        diceArrays[i],
                        diceArrays[j]
                    );
                }
            }
        }
        return probabilities;
    }


    static calculateProbability(userDice, opponentDice) {
        let winCount = 0;
        let tieCount = 0;
        const totalCombinations = userDice.length * opponentDice.length;

        for (let user of userDice) {
            for (let opponent of opponentDice) {
                if (user > opponent) {
                    winCount++;
                } else if (user === opponent) {
                    tieCount++;
                }
            }
        }

        const winProbability = winCount / totalCombinations;
        const tieProbability = tieCount / totalCombinations;

        return { win: winProbability, tie: tieProbability };
    }
}
module.exports = ProbabilityCalculator;
