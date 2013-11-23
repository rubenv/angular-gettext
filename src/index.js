//Trim fallback for old browsers(instead of jQuery)
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
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
