import mongoose from "mongoose";
import Utilisateur from "../models/utilisateur.js";

function Authorise(req, res, next) {

  const authorization = req.get("Authorization");
  if (!authorization) return res.status(401).send("Authorization header is missing");
  
  const match = authorization.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).send("Authorization header is not a Bearer token");
    
  const token = match[1];
  verifyJwt(token, secret).then(payload => {
    req.currentUserId = payload.sub;
    Utilisateur.findOne({ _id : req.currentUserId })
    .exec()
    .then(utilisateur => { 
      req.currentUserRole = utilisateur.role;
      return next();
    })
  })
  return next();
}

export { Authorise };