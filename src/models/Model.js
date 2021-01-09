const knex = require('../config/database')
const pluralize = require('pluralize')

class Model {

    getModelName(){
        const name = this.constructor.name
        return this.normalizeClassName(name)
    }

    normalizeClassName(classname){
        const nameOfClass = classname.toLowerCase()
        const namePluralized = pluralize(nameOfClass)
        return namePluralized
    }

    async store(){
        const model = this.getModelName()
        const query = await knex(model).insert(this)
        return query[0]
    }

    async where(search, fields){
        const model = this.getModelName()
        const query = await knex(model).where({...search}).select(fields)
        if(query.length >= 1){
            return query[0]
        }else{
            throw new Error('Data not founded')
        }
    }

    async delete(id){
        const model = this.getModelName()
        const query = await knex(model).where({id: id}).del()
        if(query >= 1){
            return true
        }else{
            throw new Error('Id not found')
        }
    }
}

module.exports = Model