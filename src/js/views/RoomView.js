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

    initialize: function (options) {
        this.vent = options.vent;
        this.messageView = new MessageListView({collection: this.model.get("messages")});

        this.input = new Input({
            room: this.model
        });

        this.inputView = new InputView({model: this.input, vent: this.vent});
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        this.$el.find(".chat-main").append(this.messageView.render().el);
        this.$el.find(".chat-main").append(this.inputView.render().el);

        return this;
    }
});