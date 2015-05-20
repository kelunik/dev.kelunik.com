var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chat-room-tab",
    template: require("../templates/roomTab.handlebars"),

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});