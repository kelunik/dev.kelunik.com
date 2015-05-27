var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Room = require("./Room");

module.exports = Backbone.Model.extend({
    defaults: {
        room: new Room,
        editId: null,
        replyTo: null,
        changed: false
    }
});