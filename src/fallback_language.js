angular.module("gettext").factory("gettextFallbackLanguage", function () {

    var pattern = /([^_]+)_[^_]+$/;

    return function (langCode) {
        var matches = pattern.exec(langCode);
        if (matches){
            return matches[1];
        }
        return null;
    };
});
