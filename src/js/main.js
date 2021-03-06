require("./extend.js");

// print some ascii art
// use template, because multiline strings in js ...
console.log(require("./templates/ascii.handlebars")());

if (window.top != window.self) {
    window.top.location.href = window.location.href;
} else {
    var Backbone = require("backbone");
    var $ = require("jquery");
    Backbone.$ = $;

    window.onerror = function (message, url, line) {
        var jsError = require("./templates/jsError.handlebars");

        $("#js-error").html(jsError({
            message: message,
            url: url,
            line: line
        })).fadeIn(200);

        $("#js-error-dismiss").on("click", function () {
            $("#js-error").fadeOut(200);
        });
    };

    var _ = require("backbone/node_modules/underscore");
    var ChatView = require("./views/ChatView");
    var SimpleView = require("./views/SimpleView");
    var UnsupportedBrowserView = require("./views/UnsupportedBrowserView");
    var Chat = require("./models/Chat");
    var Message = require("./models/Message");
    var Browser = require("./models/Browser");
    var WebSocketHandler = require("./WebSocketHandler");
    var Router = require("./Router");
    var AppView = require("./views/AppView");
    var PingManager = require("./PingManager");
    var BrowserActivity = require("./models/BrowserActivity");
    var App = require("./App");
    var Remarkable = require("remarkable");
    var RemarkablePlugin = require("remarkable-regexp");
    var Handlebars = require("hbsfy/runtime");
    var hljs = require("./vendor/highlight.js");

    var remarkable = new Remarkable("full", {
        html: false,
        xhtmlOut: false,
        breaks: true,
        langPrefix: "language-",
        linkify: true,
        typographer: true,
        quotes: "“”‘’",

        highlight: function (str, lang) {
            if (lang === "text" || lang === "plain" || lang === "nohighlight" || lang === "no-highlight") {
                return "";
            }

            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (err) {
                    // default
                }
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) {
                // default
            }

            return ""; // use external default escaping
        }
    });

    var pingPlugin = new RemarkablePlugin(/@([a-z][a-z0-9-]*)/i, function (match, utils) {
        if (match[1].toLowerCase() === App.user.get("name").toLowerCase()) {
            return "<span class=\"ping\">" + utils.escape(match[0]) + "</span>";
        } else {
            return utils.escape(match[0]);
        }
    });

    remarkable.use(pingPlugin);

    Handlebars.registerHelper("markdown", function (text) {
        return new Handlebars.SafeString(remarkable.render(text));
    });

    Handlebars.registerHelper("chatTime", function (timestamp) {
        var date = new Date(timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();

        return hours + ":" + minutes.substr(minutes.length - 2);
    });

    App.router = new Router;
    App.appView = new AppView;
    App.pingManager = new PingManager;
    App.browserActivity = new BrowserActivity;

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

    App.vent.on("socket:message:me", function (data) {
        App.user.set(data);
    });

    App.vent.trigger("socket:send", "me");

    App.router.on("route:defaultRoute", function () {
        App.appView.setView(new SimpleView({
            template: require("./templates/ascii_not_found.handlebars")
        }));

        setTimeout(function () {
            // Backbone.history.navigate("/rooms/1", true);
        }, 3000);
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

    App.router.on("route:message", function (messageId) {
        window.location = "https://dev.kelunik.com/messages/" + messageId + "#message-" + messageId;
    });

    Backbone.history.start({pushState: true});

    $(document).on("click", "a[href^='/']", function (event) {
        var href = $(event.currentTarget).attr("href");

        if (event.currentTarget.hasAttribute("target")) {
            return;
        }

        if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
            event.preventDefault();

            var url = href.replace(/^\//, '');
            Backbone.history.navigate(url, true);

            return false;
        }
    });
}