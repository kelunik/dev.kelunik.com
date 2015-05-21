var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomList = require("./RoomList");

module.exports = Backbone.Model.extend({
    defaults: {
        rooms: null
    }
});