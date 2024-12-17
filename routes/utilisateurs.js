import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import * as config from '../config.js';
import * as utils from "./utils.js";
import { Authorise } from "./auth.js";
import Utilisateur from "../models/utilisateur.js";

const signJwt = promisify(jwt.sign);

const router = express.Router();

//Authorise(false) --> authentification optionnelle 
router.get("/", Authorise(false), function (req, res, next) {
  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  let query = Utilisateur.find()
  query.exec()
  .then(people => {
    res.send(people.map(person => {
      if (include?.includes("role") ) {
        if (req.currentUserRole === "superAdmin") {
          return {
            id: person._id,
            nom: person.nom,
            role: person.role
          };
        }else if (req.currentUserRole) {
          return res.status(403).send("Forbidden");
        }else {
          return res.status(401).send("Unauthorized");
        }
      }
      return {
        id: person._id,
        nom: person.nom
      };
      
    }));
  })
  .catch(next);
});

router.get("/:id", utils.VerifyID, function (req, res, next) {
  Utilisateur.findById(req.params.id).exec()
  .then(person => {
    if (person) {
      res.send({
        id: person._id,
        nom: person.nom
      })
    } else {
      res.status(404).send("Person not found");
    }
  })
  .catch(next);
});

router.post("/", utils.requireJson, function (req, res, next) {
  let hash = bcrypt.hash( (req.body.mdp), config.bcryptCostFactor)
  .then(hash => {
    req.body.mdp = hash;
    req.body.role = "utilisateur";
    const nouvelUtilisateur = new Utilisateur(req.body);
    return nouvelUtilisateur.save()
    .catch(err => {
      res.status(400).send({msg: err.message});
    });
  })
  .then(savedPerson => {
    const exp = Math.floor((Date.now() / 1000) + 60 * 60 * 24);
    savedPerson.mdp = undefined;
    signJwt({ sub: savedPerson._id, exp: exp }, config.secret).then(token => {
      res
        .set('Location', `${config.baseUrl}/utilisateurs/${savedPerson._id}`)
        .status(201)
        .send({savedPerson, token});
    });
  })
  .catch(next);
});

router.post("/login", function (req, res, next) {
  Utilisateur.findOne({ nom : req.body.nom })
    .exec()
    .then(utilisateur => {
      if (!utilisateur) return res.sendStatus(401); // Unauthorized
      return bcrypt.compare(req.body.mdp, utilisateur.mdp).then(valid => {
        if (!valid) return res.sendStatus(401); // Unauthorized
        // Login is valid...
        const exp = Math.floor((Date.now() / 1000) + 60 * 60 * 24);
        return signJwt({ sub: utilisateur._id, exp: exp }, config.secret).then(token => {
          res.send({ message: `Welcome ${utilisateur.nom}!`, token, utilisateur });
        });
      });
    })
    .catch(next);
});

export default router;