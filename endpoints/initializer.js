const initializer = {}

const { log } = require("console");
const fs = require("fs")
const path = require("path")

initializer.init = (server) => {
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

    readDirectory()
        .then((files) => {
            server.use((req, res, next) => {
                const loggedIn = req.session.loggedIn
                const url = req.url

                switch (url) {
                    case "/":
                        if (!loggedIn)
                            return res.render("domain")
                        else
                            return res.redirect("/home")

                    case "/auth/login":
                        if (loggedIn)
                            return res.redirect("/home")
                        break

                    case "/auth/signup":
                        if (loggedIn)
                            return res.redirect("/home")
                        break

                    case "/home":
                        if (!loggedIn)
                            return res.redirect("/auth/login")
                        break

                    default:
                        if (loggedIn)
                            return res.redirect("/home")
                        else
                            return res.redirect("/auth/login")
                }

                next();
            });

            files.forEach((file) => {
                if (file !== "initializer.js") {
                    const module = require(path.join(__dirname, file));
                    module.init(server);
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = initializer;