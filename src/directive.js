/**
 * @ngdoc directive
 * @module gettext
 * @name translate
 * @requires gettextCatalog
 * @requires gettextUtil
 * @requires https://docs.angularjs.org/api/ng/service/$parse $parse
 * @requires https://docs.angularjs.org/api/ng/service/$animate $animate
 * @requires https://docs.angularjs.org/api/ng/service/$compile $compile
 * @requires https://docs.angularjs.org/api/ng/service/$window $window
 * @restrict AE
 * @param {String} [translatePlural] plural form
 * @param {Number} translateN value to watch to substitute correct plural form
 * @param {String} translateContext context value, e.g. {@link doc:context Verb, Noun}
 * @description Annotates and translates text inside directive
 *
 * Full interpolation support is available in translated strings, so the following will work as expected:
 * ```js
 * <div translate>Hello {{name}}!</div>
 * ```
 *
 * You can also use custom context parameters while interpolating. This approach allows usage
 * of angular filters as well as custom logic inside your translated messages without unnecessary impact on translations.
 *
 * So for example when you have message like this:
 * ```js
 * <div translate>Last modified {{modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'}} by {{author}}.</div>
 * ```
 * you will have it extracted in exact same version so it would look like this:
 * `Last modified {{modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'}} by {{author}}`.
 * To start with it might be too complicated to read and handle by non technical translator. It's easy to make mistake
 * when copying format for example. Secondly if you decide to change format by some point of the project translation will broke
 * as it won't be the same string anymore.
 *
 * Instead your translator should only be concerned to place {{modificationDate}} correctly and you should have a free hand
 * to modify implementation details on how to present the results. This is how you can achieve the goal:
 * ```js
 * <div translate translate-params-modification-date="modificationDate | date:'yyyy-MM-dd HH:mm:ss Z'">Last modified {{modificationDate}} by {{author}}.</div>
 * ```
 *
 * There's a few more things worth to point out:
 * 1. You can use as many parameters as you want. Each parameter begins with `translate-params-` followed by snake-case parameter name.
 * Each parameter will be available for interpolation in camelCase manner (just like angular directive works by default).
 * ```js
 * <div translate translate-params-my-custom-param="param1" translate-params-name="name">Param {{myCustomParam}} has been changed by {{name}}.</div>
 * ```
 * 2. You can rename your variables from current scope to simple ones if you like.
 * ```js
 * <div translate translate-params-date="veryUnintuitiveNameForDate">Today's date is: {{date}}.</div>
 * ```
 * 3. You can use translate-params only for some interpolations. Rest would be treated as usual.
 * ```js
 * <div translate translate-params-cost="cost | currency">This product: {{product}} costs {{cost}}.</div>
 * ```
 */
angular.module('gettext').directive('translate', function (gettextCatalog, $parse, $animate, $compile, $window, gettextUtil) {
    var msie = parseInt((/msie (\d+)/.exec(angular.lowercase($window.navigator.userAgent)) || [])[1], 10);
    var PARAMS_PREFIX = 'translateParams';

    function getCtxAttr(key) {
        return gettextUtil.lcFirst(key.replace(PARAMS_PREFIX, ''));
    }

    function handleInterpolationContext(scope, attrs, update) {
        var attributes = Object.keys(attrs).filter(function (key) {
            return gettextUtil.startsWith(key, PARAMS_PREFIX) && key !== PARAMS_PREFIX;
        });

        if (!attributes.length) {
            return null;
        }

        var interpolationContext = angular.extend({}, scope);
        var unwatchers = [];
        attributes.forEach(function (attribute) {
            var unwatch = scope.$watch(attrs[attribute], function (newVal) {
                var key = getCtxAttr(attribute);
                interpolationContext[key] = newVal;
                update(interpolationContext);
            });
            unwatchers.push(unwatch);
        });
        scope.$on('$destroy', function () {
            unwatchers.forEach(function (unwatch) {
                unwatch();
            });
        });
        return interpolationContext;
    }

    return {
        restrict: 'AE',
        terminal: true,
        compile: function compile(element, attrs) {
            // Validate attributes
            gettextUtil.assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
            gettextUtil.assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');

            var msgid = gettextUtil.trim(element.html());
            var translatePlural = attrs.translatePlural;
            var translateContext = attrs.translateContext;

            if (msie <= 8) {
                // Workaround fix relating to angular adding a comment node to
                // anchors. angular/angular.js/#1949 / angular/angular.js/#2013
                if (msgid.slice(-13) === '<!--IE fix-->') {
                    msgid = msgid.slice(0, -13);
                }
            }

            return {
                post: function (scope, element, attrs) {
                    var countFn = $parse(attrs.translateN);
                    var pluralScope = null;
                    var linking = true;

                    function update(interpolationContext) {
                        interpolationContext = interpolationContext || null;

                        // Fetch correct translated string.
                        var translated;
                        if (translatePlural) {
                            scope = pluralScope || (pluralScope = scope.$new());
                            scope.$count = countFn(scope);
                            translated = gettextCatalog.getPlural(scope.$count, msgid, translatePlural, interpolationContext, translateContext);
                        } else {
                            translated = gettextCatalog.getString(msgid, interpolationContext, translateContext);
                        }
                        var oldContents = element.contents();

                        if (oldContents.length === 0){
                            return;
                        }

                        // Avoid redundant swaps
                        if (translated === gettextUtil.trim(oldContents.html())){
                            // Take care of unlinked content
                            if (linking){
                                $compile(oldContents)(scope);
                            }
                            return;
                        }

                        // Swap in the translation
                        var newWrapper = angular.element('<span>' + translated + '</span>');
                        $compile(newWrapper.contents())(scope);
                        var newContents = newWrapper.contents();

                        $animate.enter(newContents, element);
                        $animate.leave(oldContents);
                    }

                    var interpolationContext = handleInterpolationContext(scope, attrs, update);
                    update(interpolationContext);
                    linking = false;

                    if (attrs.translateN) {
                        scope.$watch(attrs.translateN, function () {
                            update(interpolationContext);
                        });
                    }

                    /**
                     * @ngdoc event
                     * @name translate#gettextLanguageChanged
                     * @eventType listen on scope
                     * @description Listens for language updates and changes translation accordingly
                     */
                    scope.$on('gettextLanguageChanged', function () {
                        update(interpolationContext);
                    });

                }
            };
        }
    };
});
