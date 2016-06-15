/**
 * @ngdoc factory
 * @module gettext
 * @name gettextUtil
 * @description Utility service for common operations and polyfills.
 */
angular.module('gettext').factory('gettextUtil', function gettextUtil() {
    /**
     * @ngdoc method
     * @name gettextUtil#trim
     * @public
     * @param {string} value String to be trimmed.
     * @description Trim polyfill for old browsers (instead of jQuery). Based on AngularJS-v1.2.2 (angular.js#620).
     *
     * Example
     * ```js
     * gettextUtil.assert('  no blanks  '); // "no blanks"
     * ```
     */
    var trim = (function () {
        if (!String.prototype.trim) {
            return function (value) {
                return (typeof value === 'string') ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
            };
        }
        return function (value) {
            return (typeof value === 'string') ? value.trim() : value;
        };
    })();

    /**
     * @ngdoc method
     * @name gettextUtil#assert
     * @public
     * @param {bool} condition condition to check
     * @param {String} missing name of the directive missing attribute
     * @param {String} found name of attribute that has been used with directive
     * @description Throws error if condition is not met, which means that directive was used with certain parameter
     * that requires another one (which is missing).
     *
     * Example
     * ```js
     * gettextUtil.assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
     * //You should add a translate-n attribute whenever you add a translate-plural attribute.
     * ```
     */
    function assert(condition, missing, found) {
        if (!condition) {
            throw new Error('You should add a ' + missing + ' attribute whenever you add a ' + found + ' attribute.');
        }
    }

    /**
     * @ngdoc method
     * @name gettextUtil#startsWith
     * @public
     * @param {string} target String on which checking will occur.
     * @param {string} query String expected to be at the beginning of target.
     * @returns {boolean} Returns true if object has no ownProperties. For arrays returns true if length == 0.
     * @description Checks if string starts with another string.
     *
     * Example
     * ```js
     * gettextUtil.startsWith('Home sweet home.', 'Home'); //true
     * gettextUtil.startsWith('Home sweet home.', 'sweet'); //false
     * ```
     */
    function startsWith(target, query) {
        return target.indexOf(query) === 0;
    }

    /**
     * @ngdoc method
     * @name gettextUtil#lcFirst
     * @public
     * @param {string} target String to transform.
     * @returns {string} Strings beginning with lowercase letter.
     * @description Makes first letter of the string lower case
     *
     * Example
     * ```js
     * gettextUtil.lcFirst('Home Sweet Home.'); //'home Sweet Home'
     * gettextUtil.lcFirst('ShouldBeCamelCase.'); //'shouldBeCamelCase'
     * ```
     */
    function lcFirst(target) {
        var first = target.charAt(0).toLowerCase();
        return first + target.substr(1);
    }

    return {
        trim: trim,
        assert: assert,
        startsWith: startsWith,
        lcFirst: lcFirst
    };
});
