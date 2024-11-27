import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Poste from "../models/poste.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let query = Poste.find()
  query.exec()
  .then(postes => {
    console.log(`Found ${postes.length} postes`);
    res.send(postes.map(poste => {
      return {
        id: poste._id,
        number: poste.number,
      };
    }));
  })
  .catch(next);
});

router.post("/", utils.requireJson, function (req, res, next) {
  new Poste(req.body)
  .save()
  .then(savedPoste => {
    res
      .status(201)
      .set('Location', `${config.baseUrl}/postes/${savedPoste._id}`)
      .send(savedPoste);
  })
  .catch(next);
});

export default router;