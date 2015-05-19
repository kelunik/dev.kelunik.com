if (window.top != window.self) {
    window.top.location.href = window.location.href;
} else {
    var Backbone = require("backbone");
    var Router = require("./Router");
    var $ = require("jquery");

    Backbone.$ = $;

    var AppView = require("./views/AppView");
    var LoaderView = require("./views/LoaderView");
    var ChatView = require("./views/ChatView");

    var router = new Router;
    var appView = new AppView;

    router.on("route:defaultRoute", function () {
        appView.setView(new LoaderView);

        setTimeout(function () {
            // Backbone.history.navigate("/rooms/1", true);
        }, 1500);
    });

    router.on("route:room", function (roomId) {
        appView.setView(new ChatView);
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