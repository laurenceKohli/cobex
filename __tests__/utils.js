import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';

export async function cleanUpDatabase() {
  await Promise.all([Utilisateur.deleteMany().exec()]);
  await Promise.all([Poste.deleteMany().exec()]);
}