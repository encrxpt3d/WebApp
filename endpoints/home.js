const home = {};

home.init = async (server) => {
    server.get("/home", (req, res) => res.render("home", req.session.user));
};

module.exports = home;