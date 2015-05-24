var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
Backbone.$ = $;

var App = require("../App");

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chat-room-member",
    template: require("../templates/member.handlebars"),

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }
});