var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var User = require("./User");

module.exports = Backbone.Collection.extend({
    model: User
});