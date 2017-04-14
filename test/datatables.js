(function(Table) {
    'use strict';

    /**
     * Add datatables to the page with ajax.
     */

    // Object with the elements for the datatable.
    Table.elements = {
        tableSelector: '.js-datatable'
    };

    // The datatables will be stored in this array.
    Table.items = [];

    // Find the elements to connect the datatables.
    Table.init = function() {
        $(Table.elements.tableSelector).each(Table.find);
    };

    // Attach the DataTable core to the elements.
    Table.find = function() {
        var item = new DataTable(
            $(this),
            {
                language: 'nl'
            },
            Table.Translations
        );

        item.functions.init();
        Table.items.push(item);
    };
})(window.Way2web.Table = window.Way2web.Table || {});
