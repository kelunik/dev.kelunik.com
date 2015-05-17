var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: {
        authorId: 0,
        authorName: "System",
        authorAvatar: "https://avatars1.githubusercontent.com/u/8865682?v=3&s=200",
        text: "",
        html: "",
        createdAt: 0
    }
});