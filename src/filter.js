angular.module('gettext').filter('translate', function (gettextCatalog) {
    return function (input) {
        return gettextCatalog.getString(input);
    };
})

/**
* Trim fallback for old browsers(instead of jQuery)
* Based on AngularJS-v1.2.2 (angular.js#620)
*/
.filter('trim', function () {
    return (function () {
        if (!String.prototype.trim) {
            return function (input) {
                return (typeof input === 'string') ? input.replace(/^\s*/, '').replace(/\s*$/, '') : input;
            };
        }
        return function (input) {
            return (typeof input === 'string') ? input.trim() : input;
        };
    })();
});
