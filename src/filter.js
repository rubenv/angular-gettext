(function () {
    var translate = function (gettextCatalog, $gettext) {
        var message = gettextCatalog.getPlural($gettext.n, $gettext.msgid, $gettext.plural, null, $gettext.context);
        if ($gettext.n || $gettext.n === 0) {
            // replace $count with n, preserving leading whitespace
            return message.replace(/(^|\s)\$count\b/g, '$1' + $gettext.n);
        } else {
            return message;
        }
    };

    angular.module('gettext').filter('translate', function (gettextCatalog) {
        function filter(msgid) {
            var $gettext = msgid.$gettext || { msgid: msgid };

            // translate is the only filter that returns a string primitive
            return translate(gettextCatalog, $gettext);
        }
        filter.$stateful = true;
        return filter;
    });

    angular.module('gettext').filter('translatePlural', function (gettextCatalog) {
        function filter(msgid, n, plural) {
            var $gettext = msgid.$gettext || { msgid: msgid };
            $gettext.n = n;
            $gettext.plural = plural;

            /*jshint -W053 */
            // might as well return the correct String, even if it is a wrapper type
            var message = new String(translate(gettextCatalog, $gettext));
            /*jshint +W053 */

            message.$gettext = $gettext;
            return message;
        }
        filter.$stateful = true;
        return filter;
    });

    angular.module('gettext').filter('translateContext', function (gettextCatalog) {
        function filter(msgid, context) {
            var $gettext = msgid.$gettext || { msgid: msgid };
            $gettext.context = context;

            /*jshint -W053 */
            var message = new String(translate(gettextCatalog, $gettext));
            /*jshint +W053 */

            message.$gettext = $gettext;
            return message;
        }
        filter.$stateful = true;
        return filter;
    });
})();
