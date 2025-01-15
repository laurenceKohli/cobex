import Poste from '../models/poste.js';

export function seedPostes() {
    const postes = [
        {
            geoloc: { lat: 46.780534, long: 6.642302 },
            number: 30,
            images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_15.jpg'],
            descr: 'Poste 1 (au coin de la Banque)',
            code : '30bda'
        },
        {
            geoloc: { lat: 46.780906, long: 6.643686 },
            number: 31,
            images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_22.jpg',
                     'https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_04.jpg'],
            descr: 'Poste 2 (sur le pont)',
            code : '31ert'
        },
        {
            geoloc: { lat: 46.781278, long: 6.646287 },
            number: 32,
            images: ['https://commons.wikimedia.org/wiki/File:For%C3%AAt_de_Tusson,_11.jpg'],
            descr: 'Poste 3 (devant la porte)',
            code : '32qwe'
        }
    ];

    return Poste.deleteMany() // Empty the collection before seeding
        .then(() => {
            return Poste.insertMany(postes);
        })
        .then((postesCreated) => {
            console.log('Postes have been seeded successfully.');
            return postesCreated;
        })
        .catch(error => {
            console.error('Error seeding postes:', error);
        });
}