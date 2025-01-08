import mongoose from "mongoose";
import Utilisateur from "../models/utilisateur.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { secret } from "../config.js";

const verifyJwt = promisify(jwt.verify);

function Authorise(AuthenticationRequired = true) {
  return function AuthorisationMiddleware(req, res, next) {
    const authorization = req.get("Authorization");
    if (AuthenticationRequired && !authorization) {
      return res.status(401).send("Authorization header is missing")  
    }else if (!AuthenticationRequired && !authorization) {
      return next();
    }
    
    const match = authorization.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).send("Authorization header is not a Bearer token");
      
    const token = match[1];
    verifyJwt(token, secret).then(payload => {
      req.currentUserId = payload.sub;
      Utilisateur.findOne({ _id : req.currentUserId })
      .exec()
      .then(utilisateur => {
        if (!utilisateur) return res.status(401).send("Bearer token no longer corresponds to a user");
        req.currentUserRole = utilisateur.role;
        req.currentUser = utilisateur;
        console.log("User role : ", req.currentUser);
        return next();
      })
    })
  }
}

export { Authorise };