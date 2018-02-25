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

BaseController.prototype.add = function(req, res) {
    var data = req.body;
    var keys = Object.keys(data);
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

BaseController.prototype.update = function(req, res) {
    var id = req.params.id;
    var keys = Object.keys(req.body);
    var values = '';
    keys.forEach(key => {
        values += ` ${key} = ${req.body[key]}`;
    });
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

BaseController.prototype.delete = function(req, res) {
    var id = req.params.id;
    var query = `DELETE FROM ${this.name} WHERE id = ${id}`;

    connection.query(query, function (error, results) {
        if (error) {
            return res
                .status(500)
                .json(error);
        }

        return res.json(results);
    });
};

module.exports = BaseController;
