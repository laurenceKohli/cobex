import supertest from "supertest"
import mongoose from "mongoose"
import app from "../app.js"
import { cleanUpDatabase, createParcours, createResultat, createUser } from './utils.js';

beforeEach(cleanUpDatabase);

describe('POST /api/resultats', function () {
    it('should create a resultat', async function () {
        // Create a user in the database before test in this block.
        const user = await createUser();
        // Create a parcours in the database before test in this block.
        await createParcours(user.id);

        const resParcours = await supertest(app).get('/api/parcours')
        expect(resParcours.status).toBe(200);
        expect(resParcours.body[0].nom).toBe('parcours1');

        const resultat = await supertest(app)
            .post('/api/resultats')
            .send({
                trailID: resParcours.body[0].id,
                userID: user.id,
                temps: 120
            })
        expect(resultat.status).toBe(201);
        expect(resultat.body.temps).toBe(120);
        expect(resultat.headers.location).toMatch(/\/api\/resultats\/.+/);
    });
});

describe('GET /api/resultats', function () {
    it('should retrieve the list of resultats', async function () {
        // Create a resultat in the database before test in this block.
        const resultat = await createResultat();

        const response = await supertest(app)
            .get('/api/resultats')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].temps).toBe(120);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);