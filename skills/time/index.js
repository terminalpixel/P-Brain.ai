const PBrainSkill = require('../skill');

class TimeSkill extends PBrainSkill {
    constructor() {
        super('time');
    }

    keywords() {
        return ['what time is it', 'what is the time']
    }

    examples() {
        return ['What time is it?', 'What\'s the current time?', 'Tell me the time.'];
    }

    * get(query) {
        const time = new Date().toLocaleTimeString('en-GB', {
            hour: 'numeric',
            minute: 'numeric'
        })

        return {text: 'It is ' + time}
    }
}

module.exports = TimeSkill;
