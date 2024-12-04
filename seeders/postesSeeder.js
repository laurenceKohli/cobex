import Poste from '../models/poste.js';

export async function seedPostes() {

    const postes = [
        {
            geoloc: { lat: 2539171.85, long: 1181359.59 },
            number: 30,
            images: ['image1.jpg', 'image2.jpg'],
            descr: 'Poste 1 (au coin de la Banque)'
        },
        {
            geoloc: { lat: 2539373.70, long: 1181492.65 },
            number: 31,
            images: ['image3.jpg', 'image4.jpg'],
            descr: 'Poste 2 (sur le pont)'
        },
        {
            geoloc: { lat: 2539490.81, long: 1181426.72 },
            number: 32,
            images: ['image5.jpg', 'image6.jpg'],
            descr: 'Poste 3 (devant la porte)'
        }
    ];

    try {
        await Poste.deleteMany(); // Empty the collection before seeding
        await Poste.insertMany(postes);
        console.log('Postes have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding postes:', error);
    } 

    //retour les id des postes
    return Poste.find();
}