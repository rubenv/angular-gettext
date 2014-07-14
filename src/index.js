angular.module('gettext', []);

angular.module('gettext').factory('gettext', ['$filter', function ($filter) {
    /*
     * This returns translated string in JavaScript.
     * Example usage; $scope.title = gettext("MYAPP_TITLE");
     *
     * This function also serves as a marker for `grunt-angular-gettext`
     * to know that this string should be extracted for translations.
     */
    return function (str) {
        return $filter('translate')(str);
    };
}]);
