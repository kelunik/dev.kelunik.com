var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        room: null,
        editId: null,
        replyTo: null,
        changed: false
    }
});