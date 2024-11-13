import supertest from "supertest"
import app from "../app.js"
import { cleanUpDatabase } from './utils.js';

// Clean up leftover data in the database before each test in this block.
beforeEach(cleanUpDatabase);

describe('POST /utilisateurs', function() {
    it('should create a user', async function() {
        const response = await supertest(app)
            .post('/utilisateurs')
            .send({
                nom: 'John Doe',
                mail: 'test@email.com',
                mdp: 'password'
            })
        expect(response.status).toBe(201);
        expect(response.body.nom).toBe('John Doe');
    });
});

describe('GET /utilisateurs', function() {
    test.todo('should retrieve the list of users');
});