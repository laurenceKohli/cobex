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
        expect(response.body.savedPerson.nom).toBe('John Doe');
        expect(typeof response.body.token).toBe('string');
        expect(response.headers.location).toMatch(/\/api\/utilisateurs\/.+/);
    });
});

describe('POST /api/utilisateurs', function() {
    it('should return error name already exists', async function() {
        // Create a user in the database before test in this block.
        await createUser();

        const response = await supertest(app)
            .post('/api/utilisateurs')
            .send({
                nom: 'Jane Doe',
                mail: 'test@email.com',
                mdp: 'password'
            })
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Utilisateur validation failed: nom: Person Jane Doe already exists §§usernameExists§§');
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
    it('should retrieve one user name', async function() {        
        // Create a user in the database before test in this block.
        const user = await createUser();

        const response = await supertest(app)
            .get('/api/utilisateurs/' + user.id)
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('Jane Doe');
        expect(!response.body.mdp);

        //test 404
        const response2 = await supertest(app)
            .get('/api/utilisateurs/675acf94c22b546fcde7794d')
        expect(response2.status).toBe(404);
        expect(response2.text).toBe('Person not found');

        // id qui n'en est pas un
        const response3 = await supertest(app)
            .get('/api/utilisateurs/675')
        expect(response3.status).toBe(400);
        expect(response3.text).toBe('Invalid ID');

    });
});
//TODO tester aussi que si on a pas le ID c'est erreur 404 quand test ID

describe('POST /api/utilisateurs/login', function() {
    it('should valid or not login', async function() {        
        // Create a user in the database before test in this block.
        const user = await createUser();

        //valid login
        const response1 = await supertest(app)
            .post('/api/utilisateurs/login')
            .send({
                nom: 'Jane Doe',
                mdp: 'password'
            })
        expect(response1.status).toBe(200);
        expect(response1.body.message).toBe('Bienvenue Jane Doe!');
        expect(!response1.body.mdp);

        //invalid password
        const response2 = await supertest(app)
            .post('/api/utilisateurs/login')
            .send({
                nom: 'Jane Doe',
                mdp: 'mdp13'
            })
        expect(response2.status).toBe(401);
        expect(response2.text).toBe('Unauthorized');

        //invalid name
        const response3 = await supertest(app)
            .post('/api/utilisateurs/login')
            .send({
                nom: 'Mika Doe',
                mdp: 'mdp12'
            })
        expect(response3.status).toBe(401);
        expect(response3.text).toBe('Unauthorized');
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);