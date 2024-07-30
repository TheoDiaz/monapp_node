# MonApp Node

## Introduction

MonApp Node est une application web sécurisée développée avec Node.js et Express. Elle offre une plateforme pour la gestion d'articles de jeux vidéo, avec une authentification utilisateur et une intégration avec l'API IGDB pour obtenir des informations détaillées sur les jeux. L'application utilise HTTPS pour une communication sécurisée et MongoDB Atlas comme base de données.

## Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure du Projet](#structure-du-projet)
- [Composants Principaux](#composants-principaux)
- [Principes SOLID et Design Patterns](#principes-solid-et-design-patterns)
- [Sécurité](#sécurité)
- [Intégration API](#intégration-api)
- [Développement](#développement)
- [Dépendances Principales](#dépendances-principales)
- [Auteurs](#auteurs)

## Fonctionnalités

- Création, visualisation et gestion d'articles de jeux vidéo
- Authentification des utilisateurs (inscription, connexion, déconnexion)
- Intégration avec l'API IGDB pour la recherche et l'importation d'informations sur les jeux
- Logging avancé avec Winston pour un suivi détaillé des activités de l'application
- Serveur HTTPS pour une communication sécurisée
- Stockage des données dans MongoDB Atlas
- Upload d'images pour les articles

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/TheoDiaz/monapp_node.git
   cd monapp_node
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Configuration

1. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```env
   PORT=4000
   MONGODB_URI=votre_uri_mongodb_atlas

   SESSION_SECRET=votre_secret_de_session
   TWITCH_CLIENT_ID=votre_client_id_twitch
   TWITCH_CLIENT_SECRET=votre_client_secret_twitch
   ```

2. Assurez-vous d'avoir les fichiers `server.key` et `server.cert` pour le serveur HTTPS.

## Utilisation

1. Lancez l'application :
   ```bash
   node app.js
   ```

2. Accédez à l'application via `https://localhost:4000` dans votre navigateur.

## Structure du Projet

- `app.js` : Point d'entrée principal de l'application.
- `routes/` : Définition des routes de l'application.
- `controllers/` : Logique de contrôle pour les routes.
- `models/` : Modèles de données Mongoose.
- `services/` : Services pour l'intégration IGDB et autres fonctionnalités.
- `middlewares/` : Middlewares personnalisés.
- `public/` : Fichiers statiques.
- `views/` : Templates EJS.
- `logs/` : Fichiers de logs générés par l'application.

## Composants Principaux

### Routes

#### Routes Utilisateurs (`userRoutes.js`)
- `GET /users/register` : Affiche la page d'inscription.
- `POST /users/register` : Traite l'inscription d'un nouvel utilisateur.
- `GET /users/login` : Affiche la page de connexion.
- `POST /users/login` : Traite la connexion d'un utilisateur.
- `GET /users/logout` : Déconnecte l'utilisateur (nécessite d'être connecté).

#### Routes Articles (`articleRoutes.js`)
- `GET /articles` : Affiche tous les articles (nécessite d'être connecté).
- `GET /articles/article/:id` : Affiche un article spécifique.
- `GET /articles/create-art` : Affiche la page de création d'article.
- `POST /articles` : Crée un nouvel article (avec upload d'image).
- `GET /articles/search-games` : Recherche des jeux via l'API IGDB.

### Modèle de Données

#### Article (`Article.js`)
```javascript
{
    name: String,
    codeArticle: String,
    description: String,
    image: String,
    price: Number,
    quantity: Number,
    releaseDate: Date,
    platforms: [String],
    genres: [String]
}
```

### Services

#### IGDB Service (`igdbService.js`)
- Initialise la connexion à l'API IGDB avec authentification Twitch.
- Fournit une fonction `searchGames` pour rechercher des jeux via l'API IGDB.
- Formate les données reçues pour correspondre au modèle de l'application.

### Logging

L'application utilise Winston pour un logging avancé (`logger.js`) :
- Logs console avec coloration.
- Rotation quotidienne des fichiers de logs.
- Format de log personnalisé incluant timestamp et niveau de log.

## Principes SOLID et Design Patterns

Cette application a été développée en gardant à l'esprit les principes SOLID et certains design patterns pour assurer une architecture propre et maintenable :

1. **Single Responsibility Principle (SRP)** : Chaque module, service et contrôleur a une responsabilité unique et bien définie.

2. **Open/Closed Principle (OCP)** : L'architecture modulaire permet d'étendre les fonctionnalités sans modifier le code existant.

3. **Dependency Inversion Principle (DIP)** : L'utilisation de services injectés dans les contrôleurs permet une meilleure gestion des dépendances.

4. **Factory Pattern** : Utilisé dans la création des instances de logger et de connexion à la base de données.

5. **Middleware Pattern** : Implémenté via Express pour la gestion de l'authentification et des uploads.

6. **MVC Pattern** : L'application suit une structure Model-View-Controller pour une séparation claire des responsabilités.

7. **Repository Pattern** : Utilisé dans les services pour abstraire la logique d'accès aux données.

## Sécurité

- Utilisation de HTTPS pour toutes les communications.
- Middleware `requireLogin` pour protéger les routes nécessitant une authentification.
- Stockage sécurisé des mots de passe (à implémenter dans `userController.js`).

## Intégration API

L'application s'intègre avec l'API IGDB pour récupérer des informations détaillées sur les jeux vidéo. Cette intégration permet :
- La recherche de jeux basée sur des requêtes utilisateur.
- L'importation de données comme le titre, la description, la date de sortie, les plateformes et les genres.
- L'utilisation d'images de couverture fournies par IGDB.

## Développement

Pour contribuer au projet :

1. Assurez-vous d'avoir Node.js et npm installés.
2. Configurez votre environnement de développement avec les variables nécessaires.
3. Suivez les conventions de code existantes.
4. Utilisez les branches Git pour les nouvelles fonctionnalités ou corrections.
5. Testez vos modifications avant de soumettre une pull request.

## Dépendances Principales

- Express.js : Framework web
- Mongoose : ODM pour MongoDB
- EJS : Moteur de template
- Axios : Client HTTP pour les requêtes API
- Winston : Logging avancé
- Multer : Gestion des uploads de fichiers


## Auteur

- Théo DIAZ