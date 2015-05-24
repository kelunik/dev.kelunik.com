var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var App = require("../App");

module.exports = Backbone.Model.extend({
    defaults: function () {
        return {
            active: !document.hidden
        };
    },

    initialize: function () {
        document.addEventListener("visibilitychange", this.onVisibilityChange.bind(this));
        this.onVisibilityChange();
    },

    remove: function () {
        document.removeEventListener("visibilitychange", this.onVisibilityChange.bind(this));
    },

    onVisibilityChange: function () {
        this.set("active", !document.hidden);

        if (document.hidden) {
            App.vent.trigger("socket:send", "activity", {
                state: "inactive"
            });
        } else {
            App.vent.trigger("socket:send", "activity", {
                state: "active"
            });
        }
    }
});