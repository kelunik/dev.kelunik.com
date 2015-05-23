var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageView = require("./MessageView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "messages",
    events: {
        "mouseenter .message": "onMouseEnter",
        "mouseleave .message": "onMouseLeave"
    },

    initialize: function () {
        this.listenTo(this.collection, "add", this.renderSingle);
    },

    render: function () {
        this.collection.each(function (message) {
            this.renderSingle(message);
        }, this);

        return this;
    },

    renderSingle: function (message, collection, options) {
        var scroll;
        var view = new MessageView({model: message});

        if (options.at === 0) {
            scroll = this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
            this.$el.prepend(view.render().el);
            this.el.scrollTop = this.el.scrollHeight - Math.floor(scroll) - this.el.clientHeight;
        } else {
            scroll = this.el.scrollTop >= this.el.scrollHeight - this.el.clientHeight - 10;
            this.$el.append(view.render().el);

            if (scroll) {
                this.el.scrollTop = Math.ceil(this.el.scrollHeight) + 1;
            }
        }
    },

    onMouseEnter: function (event) {
        var el = event.currentTarget;
        var id = el.getAttribute("id");

        var model = this.collection.get(id);

        if (model) {
            var replyTo = model.get("replyId");

            if (replyTo) {
                var replyToNode = document.getElementById(replyTo);
                replyToNode.classList.add("message-highlight");
            }
        }

        document.querySelectorAll(".message[data-reply='" + id + "']").forEach(function (o) {
            o.classList.add("message-highlight");
        });
    },

    onMouseLeave: function (event) {
        var el = event.currentTarget;
        var id = el.getAttribute("id");

        var model = this.collection.get(id);

        if (model) {
            var replyTo = model.get("replyId");

            if (replyTo) {
                var replyToNode = document.getElementById(replyTo);
                replyToNode.classList.remove("message-highlight");
            }
        }

        document.querySelectorAll(".message[data-reply='" + id + "']").forEach(function (o) {
            o.classList.remove("message-highlight");
        });
    }
});