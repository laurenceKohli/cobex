import express, { query } from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import { Authorise } from "./auth.js";
import Poste from "../models/poste.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  const query = Poste.find()
  query.exec()
  .then(postes => {
    console.log(`Found ${postes.length} postes`);
    res.send(postes.map(poste => {
      return {
        id: poste._id,
        number: poste.number,
        geoloc: poste.geoloc
      };
    }));
  })
  .catch(next);
});

router.get("/:id", utils.VerifyID, function (req, res, next) {
  const query = Poste.findById(req.params.id)
  query.exec()
  .then(poste => {
    res.send(
      {
        id: poste._id,
        number: poste.number,
        geoloc: poste.geoloc,
        images: poste.images,
        estAccessible: poste.estAccessible,
        descr: poste.descr,
      }
    );
  })
  
  .catch(next);
});

router.patch("/", utils.requireJson, Authorise(true),  function (req, res, next) {
  if (req.currentUserRole !== "superAdmin") {
    return res.status(403).send("Forbidden");
  }

  if (!req.body.id) {
    return res.status(400).send("Missing id")
    .catch(next);
  }

  const query = Poste.findById(req.body.id)
  query.exec()
  .then(poste => {
    if (req.body.geoloc) {
      poste.geoloc = req.body.geoloc;
      poste.save()
      .then((savedPost) => {
        res.status(200).send(savedPost);
      })
      .catch(next);
    } else {
      return res.status(400).send("Missing geoloc");
    }
  })
});

export default router;