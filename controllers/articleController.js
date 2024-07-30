const ArticleService = require('../services/ArticleService');
const igdbService = require('../services/igdbService');

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await ArticleService.getAllArticles();
        res.render('view-articles', { articles });
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        res.status(500).send('Erreur lors de la récupération des articles');
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await ArticleService.getArticleById(req.params.id);
        if (article) {
            res.render('view-art', { article });
        } else {
            res.status(404).send('Article non trouvé');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        res.status(500).send('Erreur lors de la récupération de l\'article');
    }
};

exports.getCreateArticlePage = (req, res) => {
    res.render('create-art');
};

exports.createArticle = async (req, res) => {
    try {
        const { name, codeArticle, description, price, quantity, imageType, imageUrl } = req.body;
        let imagePath;

        if (imageType === 'file' && req.file) {
            imagePath = '/uploads/' + req.file.filename;
        } else if (imageType === 'url' && imageUrl) {
            imagePath = imageUrl;
        } else {
            return res.status(400).send('Image non fournie');
        }

        const articleData = {
            name,
            codeArticle,
            description,
            image: imagePath,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        };

        await ArticleService.createArticle(articleData);
        res.redirect('/articles');
    } catch (error) {
        console.error('Erreur lors de la création de l\'article:', error);
        res.status(500).send('Erreur lors de la création de l\'article');
    }
};

exports.searchGames = async (req, res) => {
    try {
        const query = req.query.q;
        const games = await igdbService.searchGames(query);
        res.json(games);
    } catch (error) {
        console.error('Erreur lors de la recherche de jeux:', error);
        res.status(500).json({ message: 'Erreur lors de la recherche de jeux', error: error.message });
    }
};