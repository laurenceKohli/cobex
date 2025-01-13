import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Resultat from "../models/resultat.js";
import utilisateur from "../models/utilisateur.js";
import { Authorise } from "./auth.js";

const pageLimit = 4;

const router = express.Router();

router.get("/", function (req, res, next) {
  let total = null;
  let returnedResultats
  let query = Resultat.find()
  if (req.query.utilisateurs){
    query = Resultat.find({userID : req.query.utilisateurs})
    if (req.query.parcours){
      query = Resultat.find({userID : req.query.utilisateurs}, {trailID : req.query.parcours})
    }
  } else if (req.query.parcours){
    if (!req.query.page || req.query.page <= 1){
      query = Resultat.find({trailID : req.query.parcours}).limit(pageLimit)
    }else{
      query = Resultat.find({trailID : req.query.parcours}).skip(Math.floor(req.query.page - 1) * pageLimit).limit(pageLimit)
    }
  }

  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  
  if (include?.includes("utilisateurs")) {
    query.populate("userID");
  }
  if (include?.includes("parcours")) {
    query.populate("trailID");
  }
  query.exec().then(resultats => {
    const data = resultats.map(resultat => {        
      if (include?.includes("utilisateurs")) {
        if (include.includes("parcours")) {
          returnedResultats = {
            id: resultat._id,
            temps: resultat.temps,
            utilisateur: resultat.userID.nom,
            parcours: {
              id: resultat.trailID._id,
              nom : resultat.trailID.nom,
            }
          };
        } else {
          returnedResultats = {
            id: resultat._id,
            temps: resultat.temps,
            utilisateur: resultat.userID.nom,
          };
        }
      } else if (include?.includes("parcours")) {
        returnedResultats = {
          id: resultat._id,
          temps: resultat.temps,
          parcours: {
            id: resultat.trailID._id,
            nom : resultat.trailID.nom,
          }
        };
      } else {
        returnedResultats = {
          id: resultat._id,
          temps: resultat.temps,
        };
      }
      return returnedResultats;
    });

    if (req.query.parcours){
      Resultat.find({trailID : req.query.parcours}).countDocuments().then(count=> {
        total = count
      }).then(() => {
        res.send({
          nbPages: Math.ceil(total / pageLimit),
          data
        });
      })
    } else {
      res.send({ data });
    }

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

router.patch("/:userId", utils.VerifyID, Authorise(true), function (req, res, next) {
  if (req.currentUserRole !== "superAdmin" && req.currentUser.id !== req.params.userId) {
    return res.status(403).send("Forbidden");
  }
  //else
  const query = Resultat.find({ userID : req.params.userId })
  query.exec()
  .then(resultats => {
    return Promise.all(resultats.map(resultat => {
      resultat.userID = config.anonymousUserId;
      return resultat.save()
    }))
    .then((savedResultats) => {
      return res.status(204).send(savedResultats);
    })
  })
  .catch(next);
});

router.delete("/:id", utils.VerifyID, Authorise(true), function (req, res, next) {
  if (req.currentUserRole !== "superAdmin" && req.currentUserRole !== "admin") {
    return res.status(403).send("Forbidden");
  }
  //else
  Resultat.findByIdAndDelete(req.params.id).exec()
  .then(resultat => {
    if (resultat) {
      return res.status(204).send();
    }
    //else
    return res.status(404).send("Resultat not found");
  })
  .catch(next);
});

export default router;