var Backbone = require("backbone");
var $ = require("jquery");

Backbone.$ = $;

module.exports = Backbone.Router.extend({
    routes: {
        "rooms": "rooms",
        "rooms/:roomId": "room",
        "*actions": "defaultRoute"
    }
});