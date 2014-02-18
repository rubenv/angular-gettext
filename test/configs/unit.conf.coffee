module.exports = (config) ->
    config.set
        basePath: '../..'

        frameworks: ['mocha']

        files: [
            'bower_components/jquery/dist/jquery.js'
            'bower_components/angular/angular.js'
            'bower_components/angular-mocks/angular-mocks.js'
            'node_modules/chai/chai.js'
            'dist/angular-gettext.js'
            'test/unit/**/*.coffee'
        ]

        preprocessors:
            '**/*.coffee': 'coffee'

        port: 9877
