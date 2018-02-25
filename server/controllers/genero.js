// const connection = require('../lib/connectiondb');
var BaseController = require('./base');

var GeneroController = function() {
    this.name = 'genero';
    this.baseUrl = '/generos';
    BaseController.call(this, this.name);
};

GeneroController.prototype = Object.create(BaseController.prototype);

GeneroController.prototype.init = function(app) {
    app.get(`${this.baseUrl}`, this.retrieveAll.bind(this));
};

module.exports = GeneroController;
