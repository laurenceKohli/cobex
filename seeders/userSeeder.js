import Utilisateur from '../models/utilisateur.js';
import bcrypt from "bcrypt";
import * as config from '../config.js';

export async function seedUser() {

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
        }
    ];

    try {
        await Utilisateur.deleteMany(); // Empty the collection before seeding
        await Utilisateur.insertMany(users);
        console.log('Utilisateurs have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding utilisateurs:', error);
    }

    //retour les id des postes
    return Utilisateur.find();
}