module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login'); // Rediriger vers la page de login si l'utilisateur n'est pas connecté
    }
    next();
};