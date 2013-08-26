module.exports = (config) ->
    config.set
        basePath: '../..'

        frameworks: ['mocha']

        files: [
            'bower_components/jquery/jquery.js'
            'bower_components/angular/angular.js'
            'bower_components/angular/angular-mocks.js'
            'node_modules/chai/chai.js'
            'dist/angular-gettext.js'
            'test/unit/**/*.coffee'
        ]

        preprocessors:
            '**/*.coffee': 'coffee'

        port: 9877
