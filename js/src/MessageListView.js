var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageView = require("./MessageView");

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "messages",

    initialize: function () {
        this.collection.on("add", this.renderSingle, this);
    },

    render: function () {
        this.collection.each(function (message) {
            this.renderSingle(message);
        }, this);

        return this;
    },

    renderSingle: function (message) {
        var scroll = this.el.classList.contains("messages-active") && this.el.scrollTop >= this.el.scrollHeight - this.el.clientHeight - 1;

        var view = new MessageView({model: message});
        this.$el.append(view.render().el);

        if (scroll) {
            this.el.scrollTop = this.el.scrollHeight;
        }
    }
});