angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
            return catalog.debugPrefix + string;
        } else {
            return string;
        }
    };

    var addTranslatedMarkers = function (string) {
        if (catalog.showTranslatedMarkers) {
            return catalog.translatedMarkerPrefix + string + catalog.translatedMarkerSuffix;
        } else {
            return string;
        }
    };

    function broadcastUpdated() {
        $rootScope.$broadcast('gettextLanguageChanged');
    }

    catalog = {
        debug: false,
        debugPrefix: '[MISSING]: ',
        showTranslatedMarkers: false,
        translatedMarkerPrefix: '[',
        translatedMarkerSuffix: ']',
        strings: {},
        baseLanguage: 'en',
        currentLanguage: 'en',
        cache: $cacheFactory('strings'),

        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
            broadcastUpdated();
        },

        setStrings: function (language, strings) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            // IE8 returns UPPER CASE tags, even though the source is lower
            // case.
            // This can causes the (key) string in the DOM to have a different
            // case to the string in the `po` files.
            var test = '<span>test</span>';
            var isUpperCaseTags = (angular.element('<span>' + test + '</span>').html() !== test);
            for (var key in strings) {
                var val = strings[key];
                if (isUpperCaseTags) {
                    // Use the DOM engine to uppercase any tags in the key.
                    key = angular.element('<span>' + key + '</span>').html();
                }
                if (typeof val === 'string') {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }

            broadcastUpdated();
        },

        getStringForm: function (string, n) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string, context) {
            string = this.getStringForm(string, 0) || prefixDebug(string);
            string = context ? $interpolate(string)(context) : string;
            return addTranslatedMarkers(string);
        },

        getPlural: function (n, string, stringPlural, context) {
            var form = gettextPlurals(this.currentLanguage, n);
            string = this.getStringForm(string, form) || prefixDebug(n === 1 ? string : stringPlural);
            string = context ? $interpolate(string)(context) : string;
            return addTranslatedMarkers(string);
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
