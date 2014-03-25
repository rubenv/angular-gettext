module.exports = (config) ->
    config.set
        basePath: '../..'

        frameworks: ['mocha', 'chai']

        files: [
            'bower_components/jquery/dist/jquery.js'
            'bower_components/angular/angular.js'
            'bower_components/angular-mocks/angular-mocks.js'
            'dist/angular-gettext.js'
            'test/unit/**/*.coffee'
        ]

        preprocessors:
            '**/*.coffee': 'coffee'

        port: 9877

        client:
            mocha:
                timeout: 5000
