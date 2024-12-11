import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';
import Parcours from '../models/parcours.js';
import Resultat from '../models/resultat.js';

export async function cleanUpDatabase() {
  await Promise.all([
    Utilisateur.deleteMany().exec(), 
    Poste.deleteMany().exec(), 
    Parcours.deleteMany().exec(), 
    Resultat.deleteMany().exec()
  ]);
}

export function createUser(){
    return Utilisateur.create({ nom: 'Jane Doe', mail: 'test@test.com', mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym' });
}

export function createPoste(){
  return Poste.create({
        geoloc: {
            "lat": 123467,
            "long": 128432
        },
        number: '31',
        images: ['image1']
    })
}

export function create2Postes(){
  return Promise.all([
    Poste.create({
        geoloc: {
            "lat": 123467,
            "long": 128432
        },
        number: '32',
        images: ['image2']
    }),
    Poste.create({
        geoloc: {
            "lat": 123467,
            "long": 128432
        },
        number: '33',
        images: ['image1', 'image2'],
        descr: "test"
    })
  ]);
}

export async function createParcours(userId){
  if(!userId){
    const user = await createUser();
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

export async function createResultat(){
  const user = await createUser();
  const parcours = await createParcours(user.id);
  return Resultat.create({
    trailID: parcours.id,
    userID: user.id,
    temps: 120
});
}