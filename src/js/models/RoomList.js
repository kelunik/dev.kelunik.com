var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");

module.exports = Backbone.Collection.extend({
    model: Room,

    initialize: function (models, options) {
        this.vent = options.vent;

        this.listenTo(this.vent, "socket:message:message", function (message) {
            var room = this.get(message.roomId);

            message = {
                id: message.messageId,
                authorId: message.user.id,
                authorName: message.user.name,
                authorAvatar: "https://avatars0.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                text: message.messageText,
                time: message.time
            };

            if (room) {
                room.get("messages").add(message);
            }
        }.bind(this));

        this.listenTo(this.vent, "socket:message:transcript", function (messages) {
            var room = this.get(messages.roomId);

            if (room) {
                messages.messages.reverse().forEach(function (message) {
                    message = {
                        id: message.messageId,
                        authorId: message.user.id,
                        authorName: message.user.name,
                        authorAvatar: "https://avatars0.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                        text: message.messageText,
                        time: message.time
                    };

                    room.get("messages").unshift(message);
                });
            }
        }.bind(this));
    }
});