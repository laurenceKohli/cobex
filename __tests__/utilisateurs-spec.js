import supertest from "supertest"
import app from "../app.js"



describe('POST /api/utilisateurs', function() {
    it('should create a user', async function() {
        const response = await supertest(app)
            .post('/api/utilisateurs')
            .send({
            name: 'John Doe',
            email: 'test@email.com'
            })
            .expect(201);
        expect(response.body.name).toBe('John Doe');
    });
});

describe('GET /api/utilisateurs', function() {
    test.todo('should retrieve the list of users');
});