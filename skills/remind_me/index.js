const PBrainSkill = require('../skill');

class ReminderSkill extends PBrainSkill {
    constructor() {
        super('remind');
    }

    hardRule(query, breakdown) {
        return query.trim().startsWith('remind me to')
    }

    examples() {
        return ['Remind me to take out the bins.'];
    }

    * get(query) {
        query = query.replace('remind me to', '').trim()
        return {text: `It's time to ${query}.`}
    }
}

module.exports = ReminderSkill;
