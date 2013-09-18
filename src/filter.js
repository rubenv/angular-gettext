angular.module('gettext').filter('translate', function (gettextCatalog, $interpolate, $parse) {
    return function (input) {
        return gettextCatalog.getString(input);
    };
});
