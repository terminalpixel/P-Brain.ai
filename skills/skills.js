const path = require('path')
const fs = require('fs')
const express = require('express')
const co = require('co')

const getDirectories = srcpath =>
    fs.readdirSync(srcpath).filter(file =>
        fs.statSync(path.join(srcpath, file)).isDirectory())

let skills = []

function addSkill(skill) {
    skills.push(skill);
}

function * loadSkills() {
    const skills_dir = __dirname.replace('/api', '')
    const dirs = getDirectories(skills_dir)

    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i]
        let skill = require(`./${dir}`)
        if (typeof skill === 'function' && /^\s*class\s+/.test(skill.toString())) {
            new skill();
        }
    }
}

function * registerClient(socket, user) {
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i]
        if (typeof (skill.registerClient) === 'function') {
            yield skill.registerClient(socket, user)
        }
    }
}

function getSkills() {
    return skills
}

module.exports = {
    addSkill,
    loadSkills,
    getSkills,
    registerClient
}
