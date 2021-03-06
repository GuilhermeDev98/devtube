const knex = require('../config/database')
const bcrypt = require('bcrypt')
const Mail = require('../services/Mail')
const Model = require('./Model')

class User extends Model{
    constructor(){
        super()
    }

    async store(data){
        try {
            const email = data.email.toLowerCase()
            const password = await this.encriptPassword(data.password)
            const userFields = {...data, email, password}

            const emailWasRegistered = await knex('users').where('email', userFields.email)

            if(emailWasRegistered.length > 0){
                return false;
            }else{

                const userId = await knex('users').insert(userFields)
                const user = await knex('users').where('id', userId[0]).select(['id', 'email', 'fullname', 'birth', 'nickname', 'channel_id', 'created_at', 'updated_at'])
                
                //const mail = new Mail("DevTube <transational@devtube.io>", "Welcome to DevTube", `Olá ${this.fullname}, Seja Bem Vindo ao <b>DevTube</b> !`);
                //await mail.send()

                return user[0]
            }
        } catch (error) {
            return error
        }

    }

    async comparePassword (plainTextPassword, dbPassword){
        const match = await bcrypt.compare(plainTextPassword, dbPassword);
        return match;
    }

    async encriptPassword (password){
        const hash = await bcrypt.hashSync(password, 10);
        return hash;
    }

    async find(email, password){
        try {
            const user = knex('users').where({email})

            if(!user){
                throw new Error('E-Mail Not Found !')
            }

            const comparePassword = this.comparePassword(password, user.password)

            if(!comparePassword){
                throw new Error('Incorrect Password !')
            }

            return true;

            
        } catch (error) {
            throw new Error('Erro ao procurar e-mail');
        }
    }

}

module.exports = User