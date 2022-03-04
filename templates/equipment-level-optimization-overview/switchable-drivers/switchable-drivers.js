$(document).ready(function() {
    getTableData();
});

function getTableData() {
    $.ajax({
            method: "GET",
            url: "http://localhost:8090/api/optimizationOverview/switchableDriver",

        }).done(function(data) {
            printTableData(data);
        })
        .fail(function() {
            var data = [
                { "actual": { "t": "TRUE", "m": "FAlSE" }, "optimized": { "t": "TRUE", "m": "FAlSE" }, "description": "BFW Pump 1" },
                { "actual": { "t": "TRUE", "m": "FAlSE" }, "optimized": { "t": "TRUE", "m": "FAlSE" }, "description": "BFW Pump 2" },
                { "actual": { "t": "TRUE", "m": "FAlSE" }, "optimized": { "t": "FAlSE", "m": "TRUE" }, "description": "#3" },
                { "actual": { "t": "TRUE", "m": "FAlSE" }, "optimized": { "t": "FAlSE", "m": "TRUE" }, "description": "#4" },
                { "actual": { "t": "FAlSE", "m": "TRUE" }, "optimized": { "t": "TRUE", "m": "FAlSE" }, "description": "#5" },
                { "actual": { "t": "TRUE", "m": "FAlSE" }, "optimized": { "t": "TRUE", "m": "FAlSE" }, "description": "#6" }
            ];
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