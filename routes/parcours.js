import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Parcours from "../models/parcours.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let query = Parcours.find()
  query.exec()
  .then(parcours => {
    console.log(`Found ${parcours.length} parcours`);
    res.send(parcours.map(chemin => {
      return {
        id: chemin._id,
        nom: chemin.nom,
      };
    }));
  })
  .catch(next);
});

router.post("/", utils.requireJson, function (req, res, next) {
  new Parcours(req.body)
  .save()
  .then(savedChemin => {
    res
      .status(201)
      .set('Location', `${config.baseUrl}/parcours/${savedChemin._id}`)
      .send(savedChemin);
  })
  .catch(next);
});

export default router;