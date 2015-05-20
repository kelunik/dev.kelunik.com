var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("../models/Input");
var Message = require("../models/Message");
var MessageList = require("../models/MessageList");
var Room = require("../models/Room");
var RoomList = require("../models/RoomList");
var InputView = require("./InputView");
var MessageListView = require("./MessageListView");
var RoomListView = require("./RoomListView");

module.exports = Backbone.View.extend({
    el: "main",
    template: require("../templates/chat.handlebars"),

    initialize: function () {
        this.messageList = new MessageList;

        for (var i = 0; i < 30; i++) {
            this.messageList.add(new Message({
                text: "first"
            }));
        }

        var room = new Room;
        room.set("id", 31);

        this.roomList = new RoomList;
        this.roomList.add(room);

        this.messageListView = new MessageListView({collection: this.messageList});
        this.inputView = new InputView({model: new Input});
        this.roomListView = new RoomListView({collection: this.roomList});
    },

    render: function () {
        this.$el.html(this.template());
        this.$el.find(".chat-main").append(this.messageListView.render().el);
        this.$el.find(".chat-main").append(this.inputView.render().el);
        this.$el.find(".chat-rooms").append(this.roomListView.render().el);

        return this;
    }
});