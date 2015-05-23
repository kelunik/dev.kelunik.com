var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "div",
    className: "message",
    template: require("../templates/message.handlebars"),
    replyTemplate: require("../templates/messageReply.handlebars"),
    attributes: function () {
        return {
            tabindex: "0",
            "id": this.model.get("id")
        };
    },
    events: {
        "click .in-reply": "onReplyClick"
    },

    initialize: function () {

    },

    render: function () {
        var data = this.model.toJSON();
        data.text = data.text.replace(/^:\d+ ?/g, "");

        var fragment = document.createDocumentFragment();
        fragment.innerHTML = this.template(data);

        fragment.querySelectorAll("img").forEach(function (img) {
            // currently we can't allow images, because they're mixed content,
            // which we want to avoid, sorry. Just replace those images with a link.
            var link = document.createElement("a");
            link.href = img.src;
            link.textContent = img.src;
            img.parentNode.replaceChild(link, img);
        });

        /* DocumentFragment doesn't have getElementsByTagName */
        fragment.querySelectorAll("a").forEach(function (o) {
            if (o.host !== window.location.host) {
                o.setAttribute("target", "_blank");
            }
        });

        this.$el.html(fragment.innerHTML);

        var content = this.el.querySelector(".message-content");

        if (data.replyId) {
            $(content).find("p").prepend(this.replyTemplate({
                id: data.replyId,
                name: data.replyUser
            }));
        }

        return this;
    },

    onReplyClick: function (event) {
        var id = this.model.get("replyId");
        var node = document.getElementById(id);

        if (node) {
            event.preventDefault();
            window.location.hash = id;
            return false;
        }
    }
});