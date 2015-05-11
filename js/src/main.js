if (window.top != window.self) {
    window.top.location.href = window.location.href;
} else {
    var Backbone = require("backbone");
    var Router = require("./Router");
    var $ = require("jquery");

    Backbone.$ = $;

    var router = new Router;
    router.on("route:defaultRoute", function (actions) {
        // alert(actions);
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

    var AppView = require("./views/AppView");
    new AppView();
}