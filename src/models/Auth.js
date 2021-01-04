const knex = require('../config/database')
const bcrypt = require('bcrypt')
const Model = require('./Model')

class User extends Model{

    async comparePassword (plainTextPassword, dbPassword){
        const match = await bcrypt.compare(plainTextPassword, dbPassword);
        return match;
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