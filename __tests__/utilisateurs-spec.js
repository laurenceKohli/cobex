import supertest from "supertest"
import mongoose from "mongoose"
import app from "../app.js"
import { cleanUpDatabase, createUser } from './utils.js';

beforeEach(cleanUpDatabase);

describe('POST /api/utilisateurs', function() {
    it('should create a user', async function() {
        const response = await supertest(app)
            .post('/api/utilisateurs')
            .send({
                nom: 'John Doe',
                mail: 'test@email.com',
                mdp: 'password'
            })
        expect(response.status).toBe(201);
        expect(response.body.nom).toBe('John Doe');
        expect(response.headers.location).toMatch(/\/api\/utilisateurs\/.+/);
    });
});

describe('GET /api/utilisateurs', function() {
    it('should retrieve the list of users', async function() {        
        // Create a user in the database before test in this block.
        const user = await createUser();

        const response = await supertest(app)
            .get('/api/utilisateurs')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nom).toBe('Jane Doe');
        expect(!response.body[0].mail);
        expect(!response.body[0].mdp);
    });
});

describe('GET /api/utilisateurs/:id', function() {
    it('should retrieve one user', async function() {        
        // Create a user in the database before test in this block.
        const user = await createUser();

        const response = await supertest(app)
            .get('/api/utilisateurs/' + user.id)
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('Jane Doe');
        expect(!response.body.mdp);
    });
});
//TODO tester aussi que si on a pas le ID c'est erreur 404 quand test ID

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);