const knex = require('../config/database')
const bcrypt = require('bcrypt')
const Model = require('./Model')

class User extends Model{

    //Função do bcrypt para comparar senha criptograda
    async comparePassword (plainTextPassword, dbPassword){
        const match = await bcrypt.compare(plainTextPassword, dbPassword);
        return match;
    }

    //Autenticação por email e senha
    async authenticate({email, password}) {
        const dbemail = await knex('users').where("email", email)

        if (JSON.stringify(dbemail[0]) != undefined && JSON.stringify(dbemail[0]) != null){  //Verifica se email existe no banco de dados
            
            const dbpassword = dbemail[0].password
            const comparePassword = await this.comparePassword(password, dbpassword)        //Compara a senha enviada com o banco de dados
           
            if(comparePassword === true){           //Returna id caso email e senha estejam ok              
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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' });
}

module.exports = User