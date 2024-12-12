import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, create2Postes, createParcours, createUser, createAdminUser } from './utils.js';

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

        // autoriser
        const parcours = await supertest(app)
            .post('/api/parcours')
            .send({
                nom: 'parcours1',
                difficulte: 'facile',
                createBy: user.id,
                postesInclus: [poste1.id, poste2.id],
                descr : 'test',
                currentUserRole : user.role
            })
        expect(parcours.status).toBe(201);
        expect(parcours.body.nom).toBe('parcours1');
        expect(parcours.body.descr).toBe('test');
        expect(parcours.headers.location).toMatch(/\/api\/parcours\/.+/);

        //interdire
        const parcours2 = await supertest(app)
            .post('/api/parcours')
            .send({
                nom: 'parcours2',
                difficulte: 'facile',
                createBy: user.id,
                postesInclus: [poste1.id, poste2.id],
                descr : 'test',
                currentUserRole : 'user'
            })
            expect(parcours2.status).toBe(403);
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
        expect(response.body[0].nbr_posts).toBe(2);
        expect(response.body[0].nom).toBe('parcours1');
    });
});

describe('GET /api/parcours with BODY', function () {
    it('should retrieve the list of parcours with name of creator', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .get('/api/parcours')
            .send({include : 'user'})
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nbr_posts).toBe(2);
        expect(response.body[0].nom).toBe('parcours1');
        expect(response.body[0].createBy.nom).toBe('Jane Doe');
    });
});

describe('GET /api/parcours/:id', function () {
    it('should retrieve one parcours or not', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

         //valid id
        const response = await supertest(app)
            .get('/api/parcours'+ parcours.id)
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('parcours1');
        expect(response.body.id).toBe(parcours.id);

        //invalid id
        const response2 = await supertest(app)
            .get('/api/parcours/67599e037617f27ee7240ded')
        expect(response2.status).toBe(404);
    });
});

describe('GET /api/parcours/:id WITH BODY', function () {
    it('should retrieve one parcours with postes', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .get('/api/parcours'+ parcours.id)
            .send({include : 'postes'})
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('parcours1');
        expect(response.body.postesInclus).toBe(parcours.postesInclus);
    });
});

describe('DELETE /api/parcours/:id', function () {
    it('should delete the parcours', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .delete('/api/parcours'+ parcours.id)
            .send({currentUserRole : 'superAdmin'})
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