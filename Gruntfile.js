var serveStatic = require("serve-static");

module.exports = function (grunt) {
    grunt.loadNpmTasks("dgeni-alive");
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
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-shell");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

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
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run", "protractor:dev"]
            },
            unit: {
                files: ["src/**.js", "test/unit/*"],
                tasks: ["build", "karma:unit:run", "karma:unit_nojquery:run"]
            },
            e2e: {
                files: ["src/**.js", "test/{e2e,fixtures}/*"],
                tasks: ["build", "protractor:dev"]
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
                    middleware: function () {
                        return [serveStatic(__dirname)];
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
                reporters: ["dots"]
            },
            unitci_nojquery: {
                configFile: "test/configs/unit-nojquery.conf.js",
                browsers: ["Firefox", "PhantomJS"],
                singleRun: true,
                reporters: ["dots"]
            }
        },

        protractor: {
            options: {
                noColor: false,
                configFile: "test/configs/e2e.conf.js"
            },
            dev: {
                options: {
                    keepAlive: true,
                    args: {
                        directConnect: true
                    }
                }
            },
            ci: {
                options: {
                    args: {
                        browser: "firefox"
                    }
                }
            }
        },

        bump: {
            options: {
                files: ["package.json", "bower.json"],
                commitFiles: ["-a"],
                pushTo: "origin"
            }
        },

        shell: {
            protractor_update: {
                command: "./node_modules/.bin/webdriver-manager update",
                options: {
                    stdout: true
                }
            }
        },

        "dgeni-alive": {
            options: {
                serve: {
                    port: "10000",
                    openBrowser: true
                }
            },
            api: {
                title: "<%= pkg.title %>",
                version: "<%= pkg.version %>",
                expand: false,
                src: [
                    "src/**/*.js",
                    "docs/**/*.ngdoc"
                ],
                dest: "dist/docs"
            }
        }
    });

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("build", ["clean", "jshint", "jscs", "concat", "ngAnnotate", "uglify"]);
    grunt.registerTask("test", ["build", "shell:protractor_update", "connect:e2e", "karma:unit", "karma:unit_nojquery", "protractor:dev", "watch:all"]);
    grunt.registerTask("test_unit", ["build", "shell:protractor_update", "karma:unit", "karma:unit_nojquery", "watch:unit"]);
    grunt.registerTask("test_e2e", ["build", "shell:protractor_update", "connect:e2e", "protractor:dev", "watch:e2e"]);
    grunt.registerTask("ci", ["build", "shell:protractor_update", "karma:unitci", "karma:unitci_nojquery", "connect:e2e", "protractor:ci"]);
};
