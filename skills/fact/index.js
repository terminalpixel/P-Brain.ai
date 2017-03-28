const PBrainSkill = require('../skill');

const google = require('./google')
const duckduckgo = require('./duckduckgo')
const wolframalpha = require('./wolframalpha')

const not_found_responses = ['Hmmm I dont seem to know ', 'Sorry I couldn\'t understand ', 'My memory banks dont contain ']
const resp_functs = [google, duckduckgo, wolframalpha]

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), (ignore ? 'gi' : 'g')), (typeof (str2) === 'string') ? str2.replace(/\$/g, '$$$$') : str2)
}

class FactSkill extends PBrainSkill {
    constructor() {
        super('fact');
    }

    keywords() {
        return ['what qqqq', 'Who won qqqq', 'who is qqqq', 'where is qqqq', 'when did qqqq', 'what is qqqq', 'what is qqqq in qqqq', '√ ', '-', '+', '%'];
    }

    * get(query) {
        let fact = null

        for (let i = 0; i < resp_functs.length; i++) {
            const response = yield resp_functs[i].get(query)

            if (response && response !== '') {
                fact = response
                break
            }
        }

        if (!fact) {
            return {text: not_found_responses[Math.floor(Math.random() * not_found_responses.length)] + query}
        }

        return {text: fact}
    }

    examples() {
        return ['What color is the sky?', 'When is season 7 of Game Of Thrones?', 'Where is Paris?', 'What is 200 Pounds in Euro?'];
    }
}

module.exports = FactSkill;
