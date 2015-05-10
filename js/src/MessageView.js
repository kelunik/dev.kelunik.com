var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "message",
    template: require("./views/message.handlebars"),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});