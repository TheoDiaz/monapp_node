const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const logger = require('./logger'); // Importer le logger
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware pour les logs HTTP
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Dossier de destination pour les fichiers uploadés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier uploadé
    }
});
const upload = multer({ storage: storage });

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

// Middleware pour vérifier l'état de connexion
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Rediriger vers la page de login si l'utilisateur n'est pas connecté
    }
    next();
};

// Modèles Mongoose
const User = require('./models/User');
const Article = require('./models/Article');

// Routes

// Route pour la page d'accueil
app.get('/', requireLogin, async (req, res) => {
    try {
        const articles = await Article.find(); // Récupérer tous les articles depuis la base de données
        res.render('view-articles', { articles }); // Rendre la vue avec les articles
    } catch (error) {
        logger.error('Erreur lors de la récupération des articles:', error);
        res.status(500).send('Erreur lors de la récupération des articles');
    }
});

// Route pour afficher un article spécifique
app.get('/article/:id', requireLogin, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id); // Récupérer l'article par ID
        if (article) {
            res.render('view-art', { article }); // Rendre la vue avec l'article
        } else {
            res.status(404).send('Article non trouvé'); // Article non trouvé
        }
    } catch (error) {
        logger.error('Erreur lors de la récupération de l\'article:', error);
        res.status(500).send('Erreur lors de la récupération de l\'article');
    }
});

// Route pour afficher la page de création d'article
app.get('/create-art', requireLogin, (req, res) => {
    res.render('create-art'); // Rendre la vue pour créer un nouvel article
});

// Route pour créer un nouvel article
app.post('/create-art', requireLogin, upload.single('imageFile'), async (req, res) => {
    const { name, codeArticle, description, price, quantity, imageType, imageUrl } = req.body;
    let imagePath;

    // Déterminer le chemin de l'image en fonction du type d'image (URL ou fichier)
    if (imageType === 'file' && req.file) {
        imagePath = '/uploads/' + req.file.filename; // Chemin du fichier uploadé
    } else if (imageType === 'url' && imageUrl) {
        imagePath = imageUrl; // URL de l'image
    } else {
        return res.status(400).send('Image non fournie'); // Image non fournie
    }

    // Créer un nouvel article avec les données fournies
    const newArticle = new Article({
        name,
        codeArticle,
        description,
        image: imagePath,
        price: parseFloat(price),
        quantity: parseInt(quantity)
    });

    try {
        await newArticle.save(); // Sauvegarder le nouvel article dans la base de données
        logger.info(`Nouvel article créé: ${newArticle.name}`);
        res.redirect('/'); // Rediriger vers la page d'accueil après la création
    } catch (error) {
        logger.error('Erreur lors de la création de l\'article:', error);
        res.status(500).send('Erreur lors de la création de l\'article');
    }
});

// Route pour afficher la page d'inscription
app.get('/register', (req, res) => {
    res.render('register'); // Rendre la vue pour l'inscription
});

// Route pour s'inscrire
app.post('/register', async (req, res) => {
    const { name, age, email, password } = req.body;

    // Créer un nouvel utilisateur avec les données fournies
    const newUser = new User({
        name,
        age: parseInt(age),
        email,
        password, // Idéalement, hachez le mot de passe ici
        date_ajout: new Date()
    });

    try {
        await newUser.save(); // Sauvegarder le nouvel utilisateur dans la base de données
        logger.info(`Nouvel utilisateur enregistré: ${newUser.email}`);
        res.render('register-success'); // Rendre la vue de succès après l'inscription
    } catch (error) {
        logger.error('Erreur lors de l\'inscription:', error);
        res.status(500).send('Erreur lors de l\'inscription');
    }
});

// Route pour afficher la page de connexion
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Rendre la vue pour la connexion
});

// Route pour se connecter
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password }); // Utilisez une méthode de hachage ici
        if (user) {
            req.session.user = user; // Enregistrer l'utilisateur dans la session
            logger.info(`Utilisateur connecté: ${user.email}`);
            res.redirect('/'); // Rediriger vers la page d'accueil après la connexion
        } else {
            res.render('login', { error: 'Adresse email ou mot de passe incorrect.' }); // Afficher une erreur si les identifiants sont incorrects
        }
    } catch (error) {
        logger.error('Erreur lors de la connexion:', error);
        res.status(500).send('Erreur lors de la connexion');
    }
});

// Route pour se déconnecter
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logger.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/login'); // Rediriger vers la page de connexion après la déconnexion
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});