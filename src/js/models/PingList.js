var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Ping = require("./Ping");

module.exports = Backbone.Collection.extend({
    model: Ping
});