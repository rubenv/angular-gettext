module.exports = (grunt) ->
    @loadNpmTasks('grunt-bump')
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-concat')
    @loadNpmTasks('grunt-contrib-connect')
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-uglify')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-karma')
    @loadNpmTasks('grunt-ngmin')

    @initConfig
        jshint:
            all: [ 'src/*.js', '!src/plural.js' ]
            options:
                jshintrc: '.jshintrc'

        concat:
            dist:
                files:
                    'dist/angular-gettext.js': ['src/index.js', 'src/*.js']

        uglify:
            dist:
                files:
                    'dist/angular-gettext.min.js': 'dist/angular-gettext.js'

        clean:
            all: ['dist']

        watch:
            options:
                livereload: true
            all:
                files: ['src/**.js', 'test/*/*']
                tasks: ['build', 'karma:unit:run', 'karma:unit_nojquery:run', 'karma:e2e:run']
            unit:
                files: ['src/**.js', 'test/unit/*']
                tasks: ['build', 'karma:unit:run', 'karma:unit_nojquery:run']
            e2e:
                files: ['src/**.js', 'test/{e2e,fixtures}/*']
                tasks: ['build', 'karma:e2e:run']

        ngmin:
            dist:
                files:
                    'dist/angular-gettext.js': 'dist/angular-gettext.js'

        connect:
            e2e:
                options:
                    port: 9000
                    hostname: '0.0.0.0'
                    middleware: (connect) ->
                        return [
                            connect.static(__dirname)
                        ]

        karma:
            unit:
                configFile: 'test/configs/unit.conf.coffee'
                browsers: ['PhantomJS']
                background: true
            unit_nojquery:
                configFile: 'test/configs/unit-nojquery.conf.coffee'
                browsers: ['PhantomJS']
                background: true
            unitci:
                configFile: 'test/configs/unit.conf.coffee'
                browsers: ['Firefox', 'PhantomJS']
                singleRun: true
                reporters: ['dots', 'junit']
                junitReporter:
                    outputFile: 'unit-results.xml'
            unitci_nojquery:
                configFile: 'test/configs/unit-nojquery.conf.coffee'
                browsers: ['Firefox', 'PhantomJS']
                singleRun: true
                reporters: ['dots', 'junit']
                junitReporter:
                    outputFile: 'unit-results.xml'
            e2e:
                configFile: 'test/configs/e2e.conf.coffee'
                browsers: ['PhantomJS']
                background: true
            e2eci:
                configFile: 'test/configs/e2e.conf.coffee'
                browsers: ['Firefox', 'PhantomJS']
                singleRun: true
                reporters: ['dots', 'junit']
                junitReporter:
                    outputFile: 'e2e-results.xml'

        bump:
            options:
                files: ['package.json', 'bower.json']
                commitFiles: ['-a']
                pushTo: 'origin'

    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'jshint', 'concat', 'ngmin', 'uglify']
    @registerTask 'test', ['build', 'connect:e2e', 'karma:unit', 'karma:unit_nojquery', 'karma:e2e', 'watch:all']
    @registerTask 'test_unit', ['build', 'karma:unit', 'karma:unit_nojquery', 'watch:unit']
    @registerTask 'test_e2e', ['build', 'connect:e2e', 'karma:e2e', 'watch:e2e']
    @registerTask 'ci', ['build', 'karma:unitci', 'karma:unitci_nojquery', 'connect:e2e', 'karma:e2eci']
