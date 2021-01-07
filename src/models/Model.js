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
        console.log(search, fields)
        const model = this.getModelName()
        const query = await knex(model).where({...search}).select(fields)
        return query[0]
    }
}

module.exports = Model