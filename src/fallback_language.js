/**
 * @ngdoc factory
 * @module gettext
 * @name gettextFallbackLanguage
 * @param {String} langCode language code
 * @returns {String|Null} fallback language
 * @description Strips regional code and returns language code only
 *
 * Example
 * ```js
 * gettextFallbackLanguage('ru');     // "null"
 * gettextFallbackLanguage('en_GB');  // "en"
 * gettextFallbackLanguage();         // null
 * ```
 */
angular.module("gettext").factory("gettextFallbackLanguage", function () {
    var cache = {};
    var pattern = /([^_]+)_[^_]+$/;

    return function (langCode) {
        if (cache[langCode]) {
            return cache[langCode];
        }

        var matches = pattern.exec(langCode);
        if (matches) {
            cache[langCode] = matches[1];
            return matches[1];
        }

        return null;
    };
});