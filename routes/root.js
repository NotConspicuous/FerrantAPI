'use strict'

const fs = require('fs')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    // src/index.html
    // get cookie "token"
    const token = request.cookies.token
    if (!token) {
      const stream = fs.createReadStream('./src/index.html')
      reply.type('text/html').send(stream)
      return
    }
    // get url param logged_in
    if (!request.query.logged_in) reply.redirect('/?logged_in=true')
    const stream = fs.createReadStream('./src/dashboard.html')
    reply.type('text/html').send(stream)
  })
}
