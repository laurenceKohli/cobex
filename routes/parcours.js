import express from "express";
import mongoose from "mongoose";

import * as config from '../config.js';
import * as utils from "./utils.js";
import Parcours from "../models/parcours.js";
import Resultat from "../models/resultat.js";
import Utilisateur from "../models/utilisateur.js";
import { Authorise } from "./auth.js";

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
        if (include?.includes("user")) {
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
  //permet d'ajouter les resultats des utilisateurs sur le parcours (avec leurs noms)
  const pipeline = [];
  pipeline.push(
    {
      $match: {
        "trailID": new mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: 'utilisateurs',
        localField: 'userID',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $skip: req.query.page ? (req.query.page - 1) * 4 : 0
    },
    {
      $limit: 4
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        temps: 1,
        user: '$user.nom'
      }
    },
    {
      $sort: {
        temps: 1 // Trier par temps du plus petit au plus grand
      }
    }
  );

  let include = false;
  if (req.query) {
    include = req.query.include;
  }
  const query = Parcours.findById(req.params.id)
  query.populate("postesInclus");
  query.exec()
    .then(parcours => {
      if (parcours === null) {
        return res.status(404).send("Parcours not found");
      }

      if (include?.includes("postes")) {
        Resultat.aggregate(pipeline)
          .exec()
          .then(resultats => {
            res.status(200).send(
              {
                id: parcours._id,
                nom: parcours.nom,
                difficulte: parcours.difficulte,
                descr: parcours.descr,
                postesInclus: parcours.postesInclus,
                resultatsAct: resultats
              }
            )
          })
          .catch(next);
      } else {
      res.status(200).send(
        {
          id: parcours._id,
          nom: parcours.nom,
        }
      )}
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
      if (req.currentUserRole !== "superAdmin" && JSON.stringify(chemin.createBy) != JSON.stringify(req.currentUser._id)) {
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

router.patch("/:id", utils.VerifyID, utils.requireJson, Authorise(true), function (req, res, next) {
  Parcours.findById(req.params.id).exec()
    .then(chemin => {
      if (req.currentUserRole !== "superAdmin" && JSON.stringify(chemin.createBy) != JSON.stringify(req.currentUser._id)) {
        return res.status(403).send("Forbidden" + chemin.createBy + req.currentUser);
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
      if (req.currentUserRole !== "superAdmin" && JSON.stringify(chemin.createBy) != JSON.stringify(req.currentUser._id)) {
        return res.status(403).send("Forbidden");
      }
      //else
      Parcours.findByIdAndDelete(req.params.id).exec()
        .then((parcours) => {
          if (parcours) {
            return res.status(204).send();
          }
          return res.status(404).send("Parcours not found");
        })

    })
    .catch(next);
})

export default router;