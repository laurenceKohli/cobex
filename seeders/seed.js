import mongoose from "mongoose";
import { seedPostes } from "./postesSeeder.js";
import { seedUser } from "./userSeeder.js";
import { seedParcours } from "./parcoursSeeder.js";
import { seedResultats } from "./resultatsSeeder.js";

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/');

  try { 
    const user = await seedUser();
    const userID = user.map(utilisateur => utilisateur._id);
    const postes = await seedPostes();
    const postesID = postes.map(poste => poste._id);
    const parcours = await seedParcours(userID[0], postesID);
    const parcoursID = parcours.map(parcour => parcour._id);
    await seedResultats(userID[1], parcoursID);

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding:', error);
  }
  finally {
    await mongoose.disconnect();
  }
}

seed();