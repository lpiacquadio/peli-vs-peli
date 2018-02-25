// const connection = require('../lib/connectiondb');
var BaseController = require('./base');

var ActorController = function() {
    this.name = 'actor';
    this.baseUrl = '/actores';
    BaseController.call(this, this.name);
};

ActorController.prototype = Object.create(BaseController.prototype);

ActorController.prototype.init = function(app) {
    app.get(`${this.baseUrl}`, this.retrieveAll.bind(this));
};

module.exports = ActorController;
