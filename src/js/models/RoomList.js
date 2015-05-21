var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");

module.exports = Backbone.Collection.extend({
    model: Room,

    initialize: function (vent) {
        this.listenTo(vent, "socket:message:message", function (message) {
            var room = this.findWhere({"id": message.roomId});

            message = {
                id: message.messageId,
                authorId: message.user.id,
                authorName: message.user.name,
                authorAvatar: "https://avatars0.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                text: message.messageText,
                html: message.messageText,
                time: message.time
            };

            if (room) {
                room.get("messages").add(message);
            }
        }.bind(this));
    }
});