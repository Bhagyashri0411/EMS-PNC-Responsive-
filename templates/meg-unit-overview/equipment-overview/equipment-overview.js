$(document).ready(function () {
    getEquOverMEGData();
    $("input[name=fromeqmeg]").on('change', function () {
        // console.log("from", event.target.value);
        document.getElementById("toeqmeg").min = $('#fromeqmeg').val();
        getSpecificEquipmentOverviewDataMEG();
    });

    $("input[name=toeqmeg]").on('change', function () {
        // console.log(event.target.value);
        document.getElementById("fromeqmeg").max = $('#toeqmeg').val();
        getSpecificEquipmentOverviewDataMEG();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(-05);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromeqmeg').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setSeconds(59);
    tod.setSeconds(0);
    $('#toeqmeg').val(tod.toJSON().slice(0, 19));
    document.getElementById("toeqmeg").min = $('#fromeqmeg').val();
    document.getElementById("fromeqmeg").max = $('#toeqmeg').val();
    equipmentOverviewKpiTableMeg();
    getSpecificEquipmentOverviewDataMEG();
});

//bar
function getEquOverMEGData() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/EquipmentOverview/MEGchart",

    }).done(function (data) {
        var chartData = { actual: [], design: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            chartData.actual.push({ y: element.actual, label: element.id });
            chartData.design.push({ y: element.design, label: element.id });
        }
        loadcolumneqmeg(chartData);
    })
}

function loadcolumneqmeg(data) {
    var chart = new CanvasJS.Chart("Equ-columnmeg", {
        height: 120,
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip: {
            shared: true
        },
        dataPointMaxWidth: 40,
        dataPointWidth: 50,
        legend: {
            verticalAlign: "top", // "top" , "bottom"
            horizontalAlign: "left"
        },
        axisX: {
            gridThickness: 0,
            lineColor: "white",
            tickThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15
        },
        axisY: {
            gridThickness: 0,
            lineColor: "white",
            labelFontColor: "#bfbfbf",
            labelFontSize: 15

        },
        data: [{
            type: "column",
            name: "Actual",
            color: "#0795cc",
            //indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.actual
        },
        {
            type: "column",
            name: "Design",
            color: "#d3a10c",
            //indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.design
        },


        ]
    });

    chart.render();
}


var globledatavariable1;
var globledatavariable2;
var globledatavariable3;
var globledatavariable4;
var selectedOption;
var selectedData1;


function equipmentOverviewKpiTableMeg() {

    $.ajax({
        url: 'http://localhost:8090/EmsPNC/EquipmentOverview/MEGtable',
        method: "GET",

    }).done(function (data) {
        var assignTable = '';
        $.each(data, function (key, value) {
            assignTable += '<tr>' 
            assignTable += '<td>' + value.kpi + '</td>';
            assignTable += '<td>' + value.uom + '</td>';
            assignTable += '<td>' + value.value1 + '</td>';
            assignTable += '</tr>' 
        });
        document.getElementById("bodymegOverview").innerHTML = assignTable;
    })
}

function getSpecificEquipmentOverviewDataMEG() {
    var myJSON = { 'fromdate': $('#fromeqmeg').val(), 'todate': $('#toeqmeg').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/EquipmentOverview/MEGgraphEquip",

        method: "POST",
        data: postdata,

    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificEquipmentOverviewData(data, Difference_In_Days);
    })
}

function formatSpecificEquipmentOverviewData(data, Difference_In_Days) {
    var chartData = { value1: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const OHCUEODate = new Date(element.date);
        chartData.value1.push({ y: element.value1, x: OHCUEODate });
    }
    console.log("equdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificEquipmentOverviewChartmeg(chartData, Difference_In_Days, interval);
}

function showSpecificEquipmentOverviewChartmeg(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("Equ-line-meg", {
        height: 114,
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
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            lineThickness: 2,
            color: "#C55B11",
            name: "LM_910",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value1
        }
        ]
    });
    chart.render();

    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}