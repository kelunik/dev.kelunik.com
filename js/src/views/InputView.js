var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "message-input",
    template: require("../templates/input.handlebars"),

    events: {
        "input .message-input-text": "onInput"
    },

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$el.find("textarea").get(0);

        return this;
    },

    onInput: function () {
        var toScroll = [];
        var $messages = $(".messages");

        $messages.each(function (i, o) {
            toScroll.push(o.scrollHeight - o.scrollTop - o.clientHeight);
        });

        var scroll = this.input.scrollTop;

        this.input.style.height = "0";

        // use + 1 to prevent zoom issues
        var height = this.input.scrollHeight + 1;

        this.input.style.height = Math.max(26, height) + "px";
        this.input.scrollTop = scroll;

        // reset scroll positions using
        // the height of the non-visible bottom part
        $messages.each(function (i, o) {
            var scroll = toScroll.shift();
            o.scrollTop = o.scrollHeight - o.clientHeight - scroll;
        });
    }
});