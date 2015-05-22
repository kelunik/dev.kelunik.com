var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");
var App = require("../App");

module.exports = Backbone.Collection.extend({
    model: Room
});