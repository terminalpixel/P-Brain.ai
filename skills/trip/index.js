const PBrainSkill = require('../skill');

class TripSkill extends PBrainSkill {
    constructor() {
        super('trip');
    }

    keywords() {
        return ['trip to qqqq']
    }

    examples() {
        return ['Let\'s go on a trip.', 'Let\'s go to Mordor.']
    }

    isHobbit(query) {
        query.includes('mordor') || query.includes('tomorrow')
    }

    * get(query) {
        return {text: this.isHobbit(query) ?
        'One does not simply walk into Mordor.' :
        `Sorry, I dont understand ${query}`}
    }
}

module.exports = TripSkill;
