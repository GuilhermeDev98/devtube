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
        const emaiil = await knex('users').where('email', data.email).select('email')
        const passwordd = await knex('users').where('email', data.email).select('password')
        const id = await knex('users').where('email', data.email).select('id')

        console.log(email, id)
    
        if (!emaiil || !bcrypt.compareSync(password, passwordd.passwordHash)) {
            throw 'Username or password is incorrect';
        }
    
        // authentication successful so generate jwt and refresh tokens
        const jwtToken = generateJwtToken(user);
        const refreshToken = generateAccessToken(user);
    
        // save refresh token
        await refreshToken.save();
    
        // return basic details and tokens
        return { 
            ...basicDetails(user),
            jwtToken,
            refreshToken: refreshToken.token
        };
    }

     

}
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' });
}

module.exports = User