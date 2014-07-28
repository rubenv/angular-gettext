module.exports = function (config) {
    config.set({
        basePath: "../..",

        frameworks: ["ng-scenario"],

        files: ["test/e2e/**/*.js"],

        urlRoot: "/karma/",

        proxies: {
            "/": "http://localhost:9000/"
        }
    });
};
