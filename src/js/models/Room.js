var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageList = require("./MessageList");
var UserList = require("./UserList");
var PingList = require("./PingList");
var App = require("../App");

module.exports = Backbone.Model.extend({
    defaults: function () {
        return {
            id: 0,
            name: "",
            image: "",
            messages: new MessageList,
            users: new UserList,
            pings: new PingList,
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
                replyUserId: message.reply ? message.reply.user.id : null,
                replyUserName: message.reply ? message.reply.user.name : null,
                token: message.token
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
                replyUserId: message.reply ? message.reply.user.id : null,
                replyUserName: message.reply ? message.reply.user.name : null,
                pending: false
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
                    replyUserId: message.reply ? message.reply.user.id : null,
                    replyUserName: message.reply ? message.reply.user.name : null
                };

                this.get("messages").unshift(message);
            }.bind(this));

            if (messages.messages.length < 40) {
                this.set("firstLoadableMessage", this.get("firstMessage"));
            }
        });

        this.listenTo(App.vent, "socket:message:ping", function (ping) {
            if (ping.roomId !== this.get("id")) {
                return;
            }

            App.notificationCount -= this.get("pings").length;

            this.get("pings").add({
                id: ping.messageId
            });

            App.notificationCount += this.get("pings").length;

            App.vent.trigger("chat:ping", this, ping.user);
            App.vent.trigger("notification:count", App.notificationCount);
        });

        this.listenTo(App.vent, "socket:message:ping-clear", function (ping) {
            var model = this.get("pings").get(ping.messageId);

            App.notificationCount -= this.get("pings").length;

            if (model) {
                this.get("pings").remove(model);
            }

            App.notificationCount += this.get("pings").length;

            App.vent.trigger("notification:count", App.notificationCount);
        });
    }
});