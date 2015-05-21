var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    el: "main",
    template: require("../templates/unsupportedBrowser.handlebars"),

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});