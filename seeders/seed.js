import mongoose from "mongoose";
import { seedPostes } from "./postesSeeder.js";
import { seedUser } from "./userSeeder.js";
import { seedParcours } from "./parcoursSeeder.js";
import { seedResultats } from "./resultatsSeeder.js";

function seed() {
  mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/')
    .then(() => {
      return seedUser();
    })
    .then(users => {
      return seedPostes().then(postes => ({ users, postes }));
    })
    .then(({ users, postes }) => {
      const postesID = postes.map(poste => poste._id);
      return seedParcours(users[0]._id, postesID).then(parcours => ({ users, parcours }));
    })
    .then(({ users, parcours }) => {
      const parcoursID = parcours.map(parcour => parcour._id);
      return seedResultats(users[1]._id, parcoursID);
    })
    .then(() => {
      console.log('Seeding completed successfully.');
    })
    .catch(error => {
      console.error('Error seeding:', error);
    })
    .finally(() => {
      mongoose.disconnect();
    });
}

seed();