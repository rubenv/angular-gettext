basePath = '../..'

files = [
    MOCHA
    MOCHA_ADAPTER
    'bower_components/angular/angular.js'
    'bower_components/angular/angular-mocks.js'
    'node_modules/chai/chai.js'
    'dist/angular-gettext.js'
    'test/unit/**/*.coffee'
]

preprocessors =
    '**/*.coffee': 'coffee'
