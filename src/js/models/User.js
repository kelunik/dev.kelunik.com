var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        state: "offline"
    }
});