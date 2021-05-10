// On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs //
const bcrypt = require('bcrypt');
// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte //
const jwt = require('jsonwebtoken');
// On récupère notre model User ,créer avec le schéma mongoose //
const User = require('../models/User');
// On utilise crypto-js pour crypté l'email de l'utilisateur //
const CryptoJS = require("crypto-js");
// On crypte l'email //
const cipherText = CryptoJS.AES.encrypt('+process.env.TEXT+', '+process.env.KEY+').toString();

// On sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt //
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: cipherText,
                password: hash
            });
            // On enregistre l'utilisateur dans la base de données //
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Le Middleware pour la connexion d'un utilisateur, vérifie si l'utilisateur existe dans la base MongoDB lors du login //
exports.login = (req, res, next) => {
    User.findOne({ email: cipherText })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            ''+process.env.TOKEN+'',
                            { expiresIn: '24h' }
                        )
                        // On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID //
                        // aux objets et ne pas modifier ou supprimer les objets des autres utilisateurs //
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
