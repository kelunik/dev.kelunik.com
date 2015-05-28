var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Ping = require("./Ping");
var App = require("../App");

module.exports = Backbone.Collection.extend({
    model: Ping,

    clearPing: function () {
        if (!this.length) {
            return null;
        }

        App.notificationCount -= this.length;

        var ping = this.shift();

        App.vent.trigger("socket:send", "ping", {
            messageId: ping.get("id")
        });

        App.notificationCount += this.length;
        App.vent.trigger("notification:count", App.notificationCount);

        return ping;
    }
});