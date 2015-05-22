if (window.top != window.self) {
    window.top.location.href = window.location.href;
} else {
    var Backbone = require("backbone");
    var $ = require("jquery");
    var _ = require("backbone/node_modules/underscore");

    Backbone.$ = $;

    var ChatView = require("./views/ChatView");
    var UnsupportedBrowserView = require("./views/UnsupportedBrowserView");
    var Chat = require("./models/Chat");
    var Message = require("./models/Message");
    var Browser = require("./models/Browser");
    var RoomList = require("./models/RoomList");
    var WebSocketHandler = require("./WebSocketHandler");
    var Router = require("./Router");
    var AppView = require("./views/AppView");
    var PingManager = require("./PingManager");
    var App = require("./App");

    App.router = new Router;
    App.appView = new AppView;
    App.pingManager = new PingManager;

    if (typeof WebSocket === "undefined") {
        App.appView.setView(new UnsupportedBrowserView({
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

    var webSocketHandler = new WebSocketHandler("wss://dev.kelunik.com/chat");
    webSocketHandler.connect();

    App.router.on("route:defaultRoute", function () {
        setTimeout(function () {
            Backbone.history.navigate("/rooms/1", true);
        }, 1500);
    });

    App.router.on("route:room", function (roomId) {
        var view = App.appView.getView();

        if (view instanceof ChatView) {
            view.model.set("currentRoom", roomId);
        } else {
            var chat = new Chat({currentRoom: roomId});
            var chatView = new ChatView({model: chat});

            App.appView.setView(chatView);
            App.vent.trigger("socket:send", "whereami", {join: roomId});
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