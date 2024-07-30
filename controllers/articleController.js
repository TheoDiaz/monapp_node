const ArticleService = require('../services/articleService');

class ArticleController {
    async getAllArticles(req, res) {
        try {
            const articles = await ArticleService.getAllArticles();
            res.render('view-articles', { articles });
        } catch (error) {
            res.status(500).send('Erreur lors de la récupération des articles');
        }
    }

    async getArticleById(req, res) {
        try {
            const article = await ArticleService.getArticleById(req.params.id);
            if (article) {
                res.render('view-art', { article });
            } else {
                res.status(404).send('Article non trouvé');
            }
        } catch (error) {
            res.status(500).send('Erreur lors de la récupération de l\'article');
        }
    }

    async getCreateArticlePage(req, res) {
        res.render('create-art');
    }

    async createArticle(req, res) {
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

            await ArticleService.createArticle({
                name,
                codeArticle,
                description,
                image: imagePath,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            });

            res.redirect('/articles');
        } catch (error) {
            res.status(500).send('Erreur lors de la création de l\'article');
        }
    }
}

module.exports = new ArticleController();