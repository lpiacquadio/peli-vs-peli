require('dotenv').config();

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var BaseController = require('./controllers/base');
var CompetenciasController = new BaseController('competencia');

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

CompetenciasController.init(app);

app.listen(process.env.EXPRESS_PORT, function () {
    console.log(`http://localhost:${process.env.EXPRESS_PORT}/`);
});
