import supertest from "supertest"
import app from "../app.js"
import { cleanUpDatabase } from './utils.js';

// Clean up leftover data in the database before each test in this block.
// beforeEach(cleanUpDatabase);

describe('POST /api/postes', function() {
    // cleanUpDatabase();
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
        const response = await supertest(app)
            .get('/api/postes')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].number).toBe(31);
    });
});