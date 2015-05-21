var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomTabListView = require("./RoomTabListView");
var RoomListView = require("./RoomListView");

module.exports = Backbone.View.extend({
    el: "main",
    template: require("../templates/chat.handlebars"),

    initialize: function (options) {
        this.vent = options.vent;
        this.roomTabListView = new RoomTabListView({collection: this.model.get("rooms"), vent: this.vent});
        this.roomListView = new RoomListView({collection: this.model.get("rooms"), vent: this.vent});
    },

    render: function () {
        this.$el.html(this.template());
        this.$el.find(".chat-room-tabs").append(this.roomTabListView.render().el);
        this.$el.find(".chat-rooms").append(this.roomListView.render().el);

        return this;
    },

    switchRoom: function (roomId) {
        $(".chat-room-current").removeClass("chat-room-current");
        $("#room-" + roomId).addClass("chat-room-current");
    }
});