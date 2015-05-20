var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageList = require("./MessageList");

module.exports = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "",
        image: ""
    },

    initialize: function () {
        // otherwise we end up with the same
        // MessageList object for every room
        this.set("messages", new MessageList);
    }
});