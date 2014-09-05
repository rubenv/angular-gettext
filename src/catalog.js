angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
            return '[MISSING]: ' + string;
        } else {
            return string;
        }
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
                if (!angular.isArray(val)) {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }
        },

        getStringForm: function (string, n, gettextContext) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            var translation = plurals[n];
            if (angular.isObject(translation)){
                //Translation is an object with context bound translations for the string
                translation = translation[gettextContext];
            }
            return translation;
        },

        getString: function (string, context, gettextContext) {
            string = this.getStringForm(string, 0, gettextContext) || prefixDebug(string);
            return context ? $interpolate(string)(context) : string;
        },

        getPlural: function (n, string, stringPlural, context, gettextContext) {
            var form = gettextPlurals(this.currentLanguage, n);
            string = this.getStringForm(string, form, gettextContext) || prefixDebug(n === 1 ? string : stringPlural);
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
        }
    };

    return catalog;
});
