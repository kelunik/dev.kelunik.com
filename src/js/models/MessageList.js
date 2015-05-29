var Backbone = require("backbone");
var $ = require("jquery");
Backbone.$ = $;

var Message = require("./Message");

module.exports = Backbone.Collection.extend({
    model: Message,

    comparator: function (a, b) {
        a = a.get("id");
        b = b.get("id");

        // sort by ID
        // 1, 2, 3, .., n, -1, -2, ..., -m

        if (Math.sign(a) === Math.sign(b)) {
            return Math.sign(a) * Math.sign(a - b);
        }

        if (Math.sign(a) < 0 && Math.sign(b) > 0) {
            return 1;
        }

        if (Math.sign(a) > 0 && Math.sign(b) < 0) {
            return -1;
        }

        return 0;
    }
});