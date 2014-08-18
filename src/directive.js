angular.module('gettext')
    // First directive substitutes the correct translation
    .directive('translate', function (gettextCatalog, $parse, $animate) {
        // Trim polyfill for old browsers (instead of jQuery)
        // Based on AngularJS-v1.2.2 (angular.js#620)
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

        function assert(condition, missing, found) {
            if (!condition) {
                throw new Error('You should add a ' + missing + ' attribute whenever you add a ' + found + ' attribute.');
            }
        }

        return {
            restrict: 'A',
            terminal: true,
            priority: 350,
            transclude: 'element',
            link: function (scope, element, attrs, ctrl, transclude) {
                // Validate attributes
                assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
                assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');

                var currentEl = null;
                var countFn = $parse(attrs.translateN);
                var pluralScope = null;

                function update() {
                    var prevEl = currentEl;

                    currentEl = transclude(scope, function (clone) {
                        // Strip the ng-binding class
                        var ngBindings = clone[0].querySelectorAll('.ng-binding');
                        for (var idx = 0; idx < ngBindings.length; idx++) {
                            ngBindings[idx].className = ngBindings[idx].className.replace(/\bng-binding\b/, '').trim() || null;
                        }

                        var msgid = trim(clone.html());

                        // Fetch correct translated string.
                        var translated;
                        if (attrs.translatePlural) {
                            scope = pluralScope || (pluralScope = scope.$new());
                            scope.$count = countFn(scope);
                            translated = gettextCatalog.getPlural(scope.$count, msgid, attrs.translatePlural);
                        } else {
                            translated = gettextCatalog.getString(msgid);
                        }

                        clone.prop('__msgstr', translated);
                        $animate.enter(clone, null, element);

                        if (prevEl !== null) {
                            $animate.leave(prevEl, function () {
                                prevEl = null;
                            });
                        }
                    });
                }

                if (attrs.translateN) {
                    scope.$watch(attrs.translateN, update);
                }

                scope.$on('gettextLanguageChanged', update);

                update();
            }
        };
    })
    // Second directive takes care of compiling the substituted markup.
    .directive('translate', function ($compile) {
        return {
            restrict: 'A',
            priority: -350,
            link: function (scope, element) {
                var msgstr = element.prop('__msgstr');
                element.empty().append(msgstr);
                $compile(element.contents())(scope);
            }
        };
    });
