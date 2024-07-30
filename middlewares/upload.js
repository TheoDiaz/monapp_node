const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Dossier de destination pour les fichiers uploadés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier uploadé
    }
});

const upload = multer({ storage: storage });

module.exports = upload;