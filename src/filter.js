angular.module('gettext').filter('translate', function (gettextCatalog) {
    return function (input) {
        return gettextCatalog.getString(input);
    };
});
