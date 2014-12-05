angular.module('gettext').provider('gettextCatalog', function (gettextPlurals) {
    var noContext = '$$noContext';

    // IE8 returns UPPER CASE tags, even though the source is lower case.
    // This can causes the (key) string in the DOM to have a different case to
    // the string in the `po` files.
    var test = '<span>test</span>';
    var isUpperCaseTags = (angular.element('<span>' + test + '</span>').html() !== test);

    var provider = {
        debug: false,
        debugPrefix: '[MISSING]: ',
        showTranslatedMarkers: false,
        translatedMarkerPrefix: '[',
        translatedMarkerSuffix: ']',
        strings: {},
        baseLanguage: 'en',
        currentLanguage: 'en',

        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
        },

        setStrings: function (language, strings) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            for (var key in strings) {
                var val = strings[key];

                if (isUpperCaseTags) {
                    // Use the DOM engine to uppercase any tags in the key (#131).
                    key = angular.element('<span>' + key + '</span>').html();
                }

                if (angular.isString(val) || angular.isArray(val)) {
                    // No context, wrap it in $$noContext.
                    var obj = {};
                    obj[noContext] = val;
                    val = obj;
                }

                // Expand single strings for each context.
                for (var context in val) {
                    var str = val[context];
                    val[context] = angular.isArray(str) ? str : [str];
                }
                this.strings[language][key] = val;
            }
        },

        getStringForm: function (string, n, context) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var contexts = stringTable[string] || {};
            var plurals = contexts[context || noContext] || [];
            return plurals[n];
        }
    };

    angular.extend(this, provider);

    var self = this;
    this.$get = /* @ngInject */ function ($http, $interpolate, $cacheFactory, $rootScope) {
        function Catalog(options) {
            angular.extend(this, options);
            var self = this;

            var prefixDebug = function (string) {
                if (self.debug && self.currentLanguage !== self.baseLanguage) {
                    return self.debugPrefix + string;
                } else {
                    return string;
                }
            };

            var addTranslatedMarkers = function (string) {
                if (self.showTranslatedMarkers) {
                    return self.translatedMarkerPrefix + string + self.translatedMarkerSuffix;
                } else {
                    return string;
                }
            };

            function broadcastUpdated() {
                $rootScope.$broadcast('gettextLanguageChanged');
            }

            this.setCurrentLanguage = function () {
                options.setCurrentLanguage.apply(this, arguments);
                broadcastUpdated();
            };

            this.setStrings = function () {
                options.setStrings.apply(this, arguments);
                broadcastUpdated();
            };

            this.getString = function (string, scope, context) {
                string = this.getStringForm(string, 0, context) || prefixDebug(string);
                string = scope ? $interpolate(string)(scope) : string;
                return addTranslatedMarkers(string);
            };

            this.getPlural = function (n, string, stringPlural, scope, context) {
                var form = gettextPlurals(this.currentLanguage, n);
                string = this.getStringForm(string, form, context) || prefixDebug(n === 1 ? string : stringPlural);
                if (scope) {
                    scope.$count = n;
                    string = $interpolate(string)(scope);
                }
                return addTranslatedMarkers(string);
            };

            this.loadRemote = function (url) {
                return $http({
                    method: 'GET',
                    url: url,
                    cache: self.cache
                }).success(function (data) {
                    for (var lang in data) {
                        self.setStrings(lang, data[lang]);
                    }
                });
            };
        }

        self.cache = self.cache || $cacheFactory('strings');
        return new Catalog(self);
    };
});
