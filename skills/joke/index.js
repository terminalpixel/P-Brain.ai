const request = require('co-request')
const PBrainSkill = require('../skill');

class JokeSkill extends PBrainSkill {
    constructor() {
        super('joke');
    }

    keywords() {
        return ['tell me a joke', 'say something funny', 'make me laugh']
    }

    examples() {
        return ['Tell a joke.', 'Make me laugh.', 'Say something funny.'];
    }

    * get(query) {
        const joke_url = 'https://api.chucknorris.io/jokes/random'

        let data = yield request(joke_url)

        data = JSON.parse(data.body)

        return {text: data.value}
    }
}

module.exports = JokeSkill;
