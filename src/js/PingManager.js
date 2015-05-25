var Backbone = require("backbone");
var _ = require("backbone/node_modules/underscore");
var $ = require("jquery");
var App = require("./App");

Backbone.$ = $;

module.exports = function () {
    /* var favicon = new Favico({
     type: "circle",
     animation: "none",
     bgColor: "#d00",
     textColor: "#eee",
     fontFamily: "Lato"
     }); */

    var avatars = {};

    var appIcon = new Image(80, 80);
    appIcon.src = "/img/logo_40x40x2.png";

    var self = {
        displayNotification: function (title, message, customIcon) {
            var image = new Image(80, 80);
            image.crossOrigin = "Anonymous";

            var timeout = setTimeout(function () {
                image.onload = function () {
                    // reset onload
                };

                var notification = new Notification(title, {
                    tag: "message",
                    icon: "/img/logo_40x40x2.png",
                    lang: "en_US",
                    dir: "ltr",
                    body: message
                });

                // Firefox closes notifications after 4 seconds,
                // let's do this in other browsers, too.
                notification.onshow = function () {
                    setTimeout(notification.close.bind(notification), 5000);
                };
            }, 3000);

            image.onload = function () {
                clearTimeout(timeout);

                var icon;

                if (customIcon in avatars) {
                    icon = avatars[customIcon];
                } else if (image.complete || image.readyState === 4 || image.readyState === "complete") {
                    var canvas = document.createElement("canvas");
                    canvas.width = canvas.height = 80;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, 80, 80);
                    ctx.drawImage(appIcon, 40, 40, 35, 35);

                    avatars[customIcon] = icon = canvas.toDataURL();
                }

                var notification = new Notification(title, {
                    tag: "message",
                    icon: icon,
                    lang: "en_US",
                    dir: "ltr",
                    body: message
                });

                // Firefox closes notifications after 4 seconds,
                // let's do this in other browsers, too.
                notification.onshow = function () {
                    setTimeout(notification.close.bind(notification), 5000);
                };
            };

            image.src = customIcon;
        }
    };

    App.vent.on("chat:ping", function (room, user) {
        self.displayNotification("New message in " + room.get("name"), "You were mentioned by @" + user.name + ".",
            "https://avatars.githubusercontent.com/u/" + user.avatar + "?v=3&s=80");
    });

    return self;
};