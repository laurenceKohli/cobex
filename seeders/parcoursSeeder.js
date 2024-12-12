import Parcours from '../models/parcours.js';

export function seedParcours(user, postes) {
    const trails = [
        {
            nom: 'Parcours Facile',
            difficulte: 'facile',
            descr: 'Un parcours facile pour les débutants.',
            createBy: user,
            postesInclus: [postes[0], postes[1]]
        },
        {
            nom: 'Parcours Moyen',
            difficulte: 'moyen',
            descr: 'Un parcours de difficulté moyenne.',
            createBy: user,
            postesInclus: [postes[0], postes[1], postes[2]]
        }
    ];

    return Parcours.deleteMany() // Empty the collection before seeding
        .then(() => {
            return Parcours.insertMany(trails);
        })
        .then((parcours) => {
            console.log('Parcours have been seeded successfully.');
            return parcours;
        })
        .catch(error => {
            console.error('Error seeding parcours:', error);
        });
}