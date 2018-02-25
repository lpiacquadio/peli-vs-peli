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
    app.post(`${this.baseUrl}`, this.addCompetencia.bind(this));
    app.put(`${this.baseUrl}/:id`, this.updateCompetencia.bind(this));
    app.delete(`${this.baseUrl}/:id`, this.deleteVotosAndCompetencia.bind(this));
    app.get(`${this.baseUrl}/:id/peliculas`, this.retrievePeliculas.bind(this));
    app.post(`${this.baseUrl}/:id/voto`, this.votePelicula.bind(this));
    app.get(`${this.baseUrl}/:id/resultados`, this.retrieveResults.bind(this));
    app.delete(`${this.baseUrl}/:id/votos`, this.deleteVotos.bind(this));
};

CompetenciasController.prototype.retrievePeliculas = function(req, res) {
    var id = req.params.id;
    
    var queryCompetencia = `SELECT * FROM ${this.name} WHERE id = ${id}`;
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
        
        var filter = '';
        if (results[0].genero_id || results[0].director_id || results[0].actor_id) {
            filter = ' WHERE ';
            if (results[0].genero_id) {
                filter += `genero_id = "${results[0].genero_id}"`;
            }

            if (results[0].genero_id && (results[0].director_id || results[0].actor_id)) {
                filter += ' AND ';
            }

            if (results[0].director_id) {
                filter += `director_id = "${results[0].director_id}"`;
            }

            if (results[0].genero_id && results[0].director_id && results[0].actor_id) {
                filter += ' AND ';
            }

            if (results[0].actor_id) {
                filter += `actor_id = "${results[0].actor_id}"`;
            }
        }
        var queryPeliculas = `SELECT DISTINCT pelicula.id, poster, titulo, genero_id FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id${filter} ORDER BY RAND() LIMIT 2`;
        console.log(queryPeliculas);

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

CompetenciasController.prototype.deleteVotos = function(req, res) {
    var id = req.params.id;
    var queryCompetencia = `SELECT * FROM competencia WHERE id = ${id}`;
    var queryDelete = `DELETE FROM voto WHERE competencia_id = ${id}`;

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

        connection.query(queryDelete, function (error, results) {
            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            return res.json(results);
        });
    });
};

BaseController.prototype.addCompetencia = function(req, res) {
    var data = req.body;
    delete data.Guardar;

    if (data.genero === '0') {
        delete data.genero;
    }
    if (data.director === '0') {
        delete data.director;
    }
    if (data.actor === '0') {
        delete data.actor;
    }

    var keys = Object.keys(data);
    keys = keys.map(key => {
        if (['actor', 'director', 'genero'].indexOf(key) >= 0) {
            key += '_id';
        }
        return key;
    });
    var values = Object.values(data);
    values = values.map(value => {
        return `"${value}"`;
    });

    var query = `INSERT INTO ${this.name} (${keys.join()}) VALUES (${values.join()})`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        return res.json(results);
    });
};

CompetenciasController.prototype.deleteVotosAndCompetencia = function(req, res) {
    var id = req.params.id;
    var queryGetCompetencia = `SELECT * FROM competencia WHERE id = ${id}`;
    var queryDeleteVotos = `DELETE FROM voto WHERE competencia_id = ${id}`;
    var queryDeleteCompetencia = `DELETE FROM competencia WHERE id = ${id}`;

    connection.query(queryGetCompetencia, function (error, results) {
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

        connection.query(queryDeleteVotos, function (error, results) {
            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            connection.query(queryDeleteCompetencia, function (error, results) {
                if (error) {
                    return res
                        .status(500)
                        .json(error);
                }

                return res.json(results);
            });
        });
    });
};

CompetenciasController.prototype.updateCompetencia = function(req, res) {
    var id = req.params.id;
    var data = req.body;
    delete data.Guardar;
    var keys = Object.keys(data);
    var values = '';
    keys.forEach(key => {
        values += ` ${key} = "${data[key]}"`;
    });

    console.log(keys);
    console.log(values);

    var query = `UPDATE ${this.name} SET ${values} WHERE id = ${id}`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        return res.json(results);
    });
};

module.exports = CompetenciasController;
