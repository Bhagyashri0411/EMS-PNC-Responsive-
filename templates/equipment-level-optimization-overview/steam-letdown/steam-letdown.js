$(document).ready(function () {
    steamletdowntable();

    $("input[name=fromSteamLetdown]").on('change', function (event) {
        console.log(event.target.value);
        getSpecificlinesteamLenData();
    });

    $("input[name=toSteamLetdown]").on('change', function (event) {
        console.log(event.target.value);
        getSpecificlinesteamLenData();
    });

    $("#SteamLetdownselect").on('change', function () {
        var demoLET = $(this).find(":selected").val();
        $('#letdownid').html(demoLET);
        getSpecificlinesteamLenData();
        console.log($(this).find(":selected").val());
    });
    var now = new Date();
    // var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    console.log(new Date(sessionStorage.getItem("lastUpdateddate")), 'new date');
    var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    var timeArray = hoursString.split(':');
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromsteamletdown').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#tosteamletdown').val(tod.toJSON().slice(0, 19));
    getSpecificlinesteamLenData();

});

function getSpecificlinesteamLenData() {
    var myJSON = { 'fromdate': $('#fromsteamletdown').val(), 'todate': $('#tosteamletdown').val(), 'tagname': $("#SteamLetdownselect option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/EquipmentLevelOptimizedOverview/steamletdownGraph",

    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data.showNumberIndex;
        formatSpecificlinesteamLenData(data, Difference_In_Days);
    })
}
function formatSpecificlinesteamLenData(data, Difference_In_Days) {
    var chartData = { Actual: [], Optimized: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const steamLetdownData = new Date(element.date);
        chartData.Optimized.push({ y: element.design, x: steamLetdownData });
        chartData.Actual.push({ y: element.actual, x: steamLetdownData });
    }
    console.log("Homechartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificlinesteamLenData(chartData, Difference_In_Days, interval);
}

function showSpecificlinesteamLenData(data, Difference_In_Days, interval) {

    var chart = new CanvasJS.Chart("SQSteamletdown-line", {

        height: 450,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            titleFontColor: "#d9d9d9",
            titleFontSize: 12,
            fontFamily: "Bahnschrift Light",
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 12,
            fontFamily: "Bahnschrift Light",
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "line",
            lineThickness: 2,
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Actual
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#00F76E",
            name: "Optimized",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Optimized
        }
        ]
    });
    chart.render();
}
function steamletdowntable() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8090/EmsPNC/EquipmentLevelOptimizedOverview/steamletdownTable'
    }).done(function (data) {
        console.log(data, "bhagahbab");
        getDropsteamletdown(data)
        var max1 = 500;
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.optimized + '</td>';
            table_data += '<td>' + value.deviation.toFixed(2) + '</td>';
            // table_data += '<td> <progress value =' + value.deviation + ' max=' + max1 + '></progress></td>';
            table_data += '</tr>';
        });
        document.getElementById("letdowntable").innerHTML = table_data;
    })
}

function getDropsteamletdown(data) {
    $.each(data, function (key, value) {
        $('#SteamLetdownselect').append(`<option value="${value.kpiname}">
                                           ${value.kpiname}
                                      </option>`);
    });
    var demogen1 = $("#SteamLetdownselect option:selected").val();
    $('#letdownid').html(demogen1);
    getSpecificlinesteamLenData();
}
