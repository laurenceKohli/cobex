import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, createPoste } from './utils.js';

beforeEach(cleanUpDatabase);

describe('POST /api/postes', function() {
    it('should create a poste', async function() {
        const response = await supertest(app)
            .post('/api/postes')
            .send({
                geoloc: {
                    "lat" : 123467, 
                    "long" : 128432
                },
                number: '31',
                images: ['image1', 'image2'],
            })
        expect(response.status).toBe(201);
        expect(response.body.number).toBe(31);
        expect(response.headers.location).toMatch(/\/api\/postes\/.+/);
    });
});

describe('GET /api/postes', function() {
    it('should retrieve the list of postes', async function() {
        // Create a poste in the database before test in this block.
        await createPoste();

        const response = await supertest(app)
            .get('/api/postes')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].number).toBe(31);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);