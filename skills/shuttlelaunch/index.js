const request = require('co-request')
const PBrainSkill = require('../skill');

class ShuttleLaunchSkill extends PBrainSkill {
    constructor() {
        super('shuttleLaunch');
    }

    keywords() {
        return ['space', 'shuttle', 'launch']
    }

    examples() {
        return ['When next launch?', 'When\'s next shuttle launch?']
    }

    * get(query) {
        let shuttle_url = 'https://launchlibrary.net/1.2/launch',
            options = {
                url: shuttle_url,
                headers: {
                    'User-Agent': 'P-Brain.ai Shuttle Skill'
                }
            }
        let data = yield request(options)
        data = JSON.parse(data.body)
        const resp = data.launches[0]
        return {text: 'The next launch will be the ' + resp.name + ' on ' + resp.net.split(',')[0] + '.'}
    }
}

module.exports = ShuttleLaunchSkill;
