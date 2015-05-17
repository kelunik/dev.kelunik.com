var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");

module.exports = Backbone.Collection.extend({
    model: Room
});