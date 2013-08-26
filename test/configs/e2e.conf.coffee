module.exports = (config) ->
    config.set
        basePath: '../..'

        frameworks: ['ng-scenario']

        files: [
            'test/e2e/**/*.coffee'
        ]

        urlRoot: '/karma/'

        preprocessors:
            '**/*.coffee': 'coffee'

        proxies:
            '/': 'http://localhost:9000/'
