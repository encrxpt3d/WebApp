const initializer = {};
const fs = require("fs");
const path = require("path");

const readDirectory = () => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
};

const initializeModules = (files, server) => {
    return Promise.all(
        files
            .filter((file) => file !== "initializer.js")
            .map((file) => {
                const module = require(path.join(__dirname, file));
                return module.init(server);
            })
    );
};

const loadSession = (req, res, next) => {
    const loggedIn = req.session.loggedIn;
    const url = req.url;

    switch (url) {
        case "/":
            if (!loggedIn) return res.render("domain");
            else return res.redirect("/home");

        case "/auth/login":
            if (loggedIn) return res.redirect("/home");
            break;

        case "/auth/signup":
            if (loggedIn) return res.redirect("/home");
            break;

        case "/auth/logout":
            if (!loggedIn) return res.redirect("/auth/login")
            break

        case "/auth/reset?type=sessions":
            break

        case "/auth/reset?type=database":
            break
            
        case "/home":
            if (!loggedIn) return res.redirect("/auth/login");
            break;

        default:
            if (loggedIn) return res.redirect("/home");
            else return res.redirect("/auth/login");
    }

    next();
};

initializer.init = (server) => {
    return readDirectory()
        .then((files) => {
            server.use(loadSession)
            initializeModules(files, server)
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = initializer;