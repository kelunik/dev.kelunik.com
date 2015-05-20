var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        authorId: 0,
        authorName: "",
        authorAvatar: "",
        text: "",
        html: "",
        createdAt: 0
    }
});