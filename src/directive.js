angular.module('gettext').directive('translate', function (gettextCatalog, $interpolate, $parse) {
    return {
        transclude: 'element',
        priority: 900,
        compile: function (element, attrs, transclude) {
            return function ($scope, $element) {
                // Validate attributes
                var err = function (missing, found) {
                    throw new Error("You should add a " + missing + " attribute whenever you add a " + found + " attribute.");
                };
                if (attrs.translatePlural && !attrs.translateN) { err('translate-n', 'translate-plural'); }
                if (attrs.translateN && !attrs.translatePlural) { err('translate-plural', 'translate-n'); }

                var countFn = $parse(attrs.translateN);

                transclude($scope, function (clone) {
                    var input = clone.html();
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

                        return clone.html(interpolated);
                    });
                });
            };
        }
    };
});
