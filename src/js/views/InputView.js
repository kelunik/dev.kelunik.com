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
        this.listenTo(this.model, "change:editId", this.onEditChange);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$el.find("textarea").get(0);
        this.onEditChange();

        return this;
    },

    onEditChange: function () {
        if (this.model.get("editId")) {
            this.$el.addClass("message-input-edit");
        } else {
            this.$el.removeClass("message-input-edit");
        }
    },

    onInput: function () {
        this.model.set("changed", true);

        var match = /^:(\d+)/.exec(this.input.value);

        if (match && 1 * match[1] !== this.model.get("replyTo")) {
            this.replyTo(null);
        }

        this.adjust();
    },

    onKeyDown: function (event) {
        switch (event.which) {
            case 27:
                return this.onEscape(event);
            case 13:
                return this.onEnter(event);
            case 9:
                return this.onTab(event);
            case 37:
                return this.onArrowLeft(event);
            case 38:
                return this.onArrowUp(event);
            case 39:
                return this.onArrowRight(event);
            case 40:
                return this.onArrowDown(event);
        }
    },

    onArrowLeft: function () {
        this.model.set("changed", true);
    },

    onArrowRight: function () {
        this.model.set("changed", true);
    },

    onSend: function (event) {
        event.preventDefault();
        this.submit();

        return false;
    },

    onEscape: function (event) {
        event.preventDefault();

        this.replyTo(null);
        this.edit(null);

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
        var currentId, currentModel, currentIndex, previousIndex, previousModel;

        if (event.ctrlKey || event.altKey) {
            currentId = this.model.get("replyTo");
            currentModel = messages.get(currentId);
            currentIndex = currentModel ? messages.indexOf(currentModel) : null;

            if (currentIndex) {
                previousIndex = currentIndex - 1;
            } else {
                previousIndex = messages.length - 1;
            }

            previousModel = messages.at(previousIndex);

            if (previousModel) {
                event.preventDefault();
                this.replyTo(previousModel.get("id"));
                return false;
            }
        } else if (!event.shiftKey) {
            if (this.model.get("changed") && this.input.value !== "") {
                return;
            }

            var filter = messages.where({authorId: App.user.get("id")});
            currentId = this.model.get("editId");
            currentModel = messages.get(currentId);
            currentIndex = currentModel ? filter.indexOf(currentModel) : null;

            if (currentIndex) {
                previousIndex = currentIndex - 1;
            } else {
                previousIndex = filter.length - 1;
            }

            previousModel = filter[previousIndex];

            if (previousModel) {
                event.preventDefault();
                this.edit(previousModel.get("id"));
                return false;
            }
        }
    },

    onArrowDown: function (event) {
        var messages = this.model.get("room").get("messages");
        var currentId, currentModel, currentIndex, nextIndex, nextModel;

        if (event.ctrlKey || event.altKey) {
            currentId = this.model.get("replyTo");
            currentModel = messages.get(currentId);
            currentIndex = currentModel ? messages.indexOf(currentModel) : null;

            if (!currentIndex) {
                return;
            }

            event.preventDefault();

            nextIndex = currentIndex + 1;
            nextModel = messages.at(nextIndex);

            this.replyTo(nextModel ? nextModel.get("id") : null);

            return false;
        } else if (!event.shiftKey) {
            if (this.model.get("changed") && this.input.value !== "") {
                return;
            }

            var filter = messages.where({authorId: App.user.get("id")});
            currentId = this.model.get("editId");
            currentModel = messages.get(currentId);
            currentIndex = currentModel ? filter.indexOf(currentModel) : null;

            if (!currentIndex) {
                return;
            }

            event.preventDefault();

            nextIndex = currentIndex + 1;
            nextModel = filter[nextIndex];

            this.edit(nextModel ? nextModel.get("id") : null);

            return false;
        }
    },

    replyTo: function (id) {
        var value = this.input.value;
        var reply = this.model.get("replyTo");

        if (reply === id) {
            return;
        }

        var selectionStart = this.input.selectionStart;
        var selectionEnd = this.input.selectionEnd;
        var length = value.length;

        value = value.replace(/^:\d+ ?/, "");

        if (id) {
            if (reply) {
                document.getElementById(reply).classList.remove("input-reply");
            }

            this.input.value = ":" + id + " " + value;

            document.getElementById(id).classList.add("input-reply");
        } else {
            if (reply) {
                document.getElementById(reply).classList.remove("input-reply");
            }
        }

        this.model.set("replyTo", id);
        this.model.set("changed", true);

        var changedLength = this.input.value.length - length;

        this.input.focus();
        this.input.selectionStart = selectionStart + changedLength;
        this.input.selectionEnd = selectionEnd + changedLength;
        this.adjust();
    },

    submit: function () {
        var text = this.input.value.trim();

        if (text === "") {
            this.replyTo(null);
            this.edit(null);

            return;
        }

        var roomId = this.model.get("room").get("id");
        var edit = this.model.get("editId");
        var token = Util.generateToken(20);

        if (edit) {
            var model = this.model.get("room").get("messages").get(edit);

            if (model.get("text").trim() === text) {
                this.replyTo(null);
                this.edit(null);
                return;
            }

            App.vent.trigger("socket:send", "message-edit", {
                messageId: edit,
                text: text,
                tempId: token
            });

            this.edit(null);
        } else {
            App.vent.trigger("socket:send", "message", {
                roomId: roomId,
                text: text,
                tempId: token
            });

            // TODO clear visible pings
        }

        this.model.set("changed", false);

        this.input.value = "";
        this.input.focus();

        this.replyTo(null);
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
    },

    edit: function (id) {
        this.model.set("changed", false);

        if (id) {
            var model = this.model.get("room").get("messages").get(id);

            if (model) {
                this.input.value = model.get("text");
                this.model.set("editId", id);

                var match = /^:(\d+)/.exec(this.input.value);

                if (match) {
                    this.replyTo(match[1]);
                }
            } else {
                this.input.value = "";
                this.model.set("editId", null);
            }
        } else {
            this.input.value = "";
            this.model.set("editId", null);
        }

        this.input.focus();
        this.adjust();
    }
});