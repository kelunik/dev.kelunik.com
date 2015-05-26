var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var App = require("../App");
var RoomView = require("./RoomView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "chat-room-list",

    initialize: function () {
        this.listenTo(this.collection, "add", this.renderSingle);
    },

    render: function () {
        this.$el.html("");

        this.collection.each(function (room) {
            this.renderSingle(room);
        }, this);

        return this;
    },

    renderSingle: function (room) {
        var view = new RoomView({model: room});
        this.$el.append(view.render().el);
        this.collection.trigger("render");

        return this;
    }
});