var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
Backbone.$ = $;

var App = require("../App");

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chat-room-member",
    template: require("../templates/member.handlebars"),

    initialize: function () {
        this.listenTo(App.vent, "socket:message:activity", function (data) {
            if (data.userId === this.model.get("id")) {
                this.model.set("state", data.state);
            }
        });

        this.listenTo(this.model, "change:state", this.onStateChange);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    onStateChange: function () {
        this.$el.find(".chat-room-member-state-icon").attr("data-state", this.model.get("state"));
    }
});