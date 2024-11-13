import express from "express";
import * as utils from "./utils.js";

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

export default router;