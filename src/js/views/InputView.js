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
        this.listenTo(this.model, "change:isEdit", function () {
            if (this.model.get("isEdit")) {
                this.$el.addClass("message-input-edit");
            } else {
                this.$el.removeClass("message-input-edit");
            }
        });
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
        switch (event.which) {
            case 27:
                return this.onEscape(event);
            case 13:
                return this.onEnter(event);
            case 9:
                return this.onTab(event);
            case 38:
                return this.onArrowUp(event);
            case 40:
                return this.onArrowDown(event);
        }
    },

    onSend: function (event) {
        event.preventDefault();
        this.submit();

        return false;
    },

    onEscape: function (event) {
        event.preventDefault();

        this.model.set("isEdit", false);
        this.input.value = "";
        this.input.focus();

        return false;
    },

    onEnter: function (event) {
        var value = this.input.value;

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

    onArrowUp: function (event) {
        var messages = this.model.get("room").get("messages");

        if (event.ctrlKey || event.altKey) {
            var currentId = this.model.get("replyTo");
            var currentModel = messages.get(currentId);
            var currentIndex = currentModel ? messages.indexOf(currentModel) : null;
            var previousIndex;

            if (currentIndex) {
                previousIndex = currentIndex - 1;
            } else {
                previousIndex = messages.length - 1;
            }

            var previousModel = messages.at(previousIndex);

            if (previousModel) {
                event.preventDefault();
                this.replyTo(previousModel.get("id"));
                return false;
            }
        }
    },

    onArrowDown: function (event) {
        var messages = this.model.get("room").get("messages");

        if (event.ctrlKey || event.altKey) {
            var currentId = this.model.get("replyTo");
            var currentModel = messages.get(currentId);
            var currentIndex = currentModel ? messages.indexOf(currentModel) : null;

            if (!currentIndex) {
                return;
            }

            event.preventDefault();

            var nextIndex = currentIndex + 1;
            var nextModel = messages.at(nextIndex);

            this.replyTo(nextModel ? nextModel.get("id") : null);

            return false;
        }
    },

    replyTo: function (id) {
        var value = this.input.value;

        if (id) {
            var reply = this.model.get("replyTo");

            if (reply) {
                this.input.value = value.replace(":" + reply, ":" + id);
            } else {
                this.input.value = ":" + id + " " + value;
            }
        } else {
            this.input.value = value.replace(/^:\d+ ?/, "");
        }

        this.model.set("replyTo", id);

        this.input.focus();
        this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
        this.adjust();
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