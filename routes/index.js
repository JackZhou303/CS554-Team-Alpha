const gameApi = require("./game");

const constructorMethod = app => {
  app.use("/api/game-control", gameApi);
  app.get('/', function (req, res, next) {
    res.redirect("/api/game-control/spotify-login");
})

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;