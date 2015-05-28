var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("backbone/node_modules/underscore");
var User = require("./models/User");

Backbone.$ = $;

module.exports = {
    vent: _.extend({}, Backbone.Events),
    user: new User,
    notificationCount: 0
};