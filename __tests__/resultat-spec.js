import supertest from "supertest"
import mongoose from "mongoose"
import app from "../app.js"
import { cleanUpDatabase } from './utils.js';

import Utilisateur from '../models/utilisateur.js';
import Poste from '../models/poste.js';
import Parcours from '../models/parcours.js';
import Resultat from '../models/resultat.js';

beforeEach(cleanUpDatabase);

describe('POST /api/resultats', function () {
    it('should create a resultat', async function () {
        // Create a user in the database before test in this block.
        const user = await Utilisateur.create({ nom: 'Jane Doe', mail: 'test@test.com', mdp: 'mdp12' });

        // Make a GET request on /api/utilisateurs.
        const resUser = await supertest(app).get('/api/utilisateurs');

        // Check that the status and headers of the response are correct.
        expect(resUser.status).toBe(200);
        expect(resUser.get('Content-Type')).toContain('application/json');

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

        const resParcours = await supertest(app).get('/api/parcours')
        expect(resParcours.status).toBe(200);
        expect(resParcours.body[0].nom).toBe('parcours1');

        const resultat = await supertest(app)
            .post('/api/resultats')
            .send({
                trailID: resParcours.body[0].id,
                userID: resUser.body[0].id,
                temps: 120
            })
        expect(resultat.status).toBe(201);
        expect(resultat.body.temps).toBe(120);
        expect(resultat.headers.location).toMatch(/\/api\/resultats\/.+/);
    });
});

describe('GET /api/resultats', function () {
    it('should retrieve the list of resultats', async function () {
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
        const resParcours = await supertest(app).get('/api/parcours');

        // Create a resultat in the database before test in this block.
        const resultat = await Resultat.create({
            trailID: resParcours.body[0].id,
            userID: resUser.body[0].id,
            temps: 120
        });

        const response = await supertest(app)
            .get('/api/resultats')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].temps).toBe(120);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);