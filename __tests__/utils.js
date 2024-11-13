import Utilisateur from '../models/utilisateur.js';

export async function cleanUpDatabase() {
  await Promise.all([Utilisateur.deleteMany().exec()]);
}