angular.module('gettext').filter('translate', function (gettextCatalog) {
    function filter(input) {
        return gettextCatalog.getString(input);
    }
    filter.$stateful = true;
    return filter;
});
