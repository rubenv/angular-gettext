/**
 * @ngdoc filter
 * @module gettext
 * @name translate
 * @requires gettextCatalog
 * @param {String} input translation key
 * @param {String} context context to evaluate key against
 * @returns {String} translated string or annotated key
 * @see {@link doc:context Verb, Noun}
 * @description Takes key and returns string
 *
 * Sometimes it's not an option to use an attribute (e.g. when you want to annotate an attribute value).
 * There's a `translate` filter available for this purpose.
 *
 * ```html
 * <input type="text" placeholder="{{'Username'|translate}}" />
 * ```
 * This filter does not support plural strings.
 *
 * You may want to use {@link guide:custom-annotations custom annotations} to avoid using the `translate` filter all the time. * Is
 */
angular.module('gettext').filter('translate', function (gettextCatalog) {
    function filter(input, context) {
        return gettextCatalog.getString(input, null, context);
    }
    filter.$stateful = true;
    return filter;
});
