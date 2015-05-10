var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "message-input",
    template: require("./views/input.handlebars"),

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});