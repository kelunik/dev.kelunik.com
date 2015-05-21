var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var MessageList = require("./MessageList");

module.exports = Backbone.Model.extend({
    defaults: function () {
        return {
            id: 0,
            name: "",
            image: "",
            messages: new MessageList
        };
    }
});