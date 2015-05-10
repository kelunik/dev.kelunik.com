var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Message = require("./Message");

module.exports = Backbone.Collection.extend({
    model: Message
});