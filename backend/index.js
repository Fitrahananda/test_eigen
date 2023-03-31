const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./apiDoc.json");
const { ErrorHandler } = require("./middlewares/ErrorHandler");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(router);
app.use(ErrorHandler);

module.exports = { app };
