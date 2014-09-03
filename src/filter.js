angular.module('gettext').filter('translate', function (gettextCatalog) {
    return function (input, translateContext ) {
        return gettextCatalog.getString(input, undefined, translateContext);
    };
});
