const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const server = jsonServer.create('./src/server/posts.json')
const router = jsonServer.router('./src/server/posts.json')
const userdb = JSON.parse(fs.readFileSync('./src/server/users.json', 'UTF-8'))
const postdb = JSON.parse(fs.readFileSync('./src/server/posts.json', 'UTF-8'))

server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

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
        const message = "Hiba: Nem megfelelő email vagy jelszó!"
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
        const message = "Hiba: Nem megfelelő header!"
        res.status(status).json({ status, message })
        return
    }
    const verification = JSON.stringify(verifyToken(req.headers.authorization.split(' ')[1]))
    if (verification.includes("JsonWebTokenError")) {
        const status = 401
        const message = "Hiba: Nem megfelelő access token!"
        res.status(status).json({ status, message })
        return
    }
    verifyToken(req.headers.authorization.split(' ')[1])
    next()
})

server.get('/auth/posts', (req, res) => {
    res.send(postdb.posts)
})

server.get('/auth/posts/:id', (req, res) => {
    const dba = postdb.posts.find(post => post.id == req.params.id);
    if (dba) {
        res.json(dba);
    } else {
        res.sendStatus(404)
    }
})

server.use('/admin/api', router)

server.listen(8000, () => {
    console.log("Szerver indítása")
})