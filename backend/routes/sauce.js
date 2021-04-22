// Ajout de plugin externe nécessaire pour utiliser le router d'Express //
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express //
const router = express.Router();

// Ajout des middleweares //
// On importe le middleware auth pour sécuriser les routes //
const auth = require('../middleware/auth');
//On importe le middleware multer pour la gestion des images //
const multer = require('../middleware/multer-config');

// On associe les fonctions aux différentes routes, on importe le controller
const sauceCtrl = require('../controllers/sauce');

// Création des différentes ROUTES de l'API en leurs précisant, dans l'ordre, leurs middlewares et controllers //

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;
