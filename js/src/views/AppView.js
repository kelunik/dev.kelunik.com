var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Input = require("../models/Input");
var Message = require("../models/Message");
var MessageList = require("../models/MessageList");
var Room = require("../models/Room");
var RoomList = require("../models/RoomList");
var InputView = require("./InputView");
var MessageListView = require("./MessageListView");
var RoomListView = require("./RoomListView");

module.exports = Backbone.View.extend({
    el: "body",
    template: require("../templates/app.handlebars"),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
    },

    setView: function (view) {
        this.$el.find("main").html("");
        this.$el.find("main").append(view.render().el);
    }
});