var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
Backbone.$ = $;

var App = require("../App");
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

        // attach event handler here, because we need room's properties
        this.$el.find(".messages").on("scroll", _.throttle(this.onScroll.bind(this), 250));

        return this;
    },

    onScroll: function (event) {
        var el = event.target;

        if (this.model.get("transcriptPending")
            || this.model.get("firstLoadableMessage") >= this.model.get("firstMessage")
            && this.model.get("firstLoadableMessage") !== -1) {
            return;
        }

        if (el.scrollTop < 600) {
            this.model.set("transcriptPending", true);
            App.vent.trigger("socket:send", "transcript", {
                roomId: this.model.get("id"),
                direction: "older",
                messageId: this.model.get("firstMessage")
            });
        }
    }
});