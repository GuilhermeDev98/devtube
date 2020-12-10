const knex = require('../config/database')
const bcrypt = require('bcrypt')


class User{
    constructor({email, password, fullname, birth, nickname} = data){
        this.email = email
        this.password = password
        this.fullname = fullname
        this.birth = birth
        this.nickname = nickname
    }

    async store(){

        try {
            const password = await this.encriptPassword(this.password)
            const data = {
                email: this.email,
                password,
                fullname: this.fullname,
                birth: this.birth,
                nickname: this.nickname,
            }
            console.log(data)

            const user = await knex('users').insert(this)
        } catch (error) {
            return error
        }

    }

    async comparePassword (plainTextPassword, dbPassword){
        const match = await bcrypt.compare(plainTextPassword, dbPassword);
        return match;
    }

    async encriptPassword (password){
        const hash = bcrypt.hashSync(password, 10);
        return hash;
    }

    async find(email, password){
        try {
            const user = knex('users').where({email})

            if(!user){
                return new Error('E-Mail Not Found !')
            }

            const comparePassword = this.comparePassword(password, user.password)

            if(!comparePassword){
                return new Error('Incorrect Password !')
            }

            return true;

            
        } catch (error) {
            return error;
        }
    }

}

module.exports = User