const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')

const { logger } = require('./logger.js')

const mkdir = (dir) => fs.mkdirSync(dir, { recursive: true })

class database {
  dir = '.'

  constructor(dir) {
    this.dir = dir
    mkdir(this.dir)
  }

  in(dir) {
    logger.log('database.in', { dir })

    return new database(path.resolve(this.dir, dir))
  }

  newObject(id = randomUUID()) {
    logger.log('database.newObject', { id })

    return new database_object(this.dir, id.toString())
  }

  listJSON() {
    return fs.readdirSync(this.dir).map((id) => (new database_object(this.dir, id)).toJSON()).sort((a, b) => a._id - b._id)
  }
}

class database_object {
  dir = '.'
  id = null

  constructor(dir, id) {
    this.dir = dir
    this.id = id
    mkdir(this.getFullDir())
  }

  getFullDir() {
    logger.log('database_object.getFullDir', {})

    return path.resolve(this.dir, this.id)
  }

  getParamName(param = '') {
    logger.log('database_object.getParamName', { param })

    return path.resolve(this.getFullDir(), param)
  }

  write(key, value = null) {
    logger.log('database_object.write', { key, value })

    fs.writeFileSync(this.getParamName(key), value)
  }

  writeMany(many = {}) {
    logger.log('database_object.writeMany', { many })

    Object.keys(many).map((key) => {
      this.write(key, many[key])
    })
  }

  read(key) {
    return fs.readFileSync(this.getParamName(key)).toString()
  }

  listParams() {
    return fs.readdirSync(this.getFullDir())
  }

  toJSON() {
    return {
      _id: this.id,
      ...this.listParams().reduce((json, param) => ({
        ...json,
        [param]: this.read(param)
      }), {})
    }
  }
}

module.exports = { database, database_object }
