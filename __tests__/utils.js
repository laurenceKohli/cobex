import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';
import Parcours from '../models/parcours.js';
import Resultat from '../models/resultat.js';
import jwt from "jsonwebtoken";

import { promisify } from "util";
import * as config from '../config.js';
const signJwt = promisify(jwt.sign);


export async function cleanUpDatabase() {
  await Promise.all([
    Utilisateur.deleteMany().exec(), 
    Poste.deleteMany().exec(), 
    Parcours.deleteMany().exec(), 
    Resultat.deleteMany().exec()
  ]);
}

export function giveToken(userID){
  // return signJwt({ sub: userID, exp: '1h' }, config.secret)
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
    const payload = { sub: userID, exp: exp};

    return jwt.sign(payload, config.secret);
}

export function createUser(){
    return Utilisateur.create({ nom: 'Jane Doe', mail: 'test@test.com', mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym' });
}

export function createAdminUser(){
  return Utilisateur.create({ nom: 'John Doe', mail: 'test2@test.com', mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym', role: 'admin' });
}

export function createPoste(){
  return Poste.create({
        geoloc: {
            "lat": 46.780906,
            "long": 6.643686
        },
        number: 31,
        images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_11.jpg'],
        code: '31ert'
    })
}

export function create2Postes(){
  return Promise.all([
    Poste.create({
        geoloc: {
            "lat": 46.780906,
            "long": 6.643686
        },
        number: 32,
        images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_11.jpg'],
        code: '32qwe'
    }),
    Poste.create({
        geoloc: {
            "lat": 46.780906,
            "long": 6.643686
        },
        number: 33,
        images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_11.jpg'],
        descr: "test",
        code: '33qwe'
    })
  ]);
}

export async function createParcours(userId){
  if(!userId){
    const user = await createAdminUser();
    userId = user.id;
  }
  const [poste1, poste2] = await create2Postes();
  return Parcours.create({
    nom: 'parcours1',
    difficulte: 'facile',
    createBy: userId,
    postesInclus: [poste1.id, poste2.id]
});
}

export async function createParcoursWithResult(){
  const resultat = await createResultat();
  return Parcours.findById(resultat.trailID);
 }

export async function createResultat(){
  const user = await createUser();
  const parcours = await createParcours(user.id);
  return Resultat.create({
    trailID: parcours.id,
    userID: user.id,
    temps: 120
});
}