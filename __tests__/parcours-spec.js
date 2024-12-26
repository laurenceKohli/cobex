import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, create2Postes, createParcours, createUser, createAdminUser, giveToken, createParcoursWithResult } from './utils.js';

import Parcours from "../models/parcours.js";

beforeEach(cleanUpDatabase);

describe('POST /api/parcours', function () {
    it('should create a parcours', async function () {
        // Create 2 posts in the database before test in this block.
        const [poste1, poste2] = await create2Postes();

        // Create a user in the database before test in this block.
        const user = await createAdminUser();

        const token = giveToken(user.id);
        // autoriser
        const parcours = await supertest(app)
            .post('/api/parcours')
            .set('Authorization', 'Bearer '+token)
            .send({
                nom: 'parcours1',
                difficulte: 'facile',
                createBy: user.id,
                postesInclus: [poste1.id, poste2.id],
                descr : 'test'
            })
        expect(parcours.status).toBe(201);
        expect(parcours.body.nom).toBe('parcours1');
        expect(parcours.body.descr).toBe('test');
        expect(parcours.headers.location).toMatch(/\/api\/parcours\/.+/);

        //interdire
        const user2 = await createUser();
        const token2 = giveToken(user2.id);
        const parcours2 = await supertest(app)
            .post('/api/parcours')
            .set('Authorization', 'Bearer '+token2)
            .send({
                nom: 'parcours2',
                difficulte: 'facile',
                createBy: user2.id,
                postesInclus: [poste1.id, poste2.id],
                descr : 'test'
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
        expect(!response.body[0].nomCreateur);
    });
});

describe('GET /api/parcours with BODY', function () {
    it('should retrieve the list of parcours with name of creator', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

        const response = await supertest(app)
            .get('/api/parcours?include=user');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nbr_posts).toBe(2);
        expect(response.body[0].nom).toBe('parcours1');
        expect(response.body[0].nomCreateur).toBe('John Doe');
    });
});

describe('GET /api/parcours/:id', function () {
    it('should retrieve one parcours or not', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

         //valid id
        const response = await supertest(app)
            .get('/api/parcours/'+ parcours.id)
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
         const parcours = await createParcoursWithResult();

        const response = await supertest(app)
            .get('/api/parcours/'+ parcours.id + "?include=postes")
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('parcours1');
        expect(response.body.descr).toBe(undefined);
        expect(JSON.stringify(response.body.postesInclus)).toBe(JSON.stringify(parcours.postesInclus));
        expect(response.body.resultatsAct.length).toBe(1);
        expect(response.body.resultatsAct[0].temps).toBe(120);
        expect(response.body.resultatsAct[0].user).toBe('Jane Doe');
    });
});

describe('PATCH /api/parcours/:id', function () {
    it('should update partially the parcours', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

         const token = giveToken(parcours.createBy);

        const response = await supertest(app)
            .patch('/api/parcours/'+ parcours.id)
            .set('Authorization', 'Bearer '+token)
            .send({
                nom: 'Mon Parcours',
                descr: 'test'
            })
        expect(response.status).toBe(200);
        expect(response.body.nom).toBe('Mon Parcours');
        expect(response.body.descr).toBe('test');
        expect(response.body.difficulte).toBe('facile');

        //interdire
        const user2 = await createUser();
        const token2 = giveToken(user2.id);
        const response2 = await supertest(app)
            .patch('/api/parcours/'+ parcours.id)
            .set('Authorization', 'Bearer '+token2)
            .send({
                nom: 'Mon Parcours',
                descr: 'test'
            })
        expect(response2.status).toBe(403);
    });
});

describe('DELETE /api/parcours/:id', function () {
    it('should delete the parcours', async function () { 
         // Create a parcours in the database before test in this block.
         const parcours = await createParcours();

         //interdire
         const user2 = await createUser();
        const token = giveToken(user2.id);

        const response = await supertest(app)
            .delete('/api/parcours/'+ parcours.id)
            .set('Authorization', 'Bearer '+token)
        expect(response.status).toBe(403);
         //autoriser
         const token2 = giveToken(parcours.createBy);

        const response2 = await supertest(app)
            .delete('/api/parcours/'+ parcours.id)
            .set('Authorization', 'Bearer '+token2)
        expect(response2.status).toBe(204);

        expect(await Parcours.findById(parcours.id)).toBe(null);
    });
});

// Disconnect from the database once the tests are done.
afterAll(mongoose.disconnect);