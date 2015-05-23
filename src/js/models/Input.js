var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        room: null,
        isEdit: false,
        editId: 0,
        replyTo: null
    }
});