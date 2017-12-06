const connection = require('../lib/connectiondb');

class BaseController {
    constructor(name) {
        var self = this;
        self.name = name;
    }

    init(app) {
        var self = this;
        app.get('/competencias', self.retrieveAll.bind(self));
    }

    retrieveAll(req, res) {
        var query = `SELECT * FROM ${this.name}`;

        connection.query(query, function (error, results) {
            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            return res.json(results);
        });
    }
}

module.exports = BaseController;
