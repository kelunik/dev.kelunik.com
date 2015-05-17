var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.View.extend({
    tagName: "a",
    className: "chat-room",
    template: require("../templates/room.handlebars"),

    initialize: function () {

    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.attr("href", "/rooms/" + this.model.get('id'));

        return this;
    }
});