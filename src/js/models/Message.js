var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        id: 0,
        authorId: 0,
        authorName: "",
        authorAvatar: "",
        text: "",
        time: 0
    }
});