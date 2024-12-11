import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase } from './utils.js';

import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';
import Parcours from '../models/parcours.js';

beforeEach(cleanUpDatabase);

describe('POST /api/parcours', function () {
    it('should create a parcours', async function () {
        // Create 2 posts in the database before test in this block.
        const [poste1, poste2] = await Promise.all([
            Poste.create({
                geoloc: {
                    "lat": 123467,
                    "long": 128432
                },
                number: '32',
                images: ['image2']
            }),
            Poste.create({
                geoloc: {
                    "lat": 123467,
                    "long": 128432
                },
                number: '33',
                images: ['image1', 'image2'],
                descr: "test"
            })
        ]);

        const resPostes = await supertest(app).get('/api/postes')
        // Check that the status and headers of the response are correct.
        expect(resPostes.status).toBe(200);
        expect(resPostes.get('Content-Type')).toContain('application/json');

        // Create a user in the database before test in this block.
        const user = await Utilisateur.create({ nom: 'Jane Doe', mail: 'test@test.com', mdp: 'mdp12' });

        const resUser = await supertest(app).get('/api/utilisateurs')
        // Check that the status and headers of the response are correct.
        expect(resUser.status).toBe(200);
        expect(resUser.get('Content-Type')).toContain('application/json');

        const parcours = await supertest(app)
            .post('/api/parcours')
            .send({
                nom: 'parcours1',
                difficulte: 'facile',
                createBy: user.id,
                postesInclus: [poste1.id, poste2.id]
            })
        expect(parcours.status).toBe(201);
        expect(parcours.body.nom).toBe('parcours1');
        expect(parcours.headers.location).toMatch(/\/api\/parcours\/.+/);
    });
});

describe('GET /api/parcours', function () {
    it('should retrieve the list of parcours', async function () {
         // Create a user in the database before test in this block.
         const user = await Utilisateur.create({ nom: 'Jane Doe', mail: 'test@test.com', mdp: 'mdp12' });
         const resUser = await supertest(app).get('/api/utilisateurs');
 
         // Create 2 posts in the database before test in this block.
         const [poste1, poste2] = await Promise.all([
             Poste.create({
                 geoloc: {
                     "lat": 123467,
                     "long": 128432
                 },
                 number: '32',
                 images: ['image2']
             }),
             Poste.create({
                 geoloc: {
                     "lat": 123467,
                     "long": 128432
                 },
                 number: '33',
                 images: ['image1', 'image2'],
                 descr: "test"
             })
         ]);
 
         // Create a parcours in the database before test in this block.
         const parcours = await Parcours.create({
             nom: 'parcours1',
             difficulte: 'facile',
             createBy: user.id,
             postesInclus: [poste1.id, poste2.id]
         });

        const response = await supertest(app)
            .get('/api/parcours')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nom).toBe('parcours1');
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);