require('dotenv').config();

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var CompetenciasController = require('./controllers/competencia');
var GenerosController = require('./controllers/genero');
var DirectorController = require('./controllers/director');
var ActorController = require('./controllers/actor');
var competencia = new CompetenciasController();
var generos = new GenerosController();
var director = new DirectorController();
var actor = new ActorController();

var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.json({
        message: 'Servidor funcionando 😎'
    });
});

competencia.init(app);
generos.init(app);
director.init(app);
actor.init(app);

app.listen(process.env.EXPRESS_PORT, function () {
    console.log(`http://localhost:${process.env.EXPRESS_PORT}/`);
});
