const express = require("express")
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session);

const endpoints = require("../endpoints/initializer")

const port = 3000
const server = express()

const store = new MongoDBStore({
    uri: 'mongodb+srv://encrxpt3d:M0cCXjY3yVzTJ6Sd@webapp.uqjueuv.mongodb.net/',
    collection: 'sessions'
});

store.on('error', (error) => {
    console.log('MongoDB session store error:', error);
});

server.use(session({
    secret: "default",
    resave: false,
    saveUninitialized: true,
    store: store
}))

endpoints.init(server)

server.listen(port, () => {
    console.log("[SERVER]: Port " + port)
})