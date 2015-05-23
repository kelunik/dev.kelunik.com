var historyApiFallback = require('connect-history-api-fallback');

var dest = "./build";
var src = './src';

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest,
            middleware: [historyApiFallback()]
        }
    },
    css: {
        src: src + "/js/vendor/highlight.js/styles/docco.css",
        dest: dest
    },
    sass: {
        src: src + "/sass/**/*.sass",
        dest: dest,
        settings: {
            indentedSyntax: true, // Enable .sass syntax!
            imagePath: 'img' // Used by the image-url helper
        }
    },
    images: {
        src: src + "/img/**",
        dest: dest + "/img"
    },
    markup: {
        src: src + "/index.html",
        dest: dest
    },
    browserify: {
        bundleConfigs: [{
            entries: src + '/js/main.js',
            dest: dest,
            outputName: 'bundle.js',
            extensions: ['.handlebars']
        }]
    },
    production: {
        cssSrc: dest + '/*.css',
        jsSrc: dest + '/*.js',
        dest: dest
    }
};