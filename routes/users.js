import express from "express";
import * as utils from "./utils.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Got a response from the users route");
});

router.get("/:id", utils.VerfyID, function (req, res, next) {
    res.send(`Got a response from route /utilisateurs/${req.params.id}`);
});

export default router;


