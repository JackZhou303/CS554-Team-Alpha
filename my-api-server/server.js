const express = require('express');
const app = express();
const cors = require("cors");
const request = require('request');
const configRoutes = require("./routes");

require('dotenv').config();
app.use(cors());
app.use(express.json());

configRoutes(app);

app.listen(3000, ()=> {
    console.log("The Server is running on port 3000");
});