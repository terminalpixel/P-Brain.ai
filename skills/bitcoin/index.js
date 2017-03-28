const request = require('co-request')

const PBrainSkill = require('../skill');

class BitcoinSkill extends PBrainSkill {
    constructor() {
        super('bitcoin');
    }

    examples() {
        return ['Show me the current bitcoin value.', 'What\'s the bitcoin value?', 'Bitcoin value.']
    }

    * get(query) {
        const bitcoin_url = 'https://blockchain.info/ticker'

        let data = yield request(bitcoin_url)
        let key = 'USD'

        data = JSON.parse(data.body)
        query = query.toUpperCase()

        if (query.includes('EURO')) {
            key = 'EUR'
        } else if (query.includes('POUNDS')) {
            key = 'GBP'
        }

        return {text: 'The current Bitcoin price is ' + data[key].symbol + data[key].last}
    }
}

module.exports = BitcoinSkill;
