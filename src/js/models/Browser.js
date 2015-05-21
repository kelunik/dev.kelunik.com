var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var RoomList = require("./RoomList");

module.exports = Backbone.Model.extend({
    defaults: function () {
        var name = navigator.appName;
        var ua = navigator.userAgent;
        var versionMatch;

        var match = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);

        if (match && (versionMatch = ua.match(/version\/([\.\d]+)/i)) != null) {
            match[2] = versionMatch[1];
        }

        return {
            name: match ? match[1] : name,
            version: match ? match[2] : navigator.appVersion
        };
    }
});