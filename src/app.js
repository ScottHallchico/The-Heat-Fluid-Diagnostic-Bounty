const express = require("express");
const cors = require("cors");

const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
