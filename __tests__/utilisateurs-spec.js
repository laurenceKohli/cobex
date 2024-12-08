import supertest from "supertest"
import app from "../app.js"

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
        const response = await supertest(app)
            .get('/api/utilisateurs')
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nom).toBe('John Doe');
        expect(!response.body[0].mail);
        expect(!response.body[0].mdp);
    });
});