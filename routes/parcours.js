import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Parcours from "../models/parcours.js";
import { Authorise } from "./auth.js";
import parcours from "../models/parcours.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  let query = Parcours.find()
  query.exec()
  .then(parcours => {
    console.log(`Found ${parcours.length} parcours`);
    res.send(parcours.map(chemin => {
      let nbrPosts = chemin.postesInclus.length;
      return {
        id: chemin._id,
        nom: chemin.nom,
        difficulte: chemin.difficulte,
        descr: chemin.descr,
        nbr_posts: nbrPosts,
      };
    }));
  })
  .catch(next);
});

router.get("/:id", function (req, res, next) {
  let query = Parcours.find({ _id : (req.params.id) })
  query.exec()
  return {
    id: parcours._id,
    nom: parcours.nom,
  }
  .catch(next);
});

router.post("/", utils.requireJson, Authorise(true), function (req, res, next) {
  if (req.currentUserRole !== "superAdmin" && req.currentUserRole !== "admin") {
    return res.status(403).send("Forbidden");
  } else {
    req.body.createBy = req.currentUser;
    new Parcours(req.body)
    .save()
    .then(savedChemin => {
      res
        .status(201)
        .set('Location', `${config.baseUrl}/parcours/${savedChemin._id}`)
        .send(savedChemin);
    })
    .catch(next);
  }
});

export default router;