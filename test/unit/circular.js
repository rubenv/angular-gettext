describe("Catalog", function () {
    // don't pull module out of tests!

    it("Shouldn't cause circular dependency error on $http", function () {
        var testModule = angular.module("gettext.test", function () {});
        testModule.factory("testInterceptor", function (gettextCatalog) {
            gettextCatalog.getString("some message");
            return {};
        });

        testModule.config(function ($httpProvider) {
            $httpProvider.interceptors.push("testInterceptor");
        });

        module("gettext", "gettext.test");
        inject(function ($http) {
            assert.notEqual($http, false);
        });
    });
});
