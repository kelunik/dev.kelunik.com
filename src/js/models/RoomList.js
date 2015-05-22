var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");
var App = require("../App");

module.exports = Backbone.Collection.extend({
    model: Room,

    initialize: function () {
        var self = this;

        this.listenTo(App.vent, "socket:message:whereami", function (rooms) {
            rooms.forEach(function (room) {
                self.add(room);

                App.vent.trigger("socket:send", "transcript", {
                    roomId: room.id,
                    direction: "older",
                    messageId: -1
                });
            });
        });
    }
});