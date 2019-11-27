const gameApi = require("./game");

const constructorMethod = app => {
  app.use("/", gameApi);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;