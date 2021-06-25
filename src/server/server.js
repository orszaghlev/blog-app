const fs = require('fs')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create()
const router = jsonServer.router('./posts.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(jsonServer.defaults());

const SECRET_KEY = "1234567890"
const expiresIn = "3h"

function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode != undefined ? decode : err)
}

function isAuthenticated({ email, password }) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

server.post('/auth/login', (req, res) => {
    const { email, password } = req.body
    if (isAuthenticated({ email, password }) === false) {
        const status = 401
        const message = "Nem megfelelő email vagy jelszó!"
        res.status(status).json({ status, message })
        return
    }
    const access_token = createToken({ email, password })
    res.status(200).json({ access_token })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined ||
        req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = "Nem megfelelő header!"
        res.status(status).json({ status, message })
        return
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1])
        next()
    } catch (err) {
        const status = 401
        const message = "Hiba: Nem megfelelő access token!"
        res.status(status).json({ status, message })
    }
})

server.use(router)

server.listen(4000, () => {
    console.log("Hitelesítési szerver indítása")
})