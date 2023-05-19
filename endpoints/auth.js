const auth = {};

function signup(req, res) {

}

function login(req, res) {
    const username = req.body.username
    const password = req.body.password

    
}

auth.init = async (server) => {
    server.get("/auth/login", (req, res) => {
        res.render("auth/login");
    });

    server.get("/auth/signup", (req, res) => {
        res.render("auth/signup");
    });

    server.post("/auth/login", login)
    server.post("/auth/signup", signup)
};

module.exports = auth;