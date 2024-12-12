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

// describe('GET /api/utilisateurs/:id', function() {
//     it('should retrieve one user', async function() {        
//         // Create a user in the database before test in this block.
//         const user = await createUser();

//         const response = await supertest(app)
//             .get('/api/utilisateurs/' + user.id)
//         expect(response.status).toBe(200);
//         expect(response.body.nom).toBe('Jane Doe');
//         expect(!response.body.mdp);
//     });
// });
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
        expect(response1.body.message).toBe('Welcome Jane Doe!');
        expect(!response1.body.mdp);

        //invalid password
        const response2 = await supertest(app)
            .post('/api/utilisateurs/login')
            .send({
                nom: 'Jane Doe',
                mdp: 'mdp13'
            })
        expect(response2.status).toBe(401);

        //invalid name
        const response3 = await supertest(app)
            .post('/api/utilisateurs/login')
            .send({
                nom: 'Mika Doe',
                mdp: 'mdp12'
            })
        expect(response3.status).toBe(401);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);