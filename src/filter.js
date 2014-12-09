angular.module('gettext').filter('translate', function ($parse, $interpolate, gettextCatalog) {
    function filter(msgid, options) {
        options = options || {};
        msgid = options.msgid || msgid;

        if (!angular.isObject(options)) {
            options = $parse(options)(this) || {};
        }

        var plural = options.plural;
        var pluralScope = options.scope;
        if (angular.isString(plural)) {
            if (!pluralScope) {
                throw new Error('You need to pass options.scope to translateFilter when using plural');
            }
            pluralScope = pluralScope.$new();
            pluralScope.$count = angular.isString(options.n) ? $parse(options.n)(pluralScope) : options.n;
            plural = $interpolate(plural)(pluralScope);
        }
        if (plural || plural === 0) {
            return gettextCatalog.getPlural(pluralScope.$count, msgid, plural, null, options.context);
        }

        return gettextCatalog.getString(msgid, options.scope, options.context);
    }
    filter.$stateful = true;
    return filter;
});
