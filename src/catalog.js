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

            for (var key in strings) {
                var val = strings[key];
                if (!angular.isArray(val)) {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }

            broadcastUpdated();
        },

        getStringForm: function (string, n, context) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            var translation;

            // Translation is an object with context bound translations for the string
            if (angular.isObject(plurals[0])){
                plurals = (plurals[0][context] || []);
                if (!angular.isArray(plurals)){
                    throw new Error('Context bound translations must be wrapped in a array');
                }
            }
            translation = plurals[n];
            return translation;
        },

        getString: function (string, scope, context) {
            string = this.getStringForm(string, 0, context) || prefixDebug(string);
            string = scope ? $interpolate(string)(scope) : string;
            return addTranslatedMarkers(string);
        },

        getPlural: function (n, string, stringPlural, scope, context) {
            var form = gettextPlurals(this.currentLanguage, n);
            string = this.getStringForm(string, form, context) || prefixDebug(n === 1 ? string : stringPlural);
            string = scope ? $interpolate(string)(scope) : string;
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
