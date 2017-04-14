(function(Helpers) {
    'use strict';

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //
    // source: http://snippetrepo.com/snippets/basic-vanilla-javascript-throttlingdebounce

    /**
     * Debounce a function.
     *
     * @param {object} func
     * @param {number} wait
     * @param {boolean} immediate
     *
     * @return {object}
     */
    Helpers.debounce = function(func, wait, immediate) {
        var timeout;

        return function() {
            var context = this;
            var args = arguments;

            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);
            if (immediate && !timeout) {
                func.apply(context, args);
            }
        };
    };

    /**
     * Get the language.
     *
     * @return {string}
     */
    Helpers.getLanguage = function() {
        var language = $('.js-language').attr('lang');

        if (typeof language === 'undefined' || language === '') {
            throw 'language code missing';
        }

        return language;
    };
})(window.Way2web.Helpers = window.Way2web.Helpers || {});
