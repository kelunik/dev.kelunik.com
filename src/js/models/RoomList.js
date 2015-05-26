var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");
var App = require("../App");
var UserList = require("./UserList");

module.exports = Backbone.Collection.extend({
    model: Room,

    initialize: function () {
        var self = this;

        this.listenTo(App.vent, "socket:message:whereami", function (rooms) {
            rooms.forEach(function (room) {
                var users = room.users;

                room.users = new UserList;

                users.forEach(function (user) {
                    room.users.add(user);
                });

                self.add(room);
            });
        });
    }
});