const yt = require('./youtube')
const PBrainSkill = require('../skill');

class SongSkill extends PBrainSkill {
    constructor() {
        super('time');
    }

    hardRule(query, breakdown) {
        return query.trim().toLowerCase().startsWith('play')
    }

    examples() {
        return ['Play Everybody Knows by Leonard Cohen'];
    }

    * get(query) {
        query = query.replace('play', '')
        let track = query.split('by')[0].trim()
        let artist = query.split('by')[1]

        if (query.includes('what is love')) {
            track = 'what is love'
            artist = 'Haddaway'
        }

        if (!artist || artist === '') {
            artist = ''
        } else {
            artist = artist.trim()
        }

        const data = yield yt.get(track, artist)
        if (data) {
            return {id: data.id, text: `Playing ${data.title}.`, url: `https://www.youtube.com/watch?v=${data.id}`}
        }
        return {text: 'Could not play song.'}
    }
}

module.exports = SongSkill;

