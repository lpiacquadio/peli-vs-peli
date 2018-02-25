// const connection = require('../lib/connectiondb');
var BaseController = require('./base');

var DirectorController = function() {
    this.name = 'director';
    this.baseUrl = '/directores';
    BaseController.call(this, this.name);
};

DirectorController.prototype = Object.create(BaseController.prototype);

DirectorController.prototype.init = function(app) {
    app.get(`${this.baseUrl}`, this.retrieveAll.bind(this));
};

module.exports = DirectorController;
