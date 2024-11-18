const readline = require('readline');

class InputManager {
    constructor() {
        if (!InputManager.instance) {
            this.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            InputManager.instance = this;
        }
        return InputManager.instance;
    }


    question(query) {
        return new Promise((resolve) => {
            this.rl.question(query, (answer) => {
                resolve(answer);
            });
        });
    }

    close() {
        this.rl.close();
    }
}

module.exports = new InputManager();
