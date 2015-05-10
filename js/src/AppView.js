var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageList = require("./MessageList");
var MessageListView = require("./MessageListView");
var Message = require("./Message");

module.exports = Backbone.View.extend({
    el: "body",
    template: require("./views/chat.handlebars"),

    initialize: function () {
        this.messageList = new MessageList;

        this.messageList.add(new Message({
            text: "first"
        }));

        setInterval(function () {
            this.messageList.add(new Message({
                text: "next"
            }));
        }.bind(this), 200);

        this.messageListView = new MessageListView({collection: this.messageList});

        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.$el.find(".messages").replaceWith(this.messageListView.render().el);
    }
});