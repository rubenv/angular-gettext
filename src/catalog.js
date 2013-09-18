angular.module('gettext').factory('gettextCatalog', function (gettextPlurals) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug) {
            return "[MISSING]: " + string;
        } else {
            return string;
        }
    };

    catalog = {
        debug: false,
        strings: {},
        currentLanguage: 'en',

        setStrings: function (language, strings) {
            var key, val, _results;
            if (!this.strings[language]) {
                this.strings[language] = {};
            }

            for (key in strings) {
                val = strings[key];
                if (typeof val === 'string') {
                    this.strings[language][key] = [val];
                } else {
                    this.strings[language][key] = val;
                }
            }
        },

        getStringForm: function (string, n) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string) {
            return this.getStringForm(string, 0) || prefixDebug(string);
        },

        getPlural: function (n, string, stringPlural) {
            var form = gettextPlurals(this.currentLanguage, n);
            return this.getStringForm(string, form) || prefixDebug((n === 1 ? string : stringPlural));
        }
    };

    return catalog;
});
