# CRUD
## Utilisateurs
Créer utilisateur
Read ->son compte OU slm nom (afficher les high score)
Update -> son mdp et son nom
Delete ->supprimer son compte -> mais que se passe-t-il avec leurs scores ? anonymiser son score

## Parcours 
Créer ->slm admin ou pas du tout
Read ->tout le monde pour afficher sur liste
Update ->slm admin ou pas du tout => choix : un admin peut modifier que les parcours qu'il a créer ET Superadmin peut tout modifier
Delete ->slm admin ou pas du tout

## Postes
Créer NON
Read ->tout le monde pour afficher sur carte pdt parcours (sans images), admin Créer de nouveaux parcours
Update ->slm Superadmin pour modifier champ accessibilité
Delete NON

## Resultats
Créer -> à travers complétion parcours si authentifié
Read -> pour afficher les scores sur l'utilisateur et pour la page statistiques parcours
Update -> si une personne supprime son compte
Delete -> si parcours est supprimer

# REST
## utilisateurs.js
GET /api/utilisateurs -> uniquement nom et id
GET /api/utilisateurs?include=role -> affichable que par le Superadmin
GET /api/utilisateurs/:id

POST /api/utilisateurs

PATCH /api/utilisateurs/:id  ((a faire en dernier))

DELETE /api/utilisateurs/:id ((a faire en dernier)) -> anonymise les résultats de l'utilisateur

## parcours.js
GET /api/parcours/ -> uniquement les id, nom, difficulté, descr, nbre postes
GET /api/parcours?include=user -> + nom du créateur du parcours
GET /api/parcours/:id
GET /api/parcours/:id?include=postes

POST /api/parcours -> admin ou superAdmin

PUT /api/parcours/:id -> superAdmin ou créateur
PATCH /api/parcours/:id -> superAdmin ou créateur

DELETE /api/parcours/:id -> superAdmin ou créateur

## resultats.js
GET /api/resultats
GET /api/resultats?utilisateurs=:id&?include=parcours
GET /api/resultats?parcours=:id&?include=utilisateurs

POST /api/resultats

## postes.js
GET /api/postes
GET /api/postes/:id 

PATCH /api/postes/:id
