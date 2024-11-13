import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Utilisateur from "../models/utilisateur.js";

const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("Got a response from the users route");
});

router.get("/:id", utils.VerifyID, function (req, res, next) {
  res.send(`Got a response from route /utilisateurs/${req.params.id}`);
});

router.get("/api/utilisateurs", utils.GetQuerryParams, function (req, res, next) {
  //remplacer la constante par DB lorsqu'elle une fois DB prête
  const utilisateurs = [
    {
      "id": "1",
      "nom": "John Doe",
      "email": ""
    },
    {
      "id": "2",
      "nom": "Jane Doe",
      "email": ""
    },
    {
      "id": "3",
      "nom": "John Smith",
      "email": ""
    }
  ]
  let infoUtilisateurs = "";
  utilisateurs.forEach(utilisateur => {
    infoUtilisateurs += `{
      "nom": ${utilisateur.nom}, 
      "id": ${utilisateur.id}
    },
    `;
  });
  res.send(infoUtilisateurs);
});

router.post("/", utils.requireJson, function (req, res, next) {
  new Utilisateur(req.body)
  .save()
  .then(savedPerson => {
    debug(`Created person "${savedPerson.name}"`);

    res
      .status(201)
      .set('Location', `${config.baseUrl}/api/utilisateurs/${savedPerson._id}`)
      .send(savedPerson);
  })
  .catch(next);
});

export default router;