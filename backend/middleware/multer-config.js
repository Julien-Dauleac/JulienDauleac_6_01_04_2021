// On importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP //
const multer = require('multer');

// On crée un dictionnaire des types MIME pour définire le format des images //

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg'
}

// On crée un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer //

const storage = multer.diskStorage({
    destination: (reg, file, callback) => {
        callback(null, 'images')
    },
    filename: (reg, file, callBack) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callBack(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');
