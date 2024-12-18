import Resultat from '../models/resultat.js';

export function seedResultats(users, parcours) {
    const resultats = [
        {
            trailID: parcours[0],
            userID: users[0]._id,
            temps: 120
        },
        {
            trailID: parcours[1],
            userID: users[1]._id,
            temps: 130
        },
        {
            trailID: parcours[0],
            userID: users[0]._id,
            temps: 200
        },
        {
            trailID: parcours[0],
            userID: users[1]._id,
            temps: 150
        },
        {
            trailID: parcours[0],
            userID: users[2]._id,
            temps: 120
        },
        {
            trailID: parcours[0],
            userID: users[1]._id,
            temps: 190
        },
        {
            trailID: parcours[0],
            userID: users[2]._id,
            temps: 180
        },
        {
            trailID: parcours[0],
            userID: users[1]._id,
            temps: 130
        },
        {
            trailID: parcours[0],
            userID: users[0]._id,
            temps: 210
        },
        {
            trailID: parcours[0],
            userID: users[1]._id,
            temps: 200
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