import Utilisateur from '../models/utilisateur.js';

export function seedUser() {
    const users = [
        {
            nom: 'Jane Doe',
            mail: 'jane.doe@example.com',
            mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym',
            role: 'admin'
        },
        {
            nom: 'John Doe',
            mail: 'john@example.com',
            mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym',
        },
        {
            nom: 'Tommy Doe',
            mail: 'tommy@example.com',
            mdp: '$2b$10$IAIz7tCzFRbES144XpFnWuloD5i/1crzvntErVJZ1AbGRPQNyqQym',
        }
    ];

    return Utilisateur.deleteMany() // Empty the collection before seeding
        .then(() => {
            return Utilisateur.insertMany(users);
        })
        .then((utilisateurs) => {
            console.log('Utilisateurs have been seeded successfully.');
            return utilisateurs;
        })
        .catch(error => {
            console.error('Error seeding utilisateurs:', error);
        });
}