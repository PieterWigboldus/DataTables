/**
 * Making DataTables fun again.
 *
 * How to use this script:
 * - Create a new table in your view. It must follow the following markup:
 *
 * <table class="js-datatable" data-source="/url/to/json/source">
 *     <thead>
 *         <tr class="js-table-columns">
 *             <th data-name="id">ID</th>
 *             <th data-name="name" data-default-sort="true" data-default-sort-order="desc">Name</th>
 *             <th data-name="created_at">Created at</th>
 *             <th data-name="blocked">Blocked</th>
 *         </tr>
 *     </thead>
 *     <tfoot>
 *         <tr class="js-table-filters">
 *             <th><input type="text" class="js-input-filter"></th>
 *             <th><input type="text" class="js-input-filter"></th>
 *             <th><input type="text" class="js-input-filter"></th>
 *             <th><input type="text" class="js-input-filter"></th>
 *             <th>
 *                 <select class="js-select-filter">
 *                     <option value="1">Yes</option>
 *                     <option value="0">No</option>
 *                 </select>
 *             </th>
 *             <th></th>
 *         </tr>
 *     </tfoot>
 * </table>
 *
 * .js-datatable
 * This script will look for the '.js-datatable' selector and make a datatable
 * out of it. A data attribute "source" is required, with an URL.
 * This is the URL the table will get his contents from.
 *
 *
 * .js-table-columns
 * This is the selector the script uses to figure out how to map the json
 * contents to the table. Each <th> must contain a data attribute "name" with
 * server side name. By default sorting and searching is enable for a column.
 * If you would like to disable this, add
 * data-orderable="false" and/or data-searchable="false".
 * If you would like to set a default sorting column, you can add the following
 * attributes to that column:
 * data-default-sort="true" to say that this is the default sort column
 * data-default-sort-order="desc" to say the sort order
 *
 * .js-table-filters
 * This is the selector used to initialize input searching per column.
 * If you want a column to be searchable, add:
 * <input> with the ".js-input-filter" class for an input filter or a
 * <select> with the ".js-select-filter" class for a dropdown filter
 *
 * Auto-reloading:
 * You can let the table automaticly reload by adding: data-auto-reload="3000"
 * Where 3000 can be any number of miliseconds.
 *
 * Rows per page:
 * By default a table shows 10 records, to override this, you can add: data-per-page="20"
 * Where 20 can be any number of items.
 *
 * @param {object} $table
 * @param {object} userOptions
 * @param {object} translations
 *
 * @return {object}
 */
