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
    var Room = require("./models/Room");
    var Message = require("./models/Message");
    var Browser = require("./models/Browser");
    var RoomList = require("./models/RoomList");
    var WebSocketHandler = require("./WebSocketHandler");

    var vent = _.extend({}, Backbone.Events);
    var router = new Router;
    var appView = new AppView;

    if (typeof WebSocket === "undefined") {
        appView.setView(new UnsupportedBrowserView({
            model: new Browser
        }));

        return;
    }

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
                rooms: new RoomList(vent)
            });

            var room = new Room({
                id: 1,
                name: "Two Crowns"
            });

            for (var i = 0; i < 10; i++) {
                room.get("messages").add(new Message({
                    text: "blah!",
                    authorName: "foo",
                    authorAvatar: "https://avatars1.githubusercontent.com/u/2743004?v=3&s=460"
                }));
            }

            chat.get("rooms").add(room);
            chat.get("rooms").add(new Room({
                id: 10,
                name: "Dummy"
            }));

            var chatView = new ChatView({model: chat, vent: vent});
            appView.setView(chatView);

            chatView.switchRoom(roomId);
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