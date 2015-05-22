var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomList = require("./RoomList");

module.exports = Backbone.Model.extend({
    defaults: function () {
        return {
            rooms: new RoomList,
            currentRoom: -1
        };
    }
});