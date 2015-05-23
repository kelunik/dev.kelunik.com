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
            messages: new MessageList,
            initialPayloadSent: false,
            firstMessage: -1,
            lastMessage: -1,
            firstLoadableMessage: -1,
            transcriptPending: false
        };
    },

    initialize: function () {
        this.listenTo(this.get("messages"), "add", function (message) {
            if (message.get("id") < this.get("firstMessage") || this.get("firstMessage") === -1) {
                this.set("firstMessage", message.get("id"));
            }

            if (message.get("id") > this.get("lastMessage")) {
                this.set("lastMessage", message.get("id"));
            }
        });

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
                time: message.time,
                replyId: message.reply ? message.reply.messageId : null,
                replyUser: message.reply ? message.reply.user.name : null
            };

            this.get("messages").add(message);
        });

        this.listenTo(App.vent, "socket:message:message-edit", function (message) {
            if (message.roomId !== this.get("id")) {
                return;
            }

            message = {
                id: message.messageId,
                authorId: message.user.id,
                authorName: message.user.name,
                authorAvatar: "https://avatars.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                text: message.text,
                time: message.time,
                replyId: message.reply ? message.reply.messageId : null,
                replyUser: message.reply ? message.reply.user.name : null
            };

            this.get("messages").add(message, {merge: true});
        });

        this.listenTo(App.vent, "socket:message:transcript", function (messages) {
            if (messages.roomId !== this.get("id")) {
                return;
            }

            this.set("transcriptPending", false);

            messages.messages.forEach(function (message) {
                message = {
                    id: message.messageId,
                    authorId: message.user.id,
                    authorName: message.user.name,
                    authorAvatar: "https://avatars.githubusercontent.com/u/" + message.user.avatar + "?v=3&s=400",
                    text: message.messageText,
                    time: message.time,
                    replyId: message.reply ? message.reply.messageId : null,
                    replyUser: message.reply ? message.reply.user.name : null
                };

                this.get("messages").unshift(message);
            }.bind(this));

            if (messages.messages.length < 40) {
                this.set("firstLoadableMessage", this.get("firstMessage"));
            }
        });
    }
});