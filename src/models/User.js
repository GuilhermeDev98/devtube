const knex = require('../config/database')
const bcrypt = require('bcrypt')
const Mail = require('../services/Mail')
const Model = require('./Model')

class User extends Model{

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
            
            const user = await knex('users').insert(data)
            
            //const mail = new Mail("DevTube <transational@devtube.io>", "Welcome to DevTube", `Olá ${this.fullname}, Seja Bem Vindo ao <b>DevTube</b> !`);
            //await mail.send()

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

    async find(data){
        try {
            const selectUser = await knex('users').where('email', data.email).select('id', 'password', 'fullname', 'nickname')
            const user = selectUser[0]

            if(!user){
                return new Error('E-Mail Not Found !')
            }

            const comparePassword = await this.comparePassword(data.password, user.password)

            if(!comparePassword){
                return new Error('Incorrect Password !')
            }

            return user
            
        } catch (error) {
            return error;
        }
    }

    async authenticate({email, password}) {
        const dbemail = await knex('users').where("email", email)

        if (JSON.stringify(dbemail[0]) != undefined && JSON.stringify(dbemail[0]) != null){
            
            const dbpassword = dbemail[0].password
            const dbid = dbemail[0].id            
            
            const comparePassword = await this.comparePassword(password, dbpassword)
           
            if(comparePassword === true){               
                return dbemail[0].id
            }
        }        
    }
    async logged({id}){
        const dbemail = await knex('users').where("id", id) 
        return dbemail[0]
            
    }

}
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
}

module.exports = User