var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
Backbone.$ = $;

var App = require("../App");
var Input = require("../models/Input");
var InputView = require("./InputView");
var MessageListView = require("./MessageListView");
var UserListView = require("./UserListView");

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chat-room",
    template: require("../templates/room.handlebars"),

    events: {
        "click .card-head-action-search": "onSearchClick",
        "click .card-head-action-back": "onBackClick",
        "keydown .card-head-input": "onSearchEscape"
    },

    attributes: function () {
        return {
            id: "room-" + this.model.get("id")
        };
    },

    initialize: function () {
        this.memberView = new UserListView({collection: this.model.get("users")});
        this.messageView = new MessageListView({collection: this.model.get("messages")});

        this.input = new Input({
            room: this.model
        });

        this.inputView = new InputView({model: this.input});
        this.listenTo(this.model, "focus", this.onFocus);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        this.$el.find(".chat-main").append(this.messageView.render().el);
        this.$el.find(".chat-main").append(this.inputView.render().el);
        this.$el.find(".chat-info").append(this.memberView.render().el);

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
    },

    onFocus: function () {
        if (this.model.get("initialPayloadSent")) {
            return;
        }

        this.model.set("initialPayloadSent", true);
        this.model.set("transcriptPending", true);

        App.vent.trigger("socket:send", "transcript", {
            roomId: this.model.get("id"),
            direction: "older",
            messageId: -1
        });
    },

    onSearchClick: function () {
        event.preventDefault();
        this.$el.find(".card-head-opt-search").addClass("card-head-opt-visible");
        this.$el.find(".card-head-search-primary input").focus();
        return false;
    },

    onBackClick: function (event) {
        event.preventDefault();
        this.$el.find(".card-head-opt-visible").removeClass("card-head-opt-visible");
        return false;
    },

    onSearchEscape: function (event) {
        if (event.which === 27) {
            event.preventDefault();
            this.$el.find(".card-head-opt-visible").removeClass("card-head-opt-visible");
            this.$el.find(".message-input-text").focus();
            return false;
        }
    }
});