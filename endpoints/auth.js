const auth = {};
const Accounts = require("../modules/accounts")

async function signup(req, res) {
    try {
        const { username, password } = req.body;
        const sessionId = req.sessionID;
        const account = await Accounts.signup(username, password, sessionId);

        if (account && account != "in-use") {
            req.session.loggedIn = true;
            req.session.user = account;
            res.redirect("/home");
        } else if (account) {
            res.status(400).send(account);
        }
    } catch (error) {
        console.error("Error when signing up:", error);
        res.status(500).send("Error when signing up.");
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const account = await Accounts.login(username, password);

        if (account && account != "incorrect") {
            req.session.loggedIn = true;
            req.session.user = account
            res.redirect("/home");
        } else {
            res.status(401).send("Invalid credentials.");
        }
    } catch (error) {
        res.status(500).send("Error when logging in.");
    }
}

async function reset(req, res) {
    const type = req.query.type

    if (type == "database") {
        await Accounts.resetDatabase();
    } else if (type == "sessions") {
        await Accounts.resetSessions();
    } else {
        return res.status(400).send("Invalid reset type.")
    }

    req.sessionStore.clear((err) => {
        if (err) console.error("Error when clearing sessions:", err);
        return res.redirect("/home")
    });
}

auth.init = async (server) => {
    server.get("/auth/reset", reset)
    server.get("/auth/login", (_, res) => res.render("auth/login"));
    server.get("/auth/signup", (_, res) => res.render("auth/signup"));

    server.get("/auth/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error("Error when logging out:", err);
            return res.redirect("/auth/login")
        });
    })

    server.post("/auth/login", login)
    server.post("/auth/signup", signup)
};

module.exports = auth;