const knex = require('../config/database')
const bcrypt = require('bcrypt')
const Model = require('./Model')

class Auth extends Model{

    //Função do bcrypt para comparar senha criptografada
    async comparePassword (plainTextPassword, dbPassword){
        const match = await bcrypt.compare(plainTextPassword, dbPassword);
        return match;
    }

    //Autenticação por email e senha
    async authenticate({email, password}) {
        const dbemail = await knex('users').where("email", email.toLowerCase())

        if (JSON.stringify(dbemail[0]) != undefined && JSON.stringify(dbemail[0]) != null){  //Verifica se email existe no banco de dados
            
            const dbpassword = dbemail[0].password
            const comparePassword = await this.comparePassword(password, dbpassword)        //Compara a senha enviada com o banco de dados
           
            if(comparePassword === true){           //Retorna id caso email e senha estejam ok              
                return ({id: dbemail[0].id, updated_at: dbemail[0].updated_at})
            }
            else{
                return false;
            }
        }        
    }

    async refreshToken_Update(id, refreshToken){
        await knex('users').where("id", id.id).where("updated_at", id.updated_at).update("refresh_token", refreshToken)
    }

    async login({id, updated_at}){
        const dbemail = await knex('users').where("id", id).select('id', 'email', 'fullname', 'birth', 'nickname', 'type', 'active','channel_id', 'created_at', 'updated_at')

        if(JSON.stringify(updated_at) === JSON.stringify(dbemail[0].updated_at)){
            return dbemail[0]
        }else{
            return false;
        }
      
            
    }

    async refreshToken ({id, updated_at, token}){
        const dbToken = await knex('users').where("id", id).select("refresh_token" , "updated_at")

        if(token === dbToken[0].refresh_token && JSON.stringify(updated_at) === JSON.stringify(dbToken[0].updated_at)){
            return true
        }else{
            return false
        }
    }

    async logout({id, token}){
       

        const dbToken = await knex('users').where("id", id).select("refresh_token")
      
        if(token === dbToken[0].refresh_token){
            await knex('users').where("id", id).update("refresh_token", null)
            return true
        }else{
            return false
        }
      
    }

}

module.exports = Auth