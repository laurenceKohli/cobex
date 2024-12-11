import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, create2Postes, createParcours, createUser } from './utils.js';

beforeEach(cleanUpDatabase);

describe('POST /api/parcours', function () {
    it('should create a parcours', async function () {
        // Create 2 posts in the database before test in this block.
        const [poste1, poste2] = await create2Postes();

        const resPostes = await supertest(app).get('/api/postes')
        // Check that the status and headers of the response are correct.
        expect(resPostes.status).toBe(200);
        expect(resPostes.get('Content-Type')).toContain('application/json');

        // Create a user in the database before test in this block.
        const user = await createUser();

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
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .get('/api/parcours')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nom).toBe('parcours1');
    });
});
//TODO tester aussi que si on a pas le ID c'est erreur 404 quand test ID

describe('DELETE /api/parcours/:id', function () {
    it('should delete the parcours', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .delete('/api/parcours'+ parcours.id)
        expect(response.status).toBe(200);
        //TODO si retourne qqch alors le controler

        expect(await Parcours.findById(parcours.id)).toBe(null);

        // const response2 = await supertest(app)
        //     .get('/api/parcours')
        // expect(response2.status).toBe(200);
        // expect(response2.body.length).toBe(0);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);