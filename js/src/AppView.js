var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("./Input");
var InputView = require("./InputView");
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