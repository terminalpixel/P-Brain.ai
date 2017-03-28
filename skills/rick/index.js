const PBrainSkill = require('../skill');

class RickRollSkill extends PBrainSkill {
    constructor() {
        super('rick');
    }

    keywords() {
        return ['Rick Astley']
    }

    examples() {
        return ['Who\'s Rick Astley?', 'Never gonna give you up.']
    }

    * get(query) {
        return {
            id: 'dQw4w9WgXcQ',
            text: 'I just wanna tell you how I\'m feeling.'
        }
    }
}

module.exports = RickRollSkill;
