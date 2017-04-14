(function(Translations) {
    'use strict';

    /**
     * Get the translation.
     *
     * @param {string} languageCode
     *
     * @return {object}
     */
    Translations.get = function(languageCode) {
        switch (languageCode) {
        default: throw 'invalid language code';
        case 'en':
            return Translations.en();
        case 'nl':
            return Translations.nl();
        }
    };

    /**
     * The dutch translations.
     *
     * @return {object}
     */
    Translations.nl = function() {
        return {
            'oPaginate': {
                'sFirst': 'Eerste',
                'sLast': 'Laatste',
                'sNext': 'Volgende',
                'sPrevious': 'Vorige'
            },
            'sEmptyTable': 'Geen resultaten aanwezig in de tabel',
            'sInfo': '_START_ tot _END_ van _TOTAL_ resultaten',
            'sInfoEmpty': 'Geen resultaten om weer te geven',
            'sInfoFiltered': ' (gefilterd uit _MAX_ resultaten)',
            'sInfoPostFix': '',
            'sInfoThousands': '.',
            'sLengthMenu': '_MENU_ resultaten weergeven',
            'sLoadingRecords': 'Een moment geduld aub - bezig met laden...',
            'sProcessing': 'Bezig...',
            'sSearch': 'Zoeken:',
            'sZeroRecords': 'Geen resultaten gevonden'
        };
    };

    /**
     * The english translations.
     *
     * @return {object}
     */
    Translations.en = function() {
        return {
            'oAria': {
                'sSortAscending': ': activate to sort column ascending',
                'sSortDescending': ': activate to sort column descending'
            },
            'oPaginate': {
                'sFirst': 'First',
                'sLast': 'Last',
                'sNext': 'Next',
                'sPrevious': 'Previous'
            },
            'sEmptyTable': 'No data available in table',
            'sInfo': 'Showing _START_ to _END_ of _TOTAL_ entries',
            'sInfoEmpty': 'Showing 0 to 0 of 0 entries',
            'sInfoFiltered': '(filtered from _MAX_ total entries)',
            'sInfoPostFix': '',
            'sInfoThousands': ',',
            'sLengthMenu': 'Show _MENU_ entries',
            'sLoadingRecords': 'Loading...',
            'sProcessing': 'Processing...',
            'sSearch': 'Search:',
            'sZeroRecords': 'No matching records found'
        };
    };
})(window.Way2web.Table.Translations = window.Way2web.Table.Translations || {});
