import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Resultat from "../models/resultat.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let query = Resultat.find()
  query.exec()
  .then(resultats => {
    console.log(`Found ${resultats.length} postes`);
    res.send(resultats.map(resultat => {
      return {
        id: resultat._id,
        temps: resultat.temps,
      };
    }));
  })
  .catch(next);
});

router.post("/", utils.requireJson, function (req, res, next) {
  new Resultat(req.body)
  .save()
  .then(savedResultat => {
    res
      .status(201)
      .set('Location', `${config.baseUrl}/resultats/${savedResultat._id}`)
      .send(savedResultat);
  })
  .catch(next);
});

export default router;