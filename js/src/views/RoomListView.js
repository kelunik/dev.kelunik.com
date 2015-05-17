var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomView = require("./RoomView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "rooms",

    initialize: function () {
        this.collection.on("add", this.renderSingle, this);
    },

    render: function () {
        this.collection.each(function (room) {
            this.renderSingle(room);
        }, this);

        return this;
    },

    renderSingle: function (room) {
        var view = new RoomView({model: room});
        this.$el.append(view.render().el);

        return this;
    }
});