var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageView = require("./MessageView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "messages",

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
            this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight - scroll;
        } else {
            scroll = this.el.scrollTop >= this.el.scrollHeight - this.el.clientHeight - 1;
            this.$el.append(view.render().el);

            if (scroll) {
                this.el.scrollTop = this.el.scrollHeight;
            }
        }
    }
});