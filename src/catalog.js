angular.module('gettext').factory('gettextCatalog', ['gettextPlurals', '$interpolate', function (gettextPlurals, $interpolate) {
    var catalog;

    var prefixDebug = function (string) {
        if (catalog.debug && catalog.currentLanguage !== 'en') {
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

        getStringForm: function (string, n, dataObject) {
            var stringTable = this.strings[this.currentLanguage] || {};
            var plurals = stringTable[string] || [];
            return plurals[n];
        },

        getString: function (string, dataObject) {
            var text = this.getStringForm(string, 0, dataObject) || prefixDebug(string);
            if (angular.isObject(dataObject)) {
                return $interpolate(text)(dataObject);
            }
            return text;
        },

        getPlural: function (n, string, stringPlural, dataObject) {
            var form = gettextPlurals(this.currentLanguage, n);
            var text = this.getStringForm(string, form, dataObject) || prefixDebug((n === 1 ? string : stringPlural));
            if (angular.isObject(dataObject)) {
                return $interpolate(text)(dataObject);
            }
            return text;
        }
    };

    return catalog;
}]);
