const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const requireLogin = require('../middlewares/requireLogin');
const upload = require('../middlewares/upload');

// Route pour afficher tous les articles
router.get('/', requireLogin, articleController.getAllArticles);

// Route pour afficher un article spécifique
router.get('/article/:id', requireLogin, articleController.getArticleById);

// Route pour afficher la page de création d'article
router.get('/create-art', requireLogin, articleController.getCreateArticlePage);

// Route pour créer un nouvel article
router.post('/create-art', requireLogin, upload.single('imageFile'), articleController.createArticle);

module.exports = router;