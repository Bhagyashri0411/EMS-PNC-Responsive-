$(document).ready(function() {
    getTableData();
});

function getTableData() {
    $.ajax({
            method: "GET",
            url: "http://localhost:8090/auth/Equipmentlevelopt/Switchabledrivers",

        }).done(function(data) {
            printTableData(data);
        })
        
}

function printTableData(data) {
    var tableHtml;
    $.each(data, function(key, value) {
        var rowData = data[key];
        tableHtml = '<tr>';
        tableHtml += '<td class="text-left">' + rowData.description + '</td>';
        tableHtml += '<td class="text-center"><span class="indicator ' + rowData.actual.m + '"></span><span class="indicator-label">M</span>';
        tableHtml += '<span class="indicator ' + rowData.actual.t + '"></span><span class="indicator-label">T</span></td>';

        tableHtml += '<td class="text-center"><span class="indicator ' + rowData.optimized.m + '"></span><span class="indicator-label">M</span>';
        tableHtml += '<span class="indicator ' + rowData.optimized.t + '"></span><span class="indicator-label">T</span></td></tr>';

        $('#switchable-table').append(tableHtml);
    });
}