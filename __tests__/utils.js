import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';
import Parcours from '../models/parcours.js';
import Resultat from '../models/resultat.js';

export async function cleanUpDatabase() {
  await Promise.all([Utilisateur.deleteMany().exec(), Poste.deleteMany().exec(), Parcours.deleteMany().exec(), Resultat.deleteMany().exec()]);
}