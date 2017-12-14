const connection = require('../lib/connectiondb');
var BaseController = require('./base');

var CompetenciasController = function() {
    this.name = 'competencia';
    this.baseUrl = '/competencias';
    BaseController.call(this, this.name);
};

CompetenciasController.prototype = Object.create(BaseController.prototype);

CompetenciasController.prototype.init = function(app) {
    app.get(`${this.baseUrl}`, this.retrieveAll.bind(this));
    app.get(`${this.baseUrl}/:id`, this.retrieve.bind(this));
    app.get(`${this.baseUrl}/:id/peliculas`, this.retrievePeliculas.bind(this));
    app.post(`${this.baseUrl}/:id/voto`, this.votePelicula.bind(this));
    app.get(`${this.baseUrl}/:id/resultados`, this.retrieveResults.bind(this));
};

CompetenciasController.prototype.retrievePeliculas = function(req, res) {
    var id = req.params.id;
    var queryCompetencia = `SELECT * FROM ${this.name} WHERE id = ${id}`;
    var queryPeliculas = `SELECT * FROM pelicula ORDER BY RAND() LIMIT 2`;
    var toReturn = {};

    connection.query(queryCompetencia, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        if (results.length === 0) {
            return res
                .status(404)
                .json({ error: 'Competencia no encontrada' });
        }

        toReturn.competencia = results[0].nombre;

        connection.query(queryPeliculas, function (error, results) {
            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            toReturn.peliculas = results;

            return res.json(toReturn);
        });
    });
};

CompetenciasController.prototype.votePelicula = function(req, res) {
    var idCompetencia = req.params.id;
    var idPelicula = req.body.idPelicula;

    if (!idPelicula) {
        return res
            .status(500)
            .json({ error: 'Falta la propiedad idPelicula' });
    }

    var query = `INSERT INTO voto (competencia_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula})`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        return res.json({ ok: true });
    });
};

CompetenciasController.prototype.retrieveResults = function(req, res) {
    var id = req.params.id;
    var queryCompetencia = `SELECT nombre FROM competencia WHERE id = ${id}`;
    var queryVotos = `SELECT competencia_id, pelicula_id, count(pelicula_id) as votos, pelicula.poster, pelicula.titulo FROM voto INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE competencia_id = ${id} GROUP BY pelicula_id ORDER BY (votos) DESC LIMIT 3`;
    var toReturn = {};

    connection.query(queryCompetencia, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        if (results.length === 0) {
            return res
                .status(404)
                .json({ error: 'Competencia no encontrada' });
        }

        toReturn.competencia = results[0].nombre;

        connection.query(queryVotos, function (error, results) {
            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            toReturn.resultados = results;
    
            return res.json(toReturn);
        });
    });
};

module.exports = CompetenciasController;
