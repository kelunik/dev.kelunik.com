var dest = "./build";
var src = './src';

module.exports = {
    sass: {
        src: src + "/sass/main.sass",
        dest: dest,
        settings: {
            indentedSyntax: true, // Enable .sass syntax!
            imagePath: 'img' // Used by the image-url helper
        }
    },
    images: {
        src: src + "/images/**",
        dest: dest + "/images"
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