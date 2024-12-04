import Parcours from '../models/parcours.js';

export async function seedParcours(user, postes) {

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

    try {
        await Parcours.deleteMany(); // Empty the collection before seeding
        await Parcours.insertMany(trails);
        console.log('Parcours have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding parcours:', error);
    } 

    return Parcours.find();
}