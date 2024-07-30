const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const logger = require('./logger'); // Importer le logger
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes'); // Importer les routes utilisateurs
const articleRoutes = require('./routes/articleRoutes'); // Importer les routes articles
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pour les logs HTTP
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configurer express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'votre_secret_de_session', // Clé secrète pour les sessions
    resave: false,
    saveUninitialized: true
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '/public')));

// Définir EJS comme moteur de templates
app.set('view engine', 'ejs');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => logger.info('Connexion à MongoDB Atlas réussie !'))
.catch((err) => logger.error('Connexion à MongoDB Atlas échouée !', err));

// Routes
app.use('/users', userRoutes); // Utiliser les routes utilisateurs
app.use('/articles', articleRoutes); // Utiliser les routes articles

// Route par défaut pour la page d'accueil
app.get('/', (req, res) => {
    res.redirect('/articles'); // Rediriger vers la page des articles
});

// Démarrer le serveur
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});