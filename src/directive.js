angular.module('gettext').directive('translate', function (gettextCatalog, $parse, $animate, $compile, $window) {

    function assert(condition, missing, found) {
        if (!condition) {
            throw new Error('You should add a ' + missing + ' attribute whenever you add a ' + found + ' attribute.');
        }
    }

    var msie = parseInt((/msie (\d+)/.exec(angular.lowercase($window.navigator.userAgent)) || [])[1], 10);

    return {
        restrict: 'AE',
        terminal: true,
        compile: function compile(element, attrs) {
            // Validate attributes
            assert(!attrs.translatePlural || attrs.translateN, 'translate-n', 'translate-plural');
            assert(!attrs.translateN || attrs.translatePlural, 'translate-plural', 'translate-n');

            var msgid = element.html();
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

                    function update() {
                        // Fetch correct translated string.
                        var translated;
                        if (translatePlural) {
                            scope = pluralScope || (pluralScope = scope.$new());
                            scope.$count = countFn(scope);
                            translated = gettextCatalog.getPlural(scope.$count, msgid, translatePlural, null, translateContext);
                        } else {
                            translated = gettextCatalog.getString(msgid,  null, translateContext);
                        }

                        // Swap in the translation
                        var newWrapper = angular.element('<span>' + translated + '</span>');
                        $compile(newWrapper.contents())(scope);
                        var oldContents = element.contents();
                        var newContents = newWrapper.contents();
                        $animate.enter(newContents, element);
                        $animate.leave(oldContents);
                    }

                    if (attrs.translateN) {
                        scope.$watch(attrs.translateN, update);
                    }

                    scope.$on('gettextLanguageChanged', update);

                    update();
                }
            };
        }
    };
});
