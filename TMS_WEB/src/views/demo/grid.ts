/**
 * User: tom
 * Date: 2018/6/7
 * Time: 16:47
 */



let grid1 = $("#jqGrid").jqGrid({
    url: 'data.json',
    datatype: "json",
    colModel: [
        {label: 'ID', name: 'ProductID', width: 45, key: true},
        {label: 'Category Name', name: 'CategoryName', width: 75},
        {label: 'Product Name', name: 'ProductName', width: 90},
        {label: 'Country', name: 'Country', width: 100},
        {label: 'Price', name: 'Price', width: 80, sorttype: 'integer'},
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        {
            label: 'Quantity',
            name: 'Quantity',
            width: 80,
            sorttype: 'number',
            cellClass: 'ui-grid-cell-contents-auto'
        }
    ],
    loadonce: true,
    viewrecords: true,
    height: 200,
    rowNum: 20,
    rowList: [20, 30, 50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: true,
    pager: "#jqGridPager"
});


$("#jqGrid").setGridWidth($('#myjqgridwrapper').width());

$("#jqGrid1").jqGrid({
    url: 'data1.json',
    datatype: "json",
    editurl: '/api/user/login',
    colModel: [
        {label: 'ID', name: 'ProductID', width: 45, key: true},
        {label: 'Category Name', name: 'CategoryName', width: 75, editable: true},
        {label: 'Product Name', name: 'ProductName', width: 90, editable: true},
        {label: 'Country', name: 'Country', width: 100, editable: true},
        {label: 'Price', name: 'Price', width: 80, sorttype: 'integer', editable: true},
        // sorttype is used only if the data is loaded locally or loadonce is set to true
        {
            label: 'Quantity',
            name: 'Quantity',
            width: 80,
            sorttype: 'number',
            cellClass: 'ui-grid-cell-contents-auto',
            editable: true
        },
        {
            label: "Edit Actions",
            name: "actions",
            width: 100,
            formatter: "actions",
            formatoptions: {
                keys: true,
                editOptions: {},
                addOptions: {},
                delOptions: {}
            }
        },
    ],
    loadonce: true,
    viewrecords: true,
    height: 200,
    rowNum: 20,
    rowList: [20, 30, 50],
    rownumbers: true,
    rownumWidth: 25,
    multiselect: false,
    pager: "#jqGridPager1"
});
$("#jqGrid1").setGridWidth($('#myjqgridwrapper1').width());


$(window).on('resize', function () {
    $("#jqGrid").setGridWidth($('#myjqgridwrapper').width());
    $("#jqGrid1").setGridWidth($('#myjqgridwrapper1').width());
}).trigger('resize');
