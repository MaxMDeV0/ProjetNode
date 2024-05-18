const fs = require('fs');
const path = require('path');


class User {

    constructor(user, id = User.incrementId()) {
        
        this.name  = user.name
        this.birth = user.birth
        this.id = id
    }


    static incrementId() {
        if (!this.latestId) this.latestId = 6
        else this.latestId++
        return this.latestId
    }

    static getUserFromID(id) {
        const user = this.getUser(id);
        console.log(id)
        return new User(user, id)
    }

    static getUser(id){
        const dataPath = path.join(__dirname, '..', 'Data', "users.json")
        const users = JSON.parse(fs.readFileSync(dataPath, {encoding: 'utf8'}))
        return users.find((object) => object.id == id)
    }

    getAllUser(){
        const dataPath = path.join(__dirname, '..', 'Data', "users.json")
        const users = JSON.parse(fs.readFileSync(dataPath, {encoding: 'utf8'}))
        return users
    }


    addUser(){
        let users = this.getAllUser();
        users.push(this)
        this.updateUsers(users)
    }

    deleteUser(){
        let users = this.getAllUser();
        users = users.filter((element)=>{
            if(element.id != this.id){
                return element
            }

        })

        this.updateUsers(users)

    }

    updateUsers(data){
        const dataPath = path.join(__dirname, '..', 'Data', "users.json")
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))

    }
}

module.exports = User;