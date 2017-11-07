/**
 * @ngdoc service
 * @module gettext
 * @name gettextCatalog
 * @requires gettextPlurals
 * @requires gettextFallbackLanguage
 * @requires https://docs.angularjs.org/api/ng/service/$http $http
 * @requires https://docs.angularjs.org/api/ng/service/$cacheFactory $cacheFactory
 * @requires https://docs.angularjs.org/api/ng/service/$interpolate $interpolate
 * @requires https://docs.angularjs.org/api/ng/service/$rootScope $rootScope
 * @description Provides set of method to translate strings
 */
angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, gettextFallbackLanguage, $http, $cacheFactory, $interpolate, $rootScope) {
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
        /**
         * @ngdoc event
         * @name gettextCatalog#gettextLanguageChanged
         * @eventType broadcast on $rootScope
         * @description Fires language change notification without any additional parameters.
         */
        $rootScope.$broadcast('gettextLanguageChanged');
    }

    catalog = {
        /**
         * @ngdoc property
         * @name gettextCatalog#debug
         * @public
         * @type {Boolean} false
         * @see gettextCatalog#debug
         * @description Whether or not to prefix untranslated strings with `[MISSING]:` or a custom prefix.
         */
        debug: false,
        /**
         * @ngdoc property
         * @name gettextCatalog#debugPrefix
         * @public
         * @type {String} [MISSING]:
         * @description Custom prefix for untranslated strings when {@link gettextCatalog#debug gettextCatalog#debug} set to `true`.
         */
        debugPrefix: '[MISSING]: ',
        /**
         * @ngdoc property
         * @name gettextCatalog#showTranslatedMarkers
         * @public
         * @type {Boolean} false
         * @description Whether or not to wrap all processed text with markers.
         *
         * Example output: `[Welcome]`
         */
        showTranslatedMarkers: false,
        /**
         * @ngdoc property
         * @name gettextCatalog#translatedMarkerPrefix
         * @public
         * @type {String} [
         * @description Custom prefix to mark strings that have been run through {@link angular-gettext angular-gettext}.
         */
        translatedMarkerPrefix: '[',
        /**
         * @ngdoc property
         * @name gettextCatalog#translatedMarkerSuffix
         * @public
         * @type {String} ]
         * @description Custom suffix to mark strings that have been run through {@link angular-gettext angular-gettext}.
         */
        translatedMarkerSuffix: ']',
        /**
         * @ngdoc property
         * @name gettextCatalog#strings
         * @private
         * @type {Object}
         * @description An object of loaded translation strings. Shouldn't be used directly.
         */
        strings: {},
        /**
         * @ngdoc property
         * @name gettextCatalog#baseLanguage
         * @protected
         * @deprecated
         * @since 2.0
         * @type {String} en
         * @description The default language, in which you're application is written.
         *
         * This defaults to English and it's generally a bad idea to use anything else:
         * if your language has different pluralization rules you'll end up with incorrect translations.
         */
        baseLanguage: 'en',
        /**
         * @ngdoc property
         * @name gettextCatalog#currentLanguage
         * @public
         * @type {String}
         * @description Active language.
         */
        currentLanguage: 'en',
        /**
         * @ngdoc property
         * @name gettextCatalog#cache
         * @public
         * @type {String} en
         * @description Language cache for lazy load
         */
        cache: $cacheFactory('strings'),

        /**
         * @ngdoc method
         * @name gettextCatalog#setCurrentLanguage
         * @public
         * @param {String} lang language name
         * @description Sets the current language and makes sure that all translations get updated correctly.
         */
        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
            broadcastUpdated();
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getCurrentLanguage
         * @public
         * @returns {String} current language
         * @description Returns the current language.
         */
        getCurrentLanguage: function () {
            return this.currentLanguage;
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#setStrings
         * @public
         * @param {String} language language name
         * @param {Object.<String>} strings set of strings where the key is the translation `key` and `value` is the translated text
         * @description Processes an object of string definitions. {@link guide:manual-setstrings More details here}.
         */
        setStrings: function (language, strings) {
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            var defaultPlural = gettextPlurals(language, 1);
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

                if (!this.strings[language][key]) {
                    this.strings[language][key] = {};
                }

                for (var context in val) {
                    var str = val[context];
                    if (!angular.isArray(str)) {
                        // Expand single strings
                        this.strings[language][key][context] = [];
                        this.strings[language][key][context][defaultPlural] = str;
                    } else {
                        this.strings[language][key][context] = str;
                    }
                }
            }

            broadcastUpdated();
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getStringFormFor
         * @protected
         * @param {String} language language name
         * @param {String} string translation key
         * @param {Number=} n number to build string form for
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String|Null} translated or annotated string or null if language is not set
         * @description Translate a string with the given language, count and context.
         */
        getStringFormFor: function (language, string, n, context) {
            if (!language) {
                return null;
            }
            var stringTable = this.strings[language] || {};
            var contexts = stringTable[string] || {};
            var plurals = contexts[context || noContext] || [];
            return plurals[gettextPlurals(language, n)];
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getString
         * @public
         * @param {String} string translation key
         * @param {$rootScope.Scope=} scope scope to do interpolation against
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String} translated or annotated string
         * @description Translate a string with the given scope and context.
         *
         * First it tries {@link gettextCatalog#currentLanguage gettextCatalog#currentLanguage} (e.g. `en-US`) then {@link gettextFallbackLanguage fallback} (e.g. `en`).
         *
         * When `scope` is supplied it uses Angular.JS interpolation, so something like this will do what you expect:
         * ```js
         * var hello = gettextCatalog.getString("Hello {{name}}!", { name: "Ruben" });
         * // var hello will be "Hallo Ruben!" in Dutch.
         * ```
         * Avoid using scopes - this skips interpolation and is a lot faster.
         */
        getString: function (string, scope, context) {
            var fallbackLanguage = gettextFallbackLanguage(this.currentLanguage);
            string = this.getStringFormFor(this.currentLanguage, string, 1, context) ||
                     this.getStringFormFor(fallbackLanguage, string, 1, context) ||
                     prefixDebug(string);
            string = scope ? $interpolate(string)(scope) : string;
            return addTranslatedMarkers(string);
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#getPlural
         * @public
         * @param {Number} n number to build string form for
         * @param {String} string translation key
         * @param {String} stringPlural plural translation key
         * @param {$rootScope.Scope=} scope scope to do interpolation against
         * @param {String=} context translation key context, e.g. {@link doc:context Verb, Noun}
         * @returns {String} translated or annotated string
         * @see {@link gettextCatalog#getString gettextCatalog#getString} for details
         * @description Translate a plural string with the given context.
         */
        getPlural: function (n, string, stringPlural, scope, context) {
            var fallbackLanguage = gettextFallbackLanguage(this.currentLanguage);
            string = this.getStringFormFor(this.currentLanguage, string, n, context) ||
                     this.getStringFormFor(fallbackLanguage, string, n, context) ||
                     prefixDebug(n === 1 ? string : stringPlural);
            if (scope) {
                scope.$count = n;
                string = $interpolate(string)(scope);
            }
            return addTranslatedMarkers(string);
        },

        /**
         * @ngdoc method
         * @name gettextCatalog#loadRemote
         * @public
         * @param {String} url location of the translations
         * @description Load a set of translation strings from a given URL.
         *
         * This should be a JSON catalog generated with [angular-gettext-tools](https://github.com/rubenv/angular-gettext-tools).
         * {@link guide:lazy-loading More details here}.
         */
        loadRemote: function (url) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).then(function (response) {
                var data = response.data;
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang]);
                }
                return response;
            });
        }
    };

    return catalog;
});
