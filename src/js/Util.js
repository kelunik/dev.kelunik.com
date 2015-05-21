module.exports = {
    generateToken: function (length) {
        var token = "";

        for (var i = 0; i < length; i += 5) {
            token += Math.floor(10000000 + 89999999 * Math.random()).toString(36).substr(0, 5);
        }

        return token.substr(0, length);
    }
};