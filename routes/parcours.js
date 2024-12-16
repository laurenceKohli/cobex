import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Parcours from "../models/parcours.js";
import Utilisateur from "../models/utilisateur.js";
import { Authorise } from "./auth.js";
import parcours from "../models/parcours.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  const query = Parcours.find()
  if (include?.includes("user")) {
    query.populate("createBy");
  }
  query.exec()
  .then(parcours => {
    console.log(`Found ${parcours.length} parcours`);
    res.send(parcours.map(chemin => {
      let nbrPosts = chemin.postesInclus.length;
      if (include?.includes("user")){
        return {
          id: chemin._id,
          nom: chemin.nom,
          difficulte: chemin.difficulte,
          descr: chemin.descr,
          nbr_posts: nbrPosts,
          nomCreateur: chemin.createBy.nom,
        };
      }
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

router.get("/:id", utils.VerifyID, function (req, res, next) {
  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  const query = Parcours.findById(req.params.id)
  query.exec()
  .then(parcours => {
    if (parcours === null) {
      return res.status(404).send("Parcours not found");
    }
    if (include?.includes("postes")) {
      res.status(200).send(
        {
          id: parcours._id,
          nom: parcours.nom,
          postesInclus: parcours.postesInclus,
        }
      )
    }
    res.status(200).send(
      {
        id: parcours._id,
        nom: parcours.nom,
      }
    )
  })
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

router.put("/:id", utils.VerifyID, utils.requireJson, Authorise(true), function (req, res, next) { 
  Parcours.findById(req.params.id).exec()
  .then(chemin => {
    if (req.currentUserRole !== "superAdmin" && chemin.createBy !== req.currentUser) {
      return res.status(403).send("Forbidden");
    } else {
      chemin.nom = req.body.nom;
      chemin.difficulte = req.body.difficulte;
      chemin.descr = req.body.descr;
      chemin.postesInclus = req.body.postesInclus;
      return chemin.save()
      .then(updatedChemin => {
        res.status(200).send(updatedChemin);
      })
    }
  })
  .catch(next);
});

router.patch("/:id", utils.requireJson, Authorise(true), function (req, res, next) {
  Parcours.findById(req.params.id).exec()
  .then(chemin => {
    if (req.currentUserRole !== "superAdmin" && chemin.createBy !== req.currentUser) {
      return res.status(403).send("Forbidden");
    } else {
      if (req.body.nom) chemin.nom = req.body.nom;
      if (req.body.difficulte) chemin.difficulte = req.body.difficulte;
      if (req.body.descr) chemin.descr = req.body.descr;
      if (req.body.postesInclus) chemin.postesInclus = req.body.postesInclus;
      return chemin.save()
      .then(updatedChemin => {
        res.status(200).send(updatedChemin);
      })
    }
  })
  .catch(next);
});

router.delete("/:id", utils.VerifyID, Authorise(true), function (req, res, next) {
  Parcours.findById(req.params.id).exec()
  .then(chemin => {
    if (req.currentUserRole !== "superAdmin" && chemin.createBy !== req.currentUser) {
      return res.status(403).send("Forbidden");
    } else {
      return chemin.remove()
      .then(() => {
        res.status(204).send();
      })
    }
  })
  .catch(next);
})

export default router;