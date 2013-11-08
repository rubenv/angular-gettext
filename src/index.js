if (typeof jQuery === 'undefined') {
    throw new Error('Angular-gettext depends on jQuery, be sure to include it!');
}
if (typeof sprintf === 'undefined') {
    throw new Error('Angular-gettext depends on sprintf, be sure to include it!');
}

angular.module('gettext', []);

angular.module('gettext').factory('gettext', function () {
    /*
     * Does nothing, simply returns the input string.
     *
     * This function serves as a marker for `grunt-angular-gettext` to know that
     * this string should be extracted for translations.
     */
    return function (str) {
        return str;
    };
});
