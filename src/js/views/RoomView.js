var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("../models/Input");
var InputView = require("./InputView");
var MessageListView = require("./MessageListView");

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chat-room",
    template: require("../templates/room.handlebars"),

    attributes: function () {
        return {
            id: "room-" + this.model.get("id")
        };
    },

    initialize: function () {
        this.messageView = new MessageListView({collection: this.model.get("messages")});

        this.input = new Input;
        this.inputView = new InputView({model: this.input});
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        this.$el.find(".chat-main").append(this.messageView.render().el);
        this.$el.find(".chat-main").append(this.inputView.render().el);

        return this;
    }
});