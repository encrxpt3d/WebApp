const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require("path");
const initializer = require("../endpoints/initializer");

const { connectDb } = require("../database/mongo")
const server = express();

const port = process.env.PORT;

const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: process.env.URI,
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

connectDb()
    .then(() => {
        initializer.init(server)
            .then(() => {
                server.listen(port, () => {
                    console.log("[SERVER]: Listening");
                });
            })
            .catch((error) => {
                console.error("Error initializing endpoints:", error);
            });
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });