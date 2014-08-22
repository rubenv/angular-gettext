module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-bump");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-ng-annotate");

    grunt.initConfig({
        jshint: {
            all: ["Gruntfile.js", "{src,test}/**/*.js", "!src/plural.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        jscs: {
            src: {
                options: {
                    config: ".jscs.json"
                },
                files: {
                    src: ["Gruntfile.js", "{src,test}/**/*.js", "!src/plural.js"]
                }
            }
        },

        concat: {
            dist: {
                files: {
                    "dist/angular-gettext.js": ["src/index.js", "src/*.js"]
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    "dist/angular-gettext.min.js": "dist/angular-gettext.js"
                }
            }
        },

        clean: {
            all: ["dist"]
        },

        watch: {
            options: {
                livereload: true
            },
            all: {
                files: ["src/**.js", "test/*/*"],
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run", "karma:e2e:run"]
            },
            unit: {
                files: ["src/**.js", "test/unit/*"],
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run"]
            },
            e2e: {
                files: ["src/**.js", "test/{e2e,fixtures}/*"],
                tasks: ["build", "karma:e2e:run"]
            }
        },

        ngAnnotate: {
            dist: {
                files: {
                    "dist/angular-gettext.js": "dist/angular-gettext.js"
                }
            }
        },

        connect: {
            e2e: {
                options: {
                    port: 9000,
                    hostname: "0.0.0.0",
                    middleware: function (connect) {
                        return [
                            connect["static"](__dirname)
                        ];
                    }
                }
            }
        },

        karma: {
            unit: {
                configFile: "test/configs/unit.conf.js",
                browsers: ["PhantomJS"],
                background: true
            },
            unit_nojquery: {
                configFile: "test/configs/unit-nojquery.conf.js",
                browsers: ["PhantomJS"],
                background: true
            },
            unitci: {
                configFile: "test/configs/unit.conf.js",
                browsers: ["Firefox", "PhantomJS"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "unit-results.xml"
                }
            },
            unitci_nojquery: {
                configFile: "test/configs/unit-nojquery.conf.js",
                browsers: ["Firefox", "PhantomJS"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "unit-results.xml"
                }
            },
            e2e: {
                configFile: "test/configs/e2e.conf.js",
                browsers: ["PhantomJS"],
                background: true
            },
            e2eci: {
                configFile: "test/configs/e2e.conf.js",
                browsers: ["Firefox", "PhantomJS"],
                singleRun: true,
                reporters: ["dots", "junit"],
                junitReporter: {
                    outputFile: "e2e-results.xml"
                }
            }
        },

        bump: {
            options: {
                files: ["package.json", "bower.json"],
                commitFiles: ["-a"],
                pushTo: "origin"
            }
        }
    });

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("build", ["clean", "jshint", "jscs", "concat", "ngAnnotate", "uglify"]);
    grunt.registerTask("test", ["build", "connect:e2e", "karma:unit", "karma:unit_nojquery", "karma:e2e", "watch:all"]);
    grunt.registerTask("test_unit", ["build", "karma:unit", "karma:unit_nojquery", "watch:unit"]);
    grunt.registerTask("test_e2e", ["build", "connect:e2e", "karma:e2e", "watch:e2e"]);
    grunt.registerTask("ci", ["build", "karma:unitci", "karma:unitci_nojquery", "connect:e2e", "karma:e2eci"]);
};
