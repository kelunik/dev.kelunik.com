var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("../models/Input");
var Message = require("../models/Message");
var MessageList = require("../models/MessageList");
var InputView = require("./InputView");
var MessageListView = require("./MessageListView");

module.exports = Backbone.View.extend({
    el: "body",
    template: require("../templates/chat.handlebars"),

    initialize: function () {
        this.messageList = new MessageList;

        for (var i = 0; i < 30; i++) {
            this.messageList.add(new Message({
                text: "first"
            }));
        }

        this.messageListView = new MessageListView({collection: this.messageList});
        this.inputView = new InputView({model: new Input});

        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        this.$el.find(".chat-main").append(this.messageListView.render().el);
        this.$el.find(".chat-main").append(this.inputView.render().el);
    }
});