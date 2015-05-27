var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");
var App = require("../App");
var UserList = require("./UserList");
var PingList = require("./PingList");

module.exports = Backbone.Collection.extend({
    model: Room,

    initialize: function () {
        var self = this;

        this.listenTo(App.vent, "socket:message:whereami", function (rooms) {
            rooms.forEach(function (room) {
                var users = room.users;
                var pings = room.pings;

                room.users = new UserList;
                room.pings = new PingList;

                users.forEach(function (user) {
                    room.users.add(user);
                });

                pings.forEach(function(ping) {
                    room.pings.add({
                        id: ping
                    });
                });

                self.add(room);
            });
        });
    }
});