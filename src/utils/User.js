const fs = require('fs');
const path = require('path');

//const cwd = process.cwd()

class User {

    constructor(user) {
        this.name  = user.name
        this.birth = user.birth
        this.id = User.incrementId()

        
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 6
        else this.latestId++
        return this.latestId
    }

    updateUser(){
        const dataPath = path.join(__dirname, '..', 'Data', "users.json")
        const users = JSON.parse(fs.readFileSync(dataPath, {encoding: 'utf8'}))
        users.push(this)
        fs.writeFileSync(dataPath, JSON.stringify(users, null, 2))
    }

    deleteUser(){
        console.log(this)
    }
}

module.exports = User;