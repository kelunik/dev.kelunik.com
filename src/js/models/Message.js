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
        time: 0,
        replyId: null,
        replyUser: null,
        token: null,
        pending: false
    }
});