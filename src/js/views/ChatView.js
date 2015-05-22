var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomTabListView = require("./RoomTabListView");
var RoomListView = require("./RoomListView");
var App = require("../App");

module.exports = Backbone.View.extend({
    el: "main",
    template: require("../templates/chat.handlebars"),

    initialize: function () {
        this.listenTo(this.model.get("rooms"), "add", this.switchRoom);
        this.listenTo(this.model, "change", this.switchRoom);

        this.roomTabListView = new RoomTabListView({collection: this.model.get("rooms"), vent: this.vent});
        this.roomListView = new RoomListView({collection: this.model.get("rooms"), vent: this.vent});
    },

    render: function () {
        this.$el.html(this.template());
        this.$el.find(".chat-room-tabs").append(this.roomTabListView.render().el);
        this.$el.find(".chat-rooms").append(this.roomListView.render().el);

        return this;
    },

    switchRoom: function () {
        var roomId = this.model.get("currentRoom");

        $(".chat-room-current").removeClass("chat-room-current");
        $("#room-" + roomId).addClass("chat-room-current");
    }
});