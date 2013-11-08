angular.module('gettext').filter('translate', function (gettextCatalog, $interpolate, $parse) {
    return function (input) {
        var translation = gettextCatalog.getString(input),
            argumentsForSprintf = Array.prototype.slice.call(arguments, 1);
        return vsprintf(translation, argumentsForSprintf);
    };
});
