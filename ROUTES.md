# CRUD
## Utilisateurs
Créer utilisateur
Update son mdp et son nom
Delete supprimer son compte -> mais que se passe-t-il avec leurs scores ? anonymiser son score
Read son compte OU slm nom (afficher les high score)

## Parcours 
Créer ? slm admin ou pas du tout
Modifier ? slm admin ou pas du tout
Delete ? slm admin ou pas du tout
Read tout le monde pour afficher sur liste

## Postes
Créer NON
Update ? slm admin pour modifier champ accessibilité
Delete NON
Read tout le monde pour afficher sur carte pdt parcours (sans images), admin Créer de nouveaux parcours

## Resultats
Créer -> à travers complétion parcours si authentifié
Update NON
Delete -> si parcours est supprimer
Read pour afficher les scores sur l'utilisateur et pour la page statistiques parcours

## REST
### Par application
GET /api/parcours/:id
GET /api/resultats?parcours=:id&?include=utilisateurs

GET /api/parcours/:id?include=postes

### Sans connection

### Connecté
GET /api/utilisateurs/:id
GET /api/resultats?utilisateurs=:id&?include=parcours

### Compte Admin
choix : un admin peut modifier tous les parcours créer
