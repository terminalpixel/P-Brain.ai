const PBrainSkill = require('../skill');

class CoinTossSkill extends PBrainSkill {
    constructor() {
        super('coin');
    }

    keywords() {
        return ['heads or tails', 'flip a coin', 'toss a coin']
    }

    examples() {
        return ['toss coin', 'flip coin', 'heads or tails?'];
    }

    * get(query) {
        const state = (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails'

        return {text: 'It\'s ' + state}
    }
}

module.exports = CoinTossSkill;
