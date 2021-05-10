// Import des modules npm - Ajout des plugins externes //
const express = require('express');
// Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser //
const bodyParser = require('body-parser');
// On importe mongoose pour pouvoir utiliser la base de données //
const mongoose = require('mongoose');
// On donne accès au chemin de notre système de fichier, plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier //
const path = require('path');
// On importe helmet pour plus de sécurité sur l'application //
const helmet = require("helmet");
// Require et configuration de Dotenv //
require('dotenv').config()
// On importe express-rate-limite pour limiter le nombe d'essai de connexion en cas d'attaque brute //
const rateLimit = require("express-rate-limit");

// Déclaration des routes //
// On importe la route dédiée aux sauces //
const sauceRoutes = require('./routes/sauce');
// On importe la route dédiée aux utilisateurs //
const userRoutes = require('./routes/user');
// Création d'une application express //
const app = express();

// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe //

mongoose.connect('mongodb+srv://'+process.env.DB_USER+': '+process.env.DB_MDP+'@'+process.env.DB_HOST+'/'+process.env.DB_NAME+
    'retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Va servir à sécuriser l'application Express en définissant divers en-têtes HTTP //
app.use(helmet());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur //

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc) //
// see https://expressjs.com/en/guide/behind-proxies.html //
// app.set('trust proxy', 1); //
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// apply to all requests //
app.use(limiter);

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable //
app.use(bodyParser.json());

// Gestion de la ressource image de façon statique //
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images //
app.use('/images', express.static(path.join(__dirname, 'images')));

// Va servir les routes dédiées aux sauces //
app.use('/api/sauces', sauceRoutes);
// Va servir les routes dédiées aux utilisateurs //
app.use('/api/auth', userRoutes);

// Export de l'application express pour déclaration dans server.js //
module.exports = app;
