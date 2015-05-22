var Util = require("../Util");
var App = require("../App");
var Backbone = require("backbone");
var _ = require("backbone/node_modules/underscore");
var $ = require("jquery");

Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "section",
    className: "message-input",
    template: require("../templates/input.handlebars"),

    events: {
        "input .message-input-text": "onInput",
        "keydown .message-input-text": "onKeyDown",
        "click .message-input-send": "onSend"
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$el.find("textarea").get(0);

        if (this.model.get("isEdit")) {
            this.$el.addClass("message-input-edit");
        } else {
            this.$el.removeClass("message-input-edit");
        }

        return this;
    },

    onInput: function () {
        _.throttle(this.adjust(), 250);
    },

    onKeyDown: function (event) {
        var value = this.input.value;

        if (event.which === 27) {
            event.preventDefault();

            this.model.set("isEdit", false);
            this.input.value = "";
            this.input.focus();

            return false;
        } else if (event.which === 13) {
            if (event.shiftKey) {
                return;
            }

            if (event.ctrlKey) {
                event.preventDefault();
                this.submit();

                return false;
            }

            if (value.indexOf("\n") === -1) {
                event.preventDefault();
                this.submit();

                return false;
            }
        } else if (event.which === 9) {
            return this.onTab(event);
        }
    },

    onSend: function (event) {
        event.preventDefault();
        this.submit();

        return false;
    },

    onTab: function (event) {
        event.preventDefault();

        var start = this.input.selectionStart;
        var end = this.input.selectionEnd;
        var value = this.input.value;
        var before = value.substr(0, start);
        var after = value.substr(end);

        if (start === end) {
            this.input.value = before + "\t" + after;
            this.input.selectionStart = this.input.selectionEnd = start + 1;
        } else {
            var selectStart = start;

            var line_before = before.substr(0, Math.max(0, before.lastIndexOf("\n") + 1));
            var line_after = after.substr(Math.max(0, after.indexOf("\n")));
            var text_to_indent = before.substr(Math.max(0, before.lastIndexOf("\n") + 1))
                + value.substring(start, end)
                + after.substr(0, Math.max(0, after.indexOf("\n")));

            if (event && event.shiftKey) {
                selectStart -= /(^|\n)(\t| {0,4})/g.exec(text_to_indent)[2].length;

                text_to_indent = text_to_indent.replace(/(^|\n)(\t| {0,4})/g, "\n");

                if (text_to_indent.indexOf("\n") === 0) { // TODO: Just get first char and compare
                    text_to_indent = text_to_indent.substr(1);
                }

                this.input.value = line_before + text_to_indent + line_after;
            } else {
                selectStart++;

                this.input.value = line_before + "\t" + text_to_indent.replace(/\n/g, "\n\t") + line_after;
            }

            this.input.selectionStart = selectStart;
            this.input.selectionEnd = this.input.value.length - after.length;
        }

        return false;
    },

    submit: function () {
        var roomId = this.model.get("room").get("id");
        var text = this.input.value;

        App.vent.trigger("socket:send", "message", {
            roomId: roomId,
            text: text,
            tempId: Util.generateToken(20)
        });

        this.input.value = "";
        this.input.focus();

        this.adjust();
    },

    adjust: function () {
        var toScroll = [];
        var $messages = this.$el.parent().find(".messages");

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