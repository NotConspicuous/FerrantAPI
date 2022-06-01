'use strict'

const path = require('path')

module.exports = async function (fastify, opts) {
//   fastify static folder
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../assets'),
        prefix: '/public/'
    })
}
