# Intitulés des Tests
Nombre total de test : 15

## utilisateurs-spec.js
1. `POST /api/utilisateurs`
   - `should create a user`
2. `GET /api/utilisateurs`
   - `should retrieve the list of users`
3. `GET /api/utilisateurs/:id`
   - `should retrieve one user name`
4. `POST /api/utilisateurs/login`
   - `should valid or not login`
TODO
GET /api/utilisateurs?include=isAdmin
## resultat-spec.js
1. `POST /api/resultats`
   - `should create a resultat`
2. `GET /api/resultats`
   - `should retrieve the list of resultats`
TODO
PATCH
DELETE
GET /api/resultats?utilisateurs=:id&?include=parcours
GET /api/resultats?parcours=:id&?include=utilisateurs
## poste-spec.js
1. `GET /api/postes`
   - `should retrieve the list of postes`
TODO
GET :id
PATCH
## parcours-spec.js
1. `POST /api/parcours`
   - `should create a parcours`
2. `GET /api/parcours`
   - `should retrieve the list of parcours`
3. `GET /api/parcours with BODY`
   - `should retrieve the list of parcours with name of creator`
4. `GET /api/parcours/:id`
   - `should retrieve one parcours or not` 
5. `GET /api/parcours/:id WITH BODY`
   - `should retrieve one parcours with postes`
6. `PATCH /api/parcours/:id`
   - `should update partially the parcours`
7. `DELETE /api/parcours/:id`
   - `should delete the parcours`
TODO
GET /api/parcours/:id?include=postes
GET /api/parcours?include=user
PUT
!! PATCH
## example-spec.js
1. `should work`