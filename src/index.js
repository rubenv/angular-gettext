angular.module('gettext', []);

angular.module('gettext').factory('gettext', ['gettextCatalog', function (gettextCatalog) {
    return function (str) {
        return gettextCatalog.getString(str);
    };
}]);
