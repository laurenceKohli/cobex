import Resultat from '../models/resultat.js';

export function seedResultats(user, parcours) {
    const resultats = [
        {
            trailID: parcours[0],
            userID: user,
            temps: 120
        },
        {
            trailID: parcours[1],
            userID: user,
            temps: 120
        }
    ];

    return Resultat.deleteMany() // Empty the collection before seeding
        .then(() => {
            return Resultat.insertMany(resultats);
        })
        .then(() => {
            console.log('Resultats have been seeded successfully.');
            return resultats;
        })
        .catch(error => {
            console.error('Error seeding resultats:', error);
        });
}