var DataTable = (function($table, userOptions, translations) {
    'use strict';

    var elements = {
        columnRowSelector: '.js-table-columns',
        filterRowSelector: '.js-table-filters'
    };

    var prefix = {
        throw: 'w2wDataTables: '
    };

    var defaultOptions = {
        language: 'en'
    };

    var globals = {
        options: $.extend({}, defaultOptions, userOptions || {}),
        source: $table.data('source'),
        autoReload: $table.data('auto-reload'),
        perPage: $table.data('per-page'),
        tableID: $table.attr('id')
    };


    var functions = {
        /**
         * Check if all fields are ok.
         * Create the datatable.
         */
        init: function() {
            functions.hasRequirementsOrThrow();
            functions.makeTable();
        },

        /**
         * Check if all fields are ok.
         */
        hasRequirementsOrThrow: function() {
            var columnRow = $table.find(elements.columnRowSelector);

            if (typeof globals.source === 'undefined' || globals.source === '') {
                throw prefix.throw + 'missing source data attribute!';
            }

            if (typeof globals.tableID === 'undefined' || globals.tableID === '') {
                throw prefix.throw + 'missing id attribute!';
            }

            if (columnRow.length === 0) {
                throw prefix.throw + 'missing column row (' + elements.columnRowSelector + ')!';
            }

            if (typeof globals.autoReload !== 'undefined' && !globals.autoReload > 0) {
                throw prefix.throw + 'invalid reload interval!';
            }
            if (typeof globals.perPage !== 'undefined' && !globals.perPage > 0) {
                throw prefix.throw + 'invalid amount per page!';
            }
        },

        /**
         * Create the datatable.
         */
        makeTable: function() {
            var tableColumns = functions.getColumns();
            var tableOrder = functions.getOrder();
            var tableLanguage = translations.get(globals.options.language);

            // eslint-disable-next-line new-cap
            var objTable = $table.DataTable({
                ajax: {
                    method: 'POST',
                    url: globals.source
                },
                autoWidth: false,
                columns: tableColumns,
                initComplete: function() {
                    var table = this.api();
                    var filterRow = $table.find(elements.filterRowSelector);

                    if (filterRow.length > 0) {
                        functions.filterColumn(table);
                    }
                },
                language: tableLanguage,
                order: tableOrder,
                orderCellsTop: true,
                processing: true,
                responsive: true,
                serverSide: true
            });

            if (typeof globals.autoReload !== 'undefined') {
                functions.bindReload(objTable, globals.autoReload);
            }

            if (typeof globals.perPage !== 'undefined') {
                functions.setPageLength(objTable);
            }

            // once the table has been drawn, ensure a responsive reculcation
            // if we do not do this, pagination might cause columns to go outside the table
            objTable.on('draw.dt', function() {
                objTable.responsive.recalc();
            });
        },

        /**
         * Set the page length.
         *
         * @param {object} table
         */
        setPageLength: function(table) {
            table.page.len(globals.perPage).draw();
        },

        /**
         * Get the columns.
         *
         * @return {array}
         */
        getColumns: function() {
            var tableColumns = $table.find(elements.columnRowSelector + ' th');
            var columns = [];

            tableColumns.each(function() {
                // set default options
                var defOrderable = true;
                var defSearchable = true;
                var validOptionsSortOrder = [
                    true,
                    false
                ];
                // get the column values
                var column = $(this);
                var columnName = column.data('name');
                var columnOrderable = column.data('orderable');
                var columnSearchable = column.data('searchable');

                if (typeof columnOrderable === 'undefined' ||
                    !validOptionsSortOrder.indexOf(columnOrderable)) {
                    columnOrderable = defOrderable;
                }

                if (typeof columnSearchable === 'undefined' ||
                    !validOptionsSortOrder.indexOf(columnSearchable)) {
                    columnSearchable = defSearchable;
                }

                columns.push({
                    data: columnName,
                    name: columnName,
                    orderable: columnOrderable,
                    searchable: columnSearchable
                });
            });

            return columns;
        },

        /**
         * Get the order.
         *
         * @return {array}
         */
        getOrder: function() {
            var defaultOrder = [
                [0, 'desc']
            ];
            var validSortOrders = ['asc', 'desc'];
            var sortColumn = $table.find('[data-default-sort="true"]');
            var sortColumnOrder = sortColumn.data('default-sort-order');

            if (sortColumn.length === 0) {
                // no custom sort column on this table - use the default settings
                return defaultOrder;
            }

            if (typeof sortColumnOrder === 'undefined') {
                throw prefix.throw +
                    'You must add a sorting order (default-sort-order="asc/desc")' +
                    ' if you are filtering on a custom column!';
            }

            if (validSortOrders.indexOf(sortColumnOrder) == -1) {
                throw prefix.throw +
                    'You must add a valid sorting order (asc/desc) if you are filtering on a custom column!';
            }

            return [
                [
                    sortColumn.index(),
                    sortColumnOrder
                ]
            ];
        },

        /**
         * Filter the columns.
         *
         * @param {object} table
         */
        filterColumn: function(table) {
            table
                .columns()
                .eq(0)
                .each(function(colIdx) {
                    var tableFilter = $table.find(elements.filterRowSelector + ' th:eq(' + colIdx + ')');

                    functions.initFilterSelect(table, colIdx, tableFilter);
                    functions.initFilterInput(table, colIdx, tableFilter);
                });
        },

        /**
         * Initialize the input filter.
         *
         * @param {object} table
         * @param {string} colIdx
         * @param {object} tableFilter
         */
        initFilterInput: function(table, colIdx, tableFilter) {
            var debouncedFiltering = Way2web.Helpers.debounce(function(searchValue) {
                table
                    .column(colIdx)
                    .search(searchValue)
                    .draw();
            }, 250);

            tableFilter.find('.js-input-filter').on('input', function() {
                var input = $(this);
                var searchValue = input.val();

                debouncedFiltering(searchValue);
            });
        },

        /**
         * Initialize the select filter.
         *
         * @param {object} table
         * @param {string} colIdx
         * @param {object} tableFilter
         */
        initFilterSelect: function(table, colIdx, tableFilter) {
            tableFilter.find('.js-select-filter').on('change', function() {
                var select = $(this);
                var searchValue = select.val();

                table
                    .column(colIdx)
                    .search(searchValue)
                    .draw();
            });
        },

        /**
         * Bind the reload.
         *
         * @param {object} table
         * @param {string} interval
         */
        bindReload: function(table, interval) {
            setInterval(function() {
                table.ajax.reload();
            }, interval);
        }
    };

    return {
        options:   globals.options,
        functions: functions
    };
});
