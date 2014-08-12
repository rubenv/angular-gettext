angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.getActiveLanguage() !== catalog.baseLanguage) {
            return '[MISSING]: ' + string;
        } else {
            return string;
        }
    };

    var safeLanguage = function (language, originalLanguage) {
        if (typeof(originalLanguage) === 'undefined') {
            originalLanguage = language;
        }

        if (language === catalog.baseLanguage) {
            return language;
        }

        if (typeof(catalog.strings[language]) !== 'undefined') {
            return language;
        }

        var parentExpr = /(\S+)[-_]/;
        var matches = parentExpr.exec(language);

        if (matches && matches.length > 1) {
            var parentLanguage = matches[1];

            return safeLanguage(parentLanguage, originalLanguage);
        }

        return originalLanguage;
    };

    catalog = {
        debug: false,
        strings: {},
        baseLanguage: 'en',
        currentLanguage: 'en',
        cache: $cacheFactory('strings'),

        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
            $rootScope.$broadcast('gettextLanguageChanged');
        },

        setStrings: function (language, strings) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            for (var key in strings) {
                var val = strings[key];
                if (typeof val === 'string') {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }
        },

        getStringForm: function (string, n) {
            var stringTable = this.strings[this.getActiveLanguage()] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string, context) {
            string = this.getStringForm(string, 0) || prefixDebug(string);
            return context ? $interpolate(string)(context) : string;
        },

        getPlural: function (n, string, stringPlural, context) {
            var form = gettextPlurals(this.getActiveLanguage(), n);
            string = this.getStringForm(string, form) || prefixDebug(n === 1 ? string : stringPlural);
            return context ? $interpolate(string)(context) : string;
        },

        loadRemote: function (url) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).success(function (data) {
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang]);
                }
            });
        },

        getActiveLanguage: function () {
            return safeLanguage(this.currentLanguage);
        }
    };

    return catalog;
});
