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