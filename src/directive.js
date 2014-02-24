angular.module('gettext').directive('translate', function (gettextCatalog, $interpolate, $parse, $compile) {
    /**
     * Trim fallback for old browsers(instead of jQuery)
     * Based on AngularJS-v1.2.2 (angular.js#620)
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

    return {
        transclude: 'element',
        priority: 499,
        compile: function (element, attrs, transclude) {
            return function ($scope, $element) {
                // Validate attributes
                var assert = function (condition, missing, found) {
                    if (!condition) {
                        throw new Error("You should add a " + missing + " attribute whenever you add a " + found + " attribute.");
                    }
                };

                assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
                assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');
                assert(!attrs.ngIf, 'ng-if', 'translate');
                assert(!attrs.ngSwitchWhen, 'ng-switch-when', 'translate');

                var countFn = $parse(attrs.translateN);

                transclude($scope, function (clone) {
                    var input = trim(clone.html());
                    clone.removeAttr('translate');
                    $element.replaceWith(clone);

                    return $scope.$watch(function () {
                        var prev = clone.html();

                        // Fetch correct translated string.
                        var translated;
                        if (attrs.translatePlural) {
                            translated = gettextCatalog.getPlural(countFn($scope), input, attrs.translatePlural);
                        } else {
                            translated = gettextCatalog.getString(input);
                        }

                        // Interpolate with scope.
                        var interpolated = $interpolate(translated)($scope);
                        if (prev === interpolated) {
                            return; // Skip DOM change.
                        }
                        clone.html(interpolated);
                        $compile(clone.contents())($scope);
                        return clone;

                    });
                });
            };
        }
    };
});
