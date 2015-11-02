angular.module('gettext').filter('translate', function (gettextCatalog) {
    function filter(input, context, namespace) {
        return gettextCatalog.getString(input, null, context, namespace);
    }
    filter.$stateful = true;
    return filter;
});
