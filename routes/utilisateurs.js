import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Utilisateur from "../models/utilisateur.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  let query = Utilisateur.find()
  query.exec()
  .then(people => {
    console.log(`Found ${people.length} people`);
    res.send(people.map(person => {
      return {
        id: person._id,
        nom: person.nom
      };
    }));
  })
  .catch(next);
});

router.get("/:id", utils.VerifyID, function (req, res, next) {
  let query = Utilisateur.find({ _id : (req.params.id) })
  query.exec()
  .then(person => {
    if (person) {
      res.send({
        id: person._id,
        nom: person.nom
      });
    }
  })
  .catch(next);
});

router.post("/", utils.requireJson, function (req, res, next) {
  new Utilisateur(req.body)
  .save()
  .then(savedPerson => {
    res
      .status(201)
      .set('Location', `${config.baseUrl}/utilisateurs/${savedPerson._id}`)
      .send(savedPerson);
  })
  .catch(next);
});

export default router;