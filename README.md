# DataTables
Making DataTables fun again.

How to use this script:
 - Create a new table in your view. It must follow the following markup:

 <table class="js-datatable" data-source="/url/to/json/source">
     <thead>
         <tr class="js-table-columns">
             <th data-name="id">ID</th>
             <th data-name="name" data-default-sort="true" data-default-sort-order="desc">Name</th>
             <th data-name="created_at">Created at</th>
             <th data-name="blocked">Blocked</th>
         </tr>
     </thead>
     <tfoot>
         <tr class="js-table-filters">
             <th><input type="text" class="js-input-filter"></th>
             <th><input type="text" class="js-input-filter"></th>
             <th><input type="text" class="js-input-filter"></th>
             <th><input type="text" class="js-input-filter"></th>
             <th>
                 <select class="js-select-filter">
                     <option value="1">Yes</option>
                     <option value="0">No</option>
                 </select>
             </th>
             <th></th>
         </tr>
     </tfoot>
 </table>

.js-datatable
 This script will look for the '.js-datatable' selector and make a datatable
 out of it. A data attribute "source" is required, with an URL.
 This is the URL the table will get his contents from.


.js-table-columns
 This is the selector the script uses to figure out how to map the json
 contents to the table. Each <th> must contain a data attribute "name" with
 server side name. By default sorting and searching is enable for a column.
 If you would like to disable this, add
 data-orderable="false" and/or data-searchable="false".
 If you would like to set a default sorting column, you can add the following
 attributes to that column:
 data-default-sort="true" to say that this is the default sort column
 data-default-sort-order="desc" to say the sort order

 .js-table-filters
 This is the selector used to initialize input searching per column.
 If you want a column to be searchable, add:
 <input> with the ".js-input-filter" class for an input filter or a
 <select> with the ".js-select-filter" class for a dropdown filter

 Auto-reloading:
 You can let the table automaticly reload by adding: data-auto-reload="3000"
 Where 3000 can be any number of miliseconds.

 Rows per page:
 By default a table shows 10 records, to override this, you can add: data-per-page="20"
 Where 20 can be any number of items.
