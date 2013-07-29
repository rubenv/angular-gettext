module.exports = (grunt) ->
    @loadNpmTasks('grunt-contrib-clean')
    @loadNpmTasks('grunt-contrib-coffee')
    @loadNpmTasks('grunt-contrib-concat')
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
                    'dist/angular-gettext.js': ['src/index.coffee', 'src/*.coffee']


        concat:
            dist:
                files:
                    'dist/angular-gettext.js': ['dist/angular-gettext.js', 'src/plural.js']

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
                files: ['src/**.coffee', 'test/*{,/*}.coffee']
                tasks: ['build', 'karma:unit:run']

        ngmin:
            dist:
                files:
                    'dist/angular-gettext.js': 'dist/angular-gettext.js'

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
                    outputFile: 'test-results.xml'

    @registerTask 'default', ['test']
    @registerTask 'build', ['clean', 'coffee', 'concat', 'ngmin', 'uglify']
    @registerTask 'package', ['build', 'release']
    @registerTask 'test', ['build', 'karma:unit', 'watch']
    @registerTask 'ci', ['build', 'karma:unitci_firefox']
