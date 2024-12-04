import Utilisateur from '../models/utilisateur.js';

export async function seedUser() {

    const users = [
        {
            nom: 'Jane Doe',
            mail: 'jane.doe@example.com',
            mdp: 'password',
            role: 'admin'
        },
        {
            nom: 'John Doe',
            mail: 'john@example.com',
            mdp: 'password',
        }
    ];

    try {
        await Utilisateur.deleteMany(); // Empty the collection before seeding
        await Utilisateur.insertMany(users);
        console.log('Utilisateur have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding utilisateur:', error);
    }

    //retour les id des postes
    return Utilisateur.find();
}