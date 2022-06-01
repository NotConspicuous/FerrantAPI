'use strict'
const Data = require('../collection/data.base.js')
const { Octokit, App } = require("octokit");

// define new Octokit instance with process.env.PERSONAL_ACCESS_TOKEN

module.exports = async function (fastify, opts) {
    fastify.get('/@github/auth', async function (request, reply) {
        // check if user already has token
        if (request.cookies.token) {
            return reply.redirect('/')
        }

        reply.redirect(303,
            "https://github.com/login/oauth/authorize?client_id=" +
            process.env.GITHUB_CLIENT_ID +
            "&scope=user:email,user:read&redirect_uri=" +
            // process.env.GITHUB_REDIRECT_URI
            "https://ferrantapi-production.up.railway.app/@github/callback"
        )
    })

    fastify.get('/@github/callback', async function (request, reply) {
        // post request to https://github.com/login/oauth/access_token
        // with client_id, client_secret, code, and redirect_uri
        // and get access_token, scope, token_type, and expires_in
        // https://developer.github.com/v3/oauth/#redirect-users-to-request-github-access

        const true_token = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: request.query.code,
                redirect_uri: "http://localhost:3000/@github/callback"
            })
        })

        const token_json = await true_token.json()
        const token = token_json.access_token

        // save token to cookie

        reply.setCookie("token", token, {
            path: "/",
            // retain token on every page
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: true,
        })
        console.log(Date.now())
        console.log(token_json)
        // save time token expires


        // redirect to /
        reply.redirect(303, "/")
    })

    fastify.get('/@github/remove', async function (request, reply) {
        // delete token from cookie
        reply.setCookie("token", "", {
            path: "/",
            maxAge: 0
        })
        reply.redirect(303, "/")
    })

    fastify.get('/@github/user', async function (request, reply) {
        // get token from cookie
        let token = request.cookies.token
        
        const octokit = new Octokit({
            auth: token
        })

        //get user from token
        let user = await octokit.rest.users.getAuthenticated()

        user = user.data

        return JSON.stringify(user, null, 2)
    })

}
