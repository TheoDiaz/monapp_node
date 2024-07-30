const UserService = require('../services/userService');

class UserController {
    async getRegisterPage(req, res) {
        res.render('register');
    }

    async registerUser(req, res) {
        try {
            const { name, age, email, password } = req.body;
            await UserService.createUser({ name, age, email, password });
            res.render('register-success');
        } catch (error) {
            res.status(500).send('Erreur lors de l\'inscription');
        }
    }

    async getLoginPage(req, res) {
        res.render('login', { error: null });
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.authenticateUser(email, password);
            if (user) {
                req.session.user = user;
                res.redirect('/');
            } else {
                res.render('login', { error: 'Adresse email ou mot de passe incorrect.' });
            }
        } catch (error) {
            res.status(500).send('Erreur lors de la connexion');
        }
    }

    async logoutUser(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.error('Erreur lors de la déconnexion:', err);
            }
            res.redirect('/login');
        });
    }
}

module.exports = new UserController();