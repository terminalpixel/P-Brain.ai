const co = require('co')
const PBrainSkill = require('../skill');

const DEFAULT_NAME = 'Brain'

class NameSkill extends PBrainSkill {
    constructor() {
        super('name');
        this.registerClient = this.registerClient.bind(this);
    }

    hard_rule(query, breakdown) {
        return query.startsWith('your name') || query.startsWith('youre called')
    }


    * getName(user) {
        try {
            const nametmp = yield global.db.getValue('name', user, 'name')
            if (nametmp) {
                return nametmp
            }
        } catch (err) {
            // Ignore and use the default name.
        }
        return DEFAULT_NAME
    }

    * get(query, breakdown, user) {
        query = query.toLowerCase()
        let name = yield this.getName(user)
        if (query.includes('who') || query.includes('what')) {
            if (query.toLowerCase().includes('what') && query.toLowerCase().includes('are')) {
                return {text: `I'm called ${name}, your Brain.`, name}
            }
            return {text: `I'm called ${name}.`, name}
        }
        const words = query.split(' ')
        name = words[words.length - 1]
        name = name.charAt(0).toUpperCase() + name.slice(1)

        yield global.db.setValue('name', user, 'name', name)

        global.sendToUser(user, 'set_name', {name})

        return {text: `You can now call me ${name}.`, name}
    }

    * registerClient(socket, user) {
        socket.on('get_name', msg => {
            co(function * () {
                const name = yield this.getName(user)
                socket.emit('get_name', {name})
            }).catch(err => {
                console.log(err)
                throw err
            })
        })
        const name = yield this.getName(user)
        socket.emit('set_name', {name})
    }

    examples() {
        return ['Your name is Dave.'];
    }
}

module.exports = NameSkill;
