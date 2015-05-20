var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "message",
    template: require("../templates/message.handlebars"),

    initialize: function () {
        
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr("tabindex", "0");

        return this;
    }
});