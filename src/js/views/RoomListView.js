var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var App = require("../App");
var RoomView = require("./RoomView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "chat-room-list",

    initialize: function () {
        this.listenTo(this.collection, "add", this.renderAppend);
        this.listenTo(this.collection, "unshift", this.renderPrepend);
    },

    render: function () {
        this.$el.html("");

        this.collection.each(function (room) {
            this.renderAppend(room);
        }, this);

        return this;
    },

    renderAppend: function (room) {
        var view = new RoomView({model: room});
        this.$el.append(view.render().el);

        return this;
    },

    renderPrepend: function (room) {
        var view = new RoomView({model: room});
        this.$el.prepend(view.render().el);

        return this;
    }
});