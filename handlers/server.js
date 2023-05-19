const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require("path");
const endpoints = require("../endpoints/initializer");
const server = express();

const port = process.env.PORT;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: "mongodb+srv://" + username + ":" + password + "@webapp.uqjueuv.mongodb.net/",
    collection: 'sessions'
});

store.on('error', (error) => {
    console.log('MongoDB session store error:', error);
});

server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "../views"));

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(session({
    secret: "default",
    resave: false,
    saveUninitialized: true,
    store: store
}));

endpoints.init(server);

server.listen(port, () => {
    console.log("[SERVER]: " + port);
});
