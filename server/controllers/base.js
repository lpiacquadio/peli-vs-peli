const connection = require('../lib/connectiondb');

var BaseController = function(name) {
    this.name = name;
};

BaseController.prototype.retrieveAll = function(req, res) {
    var query = `SELECT * FROM ${this.name}`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        return res.json(results);
    });
};

BaseController.prototype.retrieve = function(req, res) {
    var id = req.params.id;
    var query = `SELECT * FROM ${this.name} WHERE id = ${id}`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        if (!results[0]) {
            return res
                .status(404)
                .json({ error: `${this.name} no encontrado/a` });
        }

        return res.json(results[0]);
    });
};

module.exports = BaseController;
