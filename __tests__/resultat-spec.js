import supertest from "supertest"
import app from "../app.js"

describe('POST /api/resultats', function () {
    it('should create a resultat', async function () {
        const resUser = await supertest(app).get('/api/utilisateurs')
        // Check that the status and headers of the response are correct.
        expect(resUser.status).toBe(200);
        expect(resUser.get('Content-Type')).toContain('application/json');

        // const parcours = await Parcours.create({
        //     nom: 'parcours1',
        //     difficulte: 'facile',
        //     createBy: user.id,
        //     postesInclus: [poste1.id, poste2.id]
        // });
        
        const resParcours = await supertest(app).get('/api/parcours')
        expect(resParcours.status).toBe(200);
        expect(resParcours.body[0].nom).toBe('parcours1');

        const resultat = await supertest(app)
            .post('/api/resultats')
            .send({
                trailID: resParcours.body[0].id,
                userID: resUser.body[0].id,
                temps: 120
            })
        expect(resultat.status).toBe(201);
        expect(resultat.body.temps).toBe(120);
        expect(resultat.headers.location).toMatch(/\/api\/resultats\/.+/);
    });
});

describe('GET /api/resultats', function () {
    it('should retrieve the list of resultats', async function() {
    const response = await supertest(app)
    .get('/api/resultats')
expect(response.status).toBe(200);
expect(response.body.length).toBe(1);
expect(response.body[0].temps).toBe(120);
    });
});