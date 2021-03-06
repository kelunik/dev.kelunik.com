var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var App = require("../App");

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "message",
    template: require("../templates/message.handlebars"),
    replyTemplate: require("../templates/messageReply.handlebars"),

    events: {
        "click .in-reply": "onReplyClick",
        "click": "onClick"
    },

    attributes: function () {
        return {
            "id": this.model.get("id"),
            "data-reply": this.model.get("replyId")
        };
    },

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(App.user, "change:id", function () {
            if (App.user.get("id") === this.model.get("authorId")) {
                this.el.classList.add("message-own");
            }
        });
    },

    render: function () {
        var scroll = 0;

        if (this.el.parentNode) {
            scroll = this.el.parentNode.scrollHeight - this.el.parentNode.scrollTop;
        }

        var data = this.model.toJSON();
        data.text = data.text.replace(/^:\d+ ?/g, "");

        var fragment = document.createDocumentFragment();
        fragment.innerHTML = this.template(data);

        this.$el.html(fragment.innerHTML);

        var content = this.el.querySelector(".message-content");

        if (data.replyId) {
            $(content).find("p").prepend(this.replyTemplate({
                replyId: data.replyId,
                replyUserId: data.replyUserId,
                replyUserName: data.replyUserName,
                highlight: data.replyUserId === App.user.get("id")
            }));
        }

        content.querySelectorAll("img").forEach(function (img) {
            // currently we can't allow images, because they're mixed content,
            // which we want to avoid, sorry. Just replace those images with a link.

            var link = document.createElement("a");

            link.href = img.src;
            link.textContent = img.src;

            img.parentNode.replaceChild(link, img);
        });

        content.getElementsByTagName("a").forEach(function (o) {
            if (o.host !== window.location.host) {
                o.setAttribute("target", "_blank");
            }
        });

        if (App.user.get("id") === this.model.get("authorId")) {
            this.el.classList.add("message-own");
        }

        this.onSelectionChange();
        this.onPendingChange();

        if (this.el.parentNode) {
            this.el.parentNode.scrollTop = this.el.parentNode.scrollHeight - scroll;
        }

        return this;
    },

    onPendingChange: function () {
        if (this.model.get("pending")) {
            this.$el.addClass("message-pending");
        } else {
            this.$el.removeClass("message-pending");
        }
    },

    onReplyClick: function (event) {
        var id = this.model.get("replyId");
        var node = document.getElementById(id);

        if (node) {
            event.preventDefault();
            window.location.hash = id;
            return false;
        }
    },

    onClick: function (event) {
        if (event.target.nodeName === "A") {
            return;
        }

        event.preventDefault();

        this.model.set("selected", !this.model.get("selected"));

        return false;
    },

    onSelectionChange: function () {
        if (this.model.get("selected")) {
            this.el.classList.add("message-selected");
        } else {
            this.el.classList.remove("message-selected");
        }
    }
});