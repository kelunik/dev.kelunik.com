var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomView = require("./RoomView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "chat-room-list",

    initialize: function (options) {
        this.vent = options.vent;
        this.listenTo(this.vent, "socket:message:whereami", this.refresh);
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
        var view = new RoomView({model: room, vent: this.vent});
        this.$el.append(view.render().el);

        return this;
    },

    renderPrepend: function (room) {
        var view = new RoomView({model: room, vent: this.vent});
        this.$el.prepend(view.render().el);

        return this;
    },

    refresh: function (rooms) {
        rooms.forEach(function (room) {
            this.collection.add(room);

            this.vent.trigger("socket:send", "transcript", {
                roomId: room.id,
                direction: "older",
                messageId: -1
            });
        }.bind(this));
    }
});