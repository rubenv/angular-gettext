angular.module('gettext').filter('translate', function (gettextCatalog) {
    return function (input, options) {
        var translateContext;
        var translatePlural;
        var translateN;
        if (angular.isObject(options)){
            translateContext = options.translateContext;
            translatePlural = options.translatePlural;
            translateN = options.translateN;
        }
        if (translateN && translatePlural){
            return gettextCatalog.getPlural(translateN, input,
                translatePlural, null, translateContext);
        }
        return gettextCatalog.getString(input, null, translateContext);
    };
});
