var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    el: "main",

    initialize: function (options) {
        _.extend(this, options);
    },

    render: function () {
        this.$el.html(this.template());

        return this;
    }
});