const PBrainSkill = require('../skill');

class HelloWorldSkill extends PBrainSkill {
    constructor() {
        super('hello');
    }

    * get(query) {
        return {text: 'Hello World'}
    }
}

module.exports = HelloWorldSkill;
