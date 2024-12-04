import Resultat from '../models/resultat.js';

export async function seedResultats(user, parcours) {

    const resultats = [
       {
        trailID: parcours[0],
        userID: user,
        temps: 120},
        {
        trailID: parcours[1],
        userID: user,
        temps: 120},
    ];

    try {
        await Resultat.deleteMany(); // Empty the collection before seeding
        await Resultat.insertMany(resultats);
        console.log('Resultats have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding resultats:', error);
    } 

    return Resultat.find();
}