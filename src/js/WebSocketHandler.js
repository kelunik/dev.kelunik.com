var Backbone = require("backbone");
var _ = require("backbone/node_modules/underscore");
var $ = require("jquery");
var App = require("./App");

Backbone.$ = $;

module.exports = function (url) {
    var self = {
        connected: false,
        explicitlyClosed: false,
        socket: null,
        queue: [],
        retries: 0,

        connect: function () {
            if (self.socket) {
                return;
            }

            self.socket = new WebSocket(url);

            self.socket.onopen = function (e) {
                self.connected = true;
                self.retries = 0;

                var queue = self.queue;
                self.queue = [];

                if (queue.length > 0) {
                    App.vent.trigger("socket:send", "lost-push", queue);
                }

                App.vent.trigger("socket:open", e);
            };

            self.socket.onerror = function (e) {
                App.vent.trigger("socket:error", e);
            };

            self.socket.onmessage = function (e) {
                App.vent.trigger("socket:message", e);
            };

            self.socket.onclose = function (e) {
                self.connected = false;
                self.socket = null;

                if (!self.explicitlyClosed) {
                    self.retries++;

                    var connectTimeout = 1 << Math.min(8, self.retries) * 1000;

                    setTimeout(function () {
                        self.connect();
                    }, connectTimeout);

                    App.vent.trigger("socket:reconnectIn", connectTimeout);
                }

                App.vent.trigger("socket:close", e);
            };
        },

        disconnect: function () {
            self.explicitlyClosed = true;

            if (self.socket) {
                self.socket.close();
                self.socket = null;
            }
        }
    };

    App.vent.on("socket:send", function (type, data) {
        if (self.connected) {
            self.socket.send(JSON.stringify({
                type: type,
                data: data
            }));

            console.log(" → out  ", type, data);
        } else {
            if (type === "lost-push") {
                data.forEach(function (o) {
                    self.queue.push(o);
                });
            } else {
                self.queue.push({
                    type: type,
                    data: data
                });
            }
        }
    });

    App.vent.on("socket:message", function (event) {
        var payload = null;

        try {
            payload = JSON.parse(event.data);
        } catch (e) {
            console.log("Invalid socket message", event);

            return;
        }

        if (payload === null || !"type" in payload) {
            console.log("Invalid socket payload", payload);

            return;
        }

        console.log(" ← in   ", payload.type, payload.data || null);

        App.vent.trigger("socket:message:" + payload.type, payload.data || null);
    });

    return self;
};