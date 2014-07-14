angular.module('gettext').directive('translate', function (gettextCatalog, $interpolate, $filter, $parse, $compile) {
    return {
        transclude: 'element',
        priority: 499,
        compile: function (element, attrs, transclude) {
            return function ($scope, $element) {
                // Validate attributes
                var assert = function (condition, missing, found) {
                    if (!condition) {
                        throw new Error('You should add a ' + missing + ' attribute whenever you add a ' + found + ' attribute.');
                    }
                };

                assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
                assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');

                // See https://github.com/angular/angular.js/issues/4852
                if (attrs.ngIf) {
                    throw new Error('You should not combine translate with ng-if, this will lead to problems.');
                }
                if (attrs.ngSwitchWhen) {
                    throw new Error('You should not combine translate with ng-switch-when, this will lead to problems.');
                }

                var countFn = $parse(attrs.translateN);
                var pluralScope = null;
                transclude($scope, function (clone) {
                    var input = $filter('trim')(clone.html());
                    clone.removeAttr('translate');
                    $element.replaceWith(clone);

                    return $scope.$watch(function () {
                        var prev = clone.html();

                        // Fetch correct translated string.
                        var translated;
                        if (attrs.translatePlural) {
                            $scope = pluralScope || (pluralScope = $scope.$new());
                            $scope.$count = countFn($scope);
                            translated = gettextCatalog.getPlural($scope.$count, input, attrs.translatePlural);
                        } else {
                            translated = gettextCatalog.getString(input);
                        }

                        // Interpolate with scope.
                        var interpolated = $interpolate(translated)($scope);
                        if (prev === interpolated) {
                            return; // Skip DOM change.
                        }
                        clone.html(interpolated);
                        if (attrs.translateCompile !== undefined) {
                            $compile(clone.contents())($scope);
                        }
                        return clone;

                    });
                });
            };
        }
    };
});
