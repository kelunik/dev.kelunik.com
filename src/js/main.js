if (window.top != window.self) {
    window.top.location.href = window.location.href;
} else {
    var Backbone = require("backbone");
    var Router = require("./Router");
    var $ = require("jquery");
    var _ = require("backbone/node_modules/underscore");

    Backbone.$ = $;

    var AppView = require("./views/AppView");
    var ChatView = require("./views/ChatView");
    var UnsupportedBrowserView = require("./views/UnsupportedBrowserView");
    var Chat = require("./models/Chat");
    var Message = require("./models/Message");
    var Browser = require("./models/Browser");
    var RoomList = require("./models/RoomList");
    var PingManager = require("./PingManager");
    var WebSocketHandler = require("./WebSocketHandler");

    var vent = _.extend({}, Backbone.Events);
    var router = new Router;
    var appView = new AppView;
    var pingManager = new PingManager(vent);

    if (typeof WebSocket === "undefined") {
        appView.setView(new UnsupportedBrowserView({
            model: new Browser
        }));

        return;
    }

    // Chrome might need a user action for that
    window.addEventListener("load", function () {
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    });

    var webSocketHandler = new WebSocketHandler(vent, "wss://dev.kelunik.com/chat");
    webSocketHandler.connect();

    router.on("route:defaultRoute", function () {
        setTimeout(function () {
            Backbone.history.navigate("/rooms/1", true);
        }, 1500);
    });

    router.on("route:room", function (roomId) {
        var view = appView.getView();

        if (view instanceof ChatView) {
            view.switchRoom(roomId);
        } else {
            var chat = new Chat({
                rooms: new RoomList([], {
                    vent: vent
                })
            });

            console.log(chat.get("rooms"));

            var chatView = new ChatView({model: chat, vent: vent});
            appView.setView(chatView);

            chatView.switchRoom(roomId);

            vent.trigger("socket:send", "whereami", {join: roomId});
        }
    });

    Backbone.history.start({pushState: true});

    $(document).on("click", "a[href^='/']", function (event) {
        var href = $(event.currentTarget).attr("href");

        if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();

            var url = href.replace(/^\//, '');
            Backbone.history.navigate(url, true);

            return false;
        }
    });
}