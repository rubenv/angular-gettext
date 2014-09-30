angular.module('gettext').factory('gettextCatalog', function (gettextPlurals, $http, $cacheFactory, $interpolate, $rootScope) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== catalog.baseLanguage) {
            return '[MISSING]: ' + string;
        } else {
            return string;
        }
    };

    function broadcastUpdated() {
        $rootScope.$broadcast('gettextLanguageChanged');
    }

    catalog = {
        debug: false,
        strings: {},
        baseLanguage: 'en',
        currentLanguage: 'en',
        cache: $cacheFactory('strings'),

        setCurrentLanguage: function (lang) {
            this.currentLanguage = lang;
            broadcastUpdated();
        },

        setStrings: function (language, strings, domain) {
            domain = domain || 'default';

            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            if (!this.strings[language][domain]) {
                this.strings[language][domain] = {};
            }

            for (var key in strings) {
                var val = strings[key];
                if (typeof val === 'string') {
                    this.strings[language][domain][key] = [val];
                } else {
                    this.strings[language][domain][key] = val;
                }
            }

            broadcastUpdated();
        },

        getStringForm: function (string, n, domain) {
            var stringTable = this.strings[this.currentLanguage] && this.strings[this.currentLanguage][domain] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string, context, domain) {
            domain = domain || 'default';
            string = this.getStringForm(string, 0, domain) || prefixDebug(string);
            return context ? $interpolate(string)(context) : string;
        },

        getPlural: function (n, string, stringPlural, context, domain) {
            var form = gettextPlurals(this.currentLanguage, n);
            domain = domain || 'default';
            string = this.getStringForm(string, form, domain) || prefixDebug(n === 1 ? string : stringPlural);
            return context ? $interpolate(string)(context) : string;
        },

        loadRemote: function (url, domain) {
            return $http({
                method: 'GET',
                url: url,
                cache: catalog.cache
            }).success(function (data) {
                for (var lang in data) {
                    catalog.setStrings(lang, data[lang], domain);
                }
            });
        }
    };

    return catalog;
});
