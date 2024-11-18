const crypto = require('crypto');

class FairRandomGenerator {
    constructor() {
        this.secretKey = crypto.randomBytes(32);
    }

    generateHMAC(value, secretKey) {
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(value.toString());
        return hmac.digest('hex');
    }


    generateRandomValue(range) {
        const randomValue = crypto.randomInt(0, range);
        const hmac = this.generateHMAC(randomValue, this.secretKey);
        return { randomValue, hmac };
    }

    revealKey() {
        return this.secretKey.toString('hex');
    }
}

module.exports = FairRandomGenerator;