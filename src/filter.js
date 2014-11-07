angular.module('gettext').filter('translate', function (gettextCatalog) {
    function filter(input) {
        return gettextCatalog.getString(input);
    }
    filter.$stateful = true;
    return filter;
});

angular.module('gettext').filter('translatePlural', ['gettextCatalog', function (gettextCatalog) {
    function filter(string, n, stringPlural) {
        return gettextCatalog.getPlural(n, string, stringPlural);
    }
    filter.$stateful = true;
    return filter;
}]);
