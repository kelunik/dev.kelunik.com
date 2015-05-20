var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("../models/Input");
var Message = require("../models/Message");

module.exports = Backbone.View.extend({
    el: "body",
    template: require("../templates/app.handlebars"),
    view: null,

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
    },

    getView: function () {
        return this.view;
    },

    setView: function (view) {
        this.view = view;

        this.$el.find("main").html("");
        this.$el.find("main").append(view.render().el);
    }
});