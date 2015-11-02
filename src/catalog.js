angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;
    var noContext = '$$noContext';

    // IE8 returns UPPER CASE tags, even though the source is lower case.
    // This can causes the (key) string in the DOM to have a different case to
    // the string in the `po` files.
    // IE9, IE10 and IE11 reorders the attributes of tags.
    var test = '<span id="test" title="test" class="tested">test</span>';
    var isHTMLModified = (angular.element('<span>' + test + '</span>').html() !== test);

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

    function getInternalNamespaceName(namepsace) {
        return namepsace ? ('$$_ns_' + namepsace) : namepsace;
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

        getCurrentLanguage: function () {
            return this.currentLanguage;
        },

        setStrings: function (language, strings, namepsace) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            namepsace = getInternalNamespaceName(namepsace);

            if (namepsace && !this.strings[language][namepsace]) {
                this.strings[language][namepsace] = {};
            }

            for (var key in strings) {
                var val = strings[key];

                if (isHTMLModified) {
                    // Use the DOM engine to render any HTML in the key (#131).
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

                if (namepsace) {
                    this.strings[language][namepsace][key] = val;
                } else {
                    this.strings[language][key] = val;
                }
            }

            broadcastUpdated();
        },

        getStringForm: function (string, n, context, namepsace) {
            var stringTable = this.strings[this.currentLanguage] || {};
            namepsace = getInternalNamespaceName(namepsace);
            if (namepsace) {
                stringTable = stringTable[namepsace] || {};
            }
            var contexts = stringTable[string] || {};
            var plurals = contexts[context || noContext] || [];
            return plurals[n];
        },

        getString: function (string, scope, context, namepsace) {
            string = this.getStringForm(string, 0, context, namepsace) || prefixDebug(string);
            string = scope ? $interpolate(string)(scope) : string;
            return addTranslatedMarkers(string);
        },

        getPlural: function (n, string, stringPlural, scope, context, namepsace) {
            var form = gettextPlurals(this.currentLanguage, n);
            string = this.getStringForm(string, form, context, namepsace) || prefixDebug(n === 1 ? string : stringPlural);
            if (scope) {
                scope.$count = n;
                string = $interpolate(string)(scope);
            }
            return addTranslatedMarkers(string);
        },

        loadRemote: function (url, namepsace) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).then(function (response) {
                var data = response.data;
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang], namepsace);
                }
                return response;
            });
        }
    };

    return catalog;
});
