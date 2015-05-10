var Backbone = require("backbone");
var $ = require("jquery");

Backbone.$ = $;

module.exports = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute"
    }
});