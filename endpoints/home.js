const home = {};

home.init = async (server) => {
    server.get("/home", (req, res) => {
        res.render("home", { username: res.user.username || "N/A" });
    });
};

module.exports = home;
