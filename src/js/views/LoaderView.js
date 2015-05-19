var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "span",
    className: "loader",

    initialize: function () {

    },

    render: function () {
        return this;
    }
});