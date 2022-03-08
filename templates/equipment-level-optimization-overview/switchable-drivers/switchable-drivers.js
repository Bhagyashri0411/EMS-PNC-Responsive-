$(document).ready(function() {
    getTableData();
});

function getTableData() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
            method: "GET",
            url: "http://localhost:8090/EMSPro/auth/Equipmentlevelopt/Switchabledrivers",

        }).done(function(data) {
            printTableData(data);
        })
        .fail(function() {
            var data = [
                { "actual": { "t": 1, "m": 0 }, "optimized": { "t": 1, "m": 0 }, "description": "BFW Pump 1" },
                { "actual": { "t": 1, "m": 0 }, "optimized": { "t": 1, "m": 0 }, "description": "BFW Pump 2" },
                { "actual": { "t": 1, "m": 0 }, "optimized": { "t": 0, "m": 1 }, "description": "#3" },
                { "actual": { "t": 1, "m": 0 }, "optimized": { "t": 0, "m": 1 }, "description": "#4" },
                { "actual": { "t": 0, "m": 1 }, "optimized": { "t": 1, "m": 0 }, "description": "#5" },
                { "actual": { "t": 1, "m": 0 }, "optimized": { "t": 1, "m": 0 }, "description": "#6" }
            ];
            printTableData(data);
        })
}

function printTableData(data) {
    var tableHtml;
    $.each(data, function(key, value) {
        var rowData = data[key];
        if (rowData.actual.m ==1) {
           var mColor = 'TRUE';
        }
        if (rowData.actual.t ==1) {
           var tColor = 'TRUE';
        }
        if (rowData.optimised.m ==1) {
          var  OmColor = 'TRUE';
        }
        if (rowData.optimised.t ==1) {
           var OtColor = 'TRUE';
        }
        tableHtml = '<tr>';
        tableHtml += '<td class="text-left">' + rowData.description + '</td>';
        tableHtml += '<td class="text-center"><span class="indicator ' + mColor + '"></span><span class="indicator-label">M</span>';
        tableHtml += '<span class="indicator ' + tColor + '"></span><span class="indicator-label">T</span></td>';

        tableHtml += '<td class="text-center"><span class="indicator ' + OmColor + '"></span><span class="indicator-label">M</span>';
        tableHtml += '<span class="indicator ' + OtColor + '"></span><span class="indicator-label">T</span></td></tr>';

        $('#switchable-table').append(tableHtml);
    });
}