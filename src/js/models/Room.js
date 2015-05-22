var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageList = require("./MessageList");
var App = require("../App");

module.exports = Backbone.Model.extend({
    defaults: function () {
        return {
            id: 0,
            name: "",
            image: "",
            messages: new MessageList
        };
    },

    initialize: function () {
        this.listenTo(App.vent, "socket:message:message", function (message) {
            if (message.roomId !== this.get("id")) {
                return;
            }

            message = {
                id: message.messageId,
                authorId: message.user.id,
                authorName: message.user.name,
                authorAvatar: "https://avatars.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                text: message.messageText,
                time: message.time
            };

            this.get("messages").add(message);
        }.bind(this));

        this.listenTo(App.vent, "socket:message:transcript", function (messages) {
            if (messages.roomId !== this.get("id")) {
                return;
            }

            messages.messages.reverse().forEach(function (message) {
                message = {
                    id: message.messageId,
                    authorId: message.user.id,
                    authorName: message.user.name,
                    authorAvatar: "https://avatars.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                    text: message.messageText,
                    time: message.time
                };

                this.get("messages").unshift(message);
            }.bind(this));
        }.bind(this));
    }
});