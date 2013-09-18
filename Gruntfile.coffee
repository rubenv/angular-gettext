module.exports = (grunt) ->
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-coffee')
    @loadNpmTasks('grunt-contrib-concat')
    @loadNpmTasks('grunt-contrib-connect')
    @loadNpmTasks('grunt-contrib-jshint')
    @loadNpmTasks('grunt-contrib-uglify')
    @loadNpmTasks('grunt-contrib-watch')
    @loadNpmTasks('grunt-karma')
    @loadNpmTasks('grunt-release')
    @loadNpmTasks('grunt-ngmin')

    @initConfig
        coffee:
            dist:
                options:
                    bare: true
                files:
                    'dist/angular-gettext.js': ['src/*.coffee']

        jshint:
            all: [ 'src/*.js', '!src/plural.js' ]
            options:
                jshintrc: '.jshintrc'

        concat:
            dist:
                files:
                    'dist/angular-gettext.js': ['src/index.js', 'dist/angular-gettext.js', 'src/*.js']

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
                files: ['src/**.coffee', 'src/**.js', 'test/*/*']
                tasks: ['build', 'karma:unit:run', 'karma:e2e:run']
            unit:
                files: ['src/**.coffee', 'test/unit/*']
                tasks: ['build', 'karma:unit:run']
            e2e:
                files: ['src/**.coffee', 'test/{e2e,fixtures}/*']
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
                browsers: ['Chrome']
                background: true
            unitci_firefox:
                configFile: 'test/configs/unit.conf.coffee'
                browsers: ['Firefox']
                singleRun: true
                reporters: ['dots', 'junit']
                junitReporter:
                    outputFile: 'unit-results.xml'
            e2e:
                configFile: 'test/configs/e2e.conf.coffee'
                browsers: ['Chrome']
                background: true
            e2eci_firefox:
                configFile: 'test/configs/e2e.conf.coffee'
                browsers: ['Firefox']
                singleRun: true
                reporters: ['dots', 'junit']
                junitReporter:
                    outputFile: 'e2e-results.xml'

    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'coffee', 'jshint', 'concat', 'ngmin', 'uglify']
    @registerTask 'package', ['build', 'release']
    @registerTask 'test', ['build', 'connect:e2e', 'karma:unit', 'karma:e2e', 'watch:all']
    @registerTask 'test_unit', ['build', 'karma:unit', 'watch:unit']
    @registerTask 'test_e2e', ['build', 'connect:e2e', 'karma:e2e', 'watch:e2e']
    @registerTask 'ci', ['build', 'karma:unitci_firefox', 'connect:e2e', 'karma:e2eci_firefox']
