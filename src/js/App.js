var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");

Backbone.$ = $;

module.exports = {
    vent: _.extend({}, Backbone.Events)
};