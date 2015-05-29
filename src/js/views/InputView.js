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
        "click .message-input-send": "onSend",
        "click .message-input-pings": "onPingClick"
    },

    initialize: function () {
        this.listenTo(this.model, "change:editId", this.onEditChange);
        this.listenTo(this.model.get("room").get("pings"), "add remove", this.onPingChange);
    },

    render: function () {
        var data = this.model.toJSON();
        data.user = App.user.toJSON();

        this.$el.html(this.template(data));
        this.input = this.$el.find("textarea").get(0);
        this.onEditChange();

        // FIXME: please come up with a better solution if you have on
        setTimeout(this.adjust.bind(this), 200);
        this.onPingChange(null, this.model.get("room").get("pings"));

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
        event.preventDefault();

        var value = this.input.value;

        if (event.shiftKey) {
            this.insertNewLine();
            return false;
        }

        if (event.ctrlKey) {
            this.submit();
            return false;
        }

        if (value.indexOf("\n") === -1) {
            this.submit();
            return false;
        }

        this.insertNewLine();
        return false;
    },

    insertNewLine: function () {
        var start = this.input.selectionStart;
        var end = this.input.selectionEnd;
        var value = this.input.value;

        var indent = "";
        var lastNewLine = value.lastIndexOf("\n");

        if (lastNewLine > 0) {
            indent = value.substring(lastNewLine + 1);
        } else {
            indent = value;
        }

        indent = indent.replace(/(\S.*)/, "");

        if (indent === "\n") {
            indent = "";
        }

        this.input.value = value.substring(0, start) + "\n" + indent + value.substring(end);
        this.input.selectionStart = this.input.selectionEnd = start + 1 + indent.length;

        this.adjust();
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

            var lineBreakBefore = Math.max(0, before.lastIndexOf("\n") + 1);
            var lineBreakAfter = Math.max(0, after.indexOf("\n"));

            var lineBefore = before.substr(0, lineBreakBefore);
            var lineAfter = after.substr(lineBreakAfter);

            var textToIndent = before.substr(lineBreakBefore)
                + value.substring(start, end)
                + after.substr(0, lineBreakAfter);

            if (event && event.shiftKey) {
                selectStart -= /(^|\n)(\t| {0,4})/.exec(textToIndent)[2].length;

                textToIndent = textToIndent.replace(/(^|\n)(\t| {0,4})/g, "\n");

                if (textToIndent.charAt(0) === "\n") {
                    textToIndent = textToIndent.substr(1);
                }

                this.input.value = lineBefore + textToIndent + lineAfter;
            } else {
                this.input.value = lineBefore + "\t" + textToIndent.replace(/\n/g, "\n\t") + lineAfter;
                selectStart++;
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
            console.log(this.model.get("changed"));

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
        } else {
            this.model.set("changed", true);
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
        } else {
            this.model.set("changed", true);
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

        this.model.get("room").get("pings").each(function (ping) {
            var node = document.getElementById(ping.get("id"));

            if (!node) {
                return;
            }

            var bounds = node.parentNode.getBoundingClientRect();
            var rec = node.getBoundingClientRect();

            if (rec.top >= bounds.top && rec.top < bounds.top + bounds.height
                || rec.bottom > bounds.top && rec.bottom <= bounds.top + bounds.height) {
                App.vent.trigger("socket:send", "ping", {
                    messageId: ping.get("id")
                });
            }
        });

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

        this.model.set("changed", false);
        this.input.focus();
        this.adjust();
    },

    onPingChange: function (model, collection) {
        var count = collection.length;

        var $el = this.$el.find(".message-input-pings").text(count ? count : "");

        if (count) {
            $el.attr("href", "/messages/" + collection.at(0).get("id"));
        }
    },

    onPingClick: function (event) {
        var ping = this.model.get("room").get("pings").clearPing();

        if (ping) {
            var model = this.model.get("room").get("messages").get(ping.get("id"));

            if (model) {
                event.preventDefault();
                window.location.hash = ping.get("id");
                return false;
            }
        }
    }
});