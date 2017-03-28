const PBrainSkill = require('../skill');

class MovieSkill extends PBrainSkill {
    constructor() {
        super('movie');
    }

    keywords() {
        return ['start movie qqqq']
    }

    examples() {
        return ['Start movie Avatar.'];
    }

    * get(query) {
        const term = query.split(' movie ')[1]

        const movie_api = 'https://yts.ag/api/v2/list_movies.json?query_term=<query>&sort_by=peers'

        let data = yield request(movie_api.replace('<query>', term))

        data = JSON.parse(data.body)

        return {url: data.data.movies[0].torrents[0].url}
    }
}

module.exports = MovieSkill;

