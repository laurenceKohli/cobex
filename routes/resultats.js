import express from "express";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Resultat from "../models/resultat.js";
import { Authorise } from "./auth.js";

const router = express.Router();

router.get("/", Authorise(false), function (req, res, next) {
  let query = Resultat.find()
  if (req.query.utilisateurs) {
    query = Resultat.find({ userID: req.query.utilisateurs })
    if (req.query.parcours) {
      query = Resultat.find({ userID: req.query.utilisateurs, trailID: req.query.parcours })
    }
  }

  query.populate("trailID");

  query.exec().then(resultats => {
    res.send(resultats.map(resultat => {
      if (req.query.utilisateurs) {
        // console.log(resultat);
        return {
          id: resultat._id,
          temps: resultat.temps,
          parcours: {
            id: resultat.trailID._id,
            nom: resultat.trailID.nom,
          }
        };
      }
      // console.log(2);
      return {
        id: resultat._id,
        temps: resultat.temps,
      };
    }));
  })
    .catch(next);
});

router.post("/", utils.requireJson, Authorise(true), function (req, res, next) {
  req.body.userID = req.currentUser.id;
  let resultat = new Resultat(req.body)
  resultat.save()
    .then(savedResultat => {
      return res.status(201).send(savedResultat);
    })
    .catch(next);
});

export default router;