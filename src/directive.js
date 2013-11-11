angular.module('gettext').directive('translate', function (gettextCatalog, $interpolate, $parse) {
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

                var countFn = $parse(attrs.translateN),
                    sprintfArgsFn = $parse(attrs.translateArgs),
                    sprintfArgs = sprintfArgsFn($scope);
                transclude($scope, function (clone) {
                    var input = $.trim(clone.html());
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
                        // apply sprintf formatting
                        if ($.isArray(sprintfArgs)) {
                            translated = vsprintf(translated, sprintfArgs);
                        }
                        var argsType = typeof(sprintfArgs);
                        if (argsType === "string" ||
                            argsType === "object" && sprintfArgs !== null) {
                            translated = sprintf(translated, sprintfArgs);
                        }

                        // Interpolate with scope.
                        var interpolated = $interpolate(translated)($scope);
                        if (prev === interpolated) {
                            return; // Skip DOM change.
                        }
                        return clone.html(interpolated);
                    });
                });
            };
        }
    };
});
