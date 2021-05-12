// Utilisation d'express //
const express = require('express');

// Méthode de express //
const router = express.Router();

// Importation du controller //
const userCtrl = require('../controllers/user');
// Importation du controller de mots de passe //
const verifyPassword = require('../middleware/verify-password');

// Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base de données //
router.post('/signup', verifyPassword, userCtrl.signup);

// Vérifie les informations d'identification de l'utilisateur,
// en renvoyant l'identifiant userID depuis la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)//
router.post('/login', userCtrl.login);

module.exports = router;
