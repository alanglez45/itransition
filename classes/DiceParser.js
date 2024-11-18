class DiceParser {
    static parse(args) {
        if (!args.length)
            throw new Error("No dice at all.");
        else
            if (args.length < 3) {
                throw new Error("At least 3 dice sets are required.");
            }

        return args.map(arg => {
            const valuesWithoutCommas = arg.split(',');
            const numbersParsed = valuesWithoutCommas.map(value => Number(value));
            if (numbersParsed.length !== 6 || numbersParsed.some(value => isNaN(value) || !Number.isInteger(value))) {
                throw new Error("Each dice set must contain 6 integers.");
            }
            return numbersParsed;
        });
    }
}

module.exports = DiceParser;
