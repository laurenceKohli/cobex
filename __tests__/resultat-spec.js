import supertest from "supertest"
import mongoose from "mongoose"
import app from "../app.js"
import { cleanUpDatabase, createParcours, createParcoursWithResults, createUser, giveToken } from './utils.js';

beforeEach(cleanUpDatabase);

describe('POST /api/resultats', function () {
    it('should create a resultat', async function () {
        // Create a user in the database before test in this block.
        const user = await createUser();
        // Create a parcours in the database before test in this block.
        const resParcours = await createParcours(user.id);

        const token = giveToken(user.id);
        const resultat = await supertest(app)
            .post('/api/resultats')
            .set('Authorization', 'Bearer '+token)
            .send({
                trailID: resParcours.id,
                temps: 120
            })
        expect(resultat.status).toBe(201);
        expect(resultat.body.temps).toBe(120);

        // Check user logged
        const resultat2 = await supertest(app)
            .post('/api/resultats')
            .send({
                trailID: resParcours.id,
                temps: 120
            })
        expect(resultat2.status).toBe(401);
        expect(resultat2.text).toBe('Authorization header is missing');
    });
});

describe('GET /api/resultats', function () {
    it('should retrieve the list of resultats', async function () {
        // Create 6 resultats in the database before test in this block.
        const resultat = await createParcoursWithResults();

        const response = await supertest(app)
            .get('/api/resultats')
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(6);
        expect(response.body.data[0].temps).toBe(130);
        expect(!response.body.data[0].utilisateur);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);