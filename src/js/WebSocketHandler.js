var Backbone = require("backbone");
var _ = require("backbone/node_modules/underscore");
var $ = require("jquery");

Backbone.$ = $;

module.exports = function (vent, url) {
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

                vent.trigger("socket:open", e);
            };

            self.socket.onerror = function (e) {
                vent.trigger("socket:error", e);
            };

            self.socket.onmessage = function (e) {
                vent.trigger("socket:message", e);
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

                    vent.trigger("socket:reconnectIn", connectTimeout);
                }

                vent.trigger("socket:close", e);
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

    return self;
};