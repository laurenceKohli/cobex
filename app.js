import express from "express";
import createError from "http-errors";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/utilisateurs.js";
import postesRouter from "./routes/postes.js";
import parcoursRouter from "./routes/parcours.js";
import resultatRouter from "./routes/resultats.js";

import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/');

const app = express();

//api documentation
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';


// Parse the OpenAPI document.
const openApiDocument = JSON.parse(fs.readFileSync('./openapi.json'));
// Serve the Swagger UI documentation.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/api/utilisateurs", usersRouter);
app.use("/api/postes", postesRouter);
app.use("/api/parcours", parcoursRouter);
app.use("/api/resultats", resultatRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500);
  res.send(err.message);
});

export default app;
