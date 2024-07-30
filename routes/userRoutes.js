const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireLogin = require('../middlewares/requireLogin');

// Route pour afficher la page d'inscription
router.get('/register', userController.getRegisterPage);

// Route pour s'inscrire
router.post('/register', userController.registerUser);

// Route pour afficher la page de connexion
router.get('/login', userController.getLoginPage);

// Route pour se connecter
router.post('/login', userController.loginUser);

// Route pour se déconnecter
router.get('/logout', requireLogin, userController.logoutUser);

module.exports = router;