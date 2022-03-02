
$(document).ready(function() {

    $("input[name=fromTgtu]").click(function (event) {
        console.log(event.target.value);
        getSpecificTgtuConsumptionData(event.target.value);
    });

    $("input[name=toTgtu]").change(function (event) {
        console.log(event.target.value);
        getSpecificTgtuConsumptionData(event.target.value);
    });

    // // setting to date
    var now = new Date();
    var toDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#toTgtu').val(toDate);
    console.log($('#toTgtu').val(toDate));

    // // setting from date, to date - 24hrs.
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    fromDateString = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#fromTgtu').val(fromDateString);
    console.log($('#fromTgtu').val(fromDateString));

    getSpecificTgtuConsumptionData();

})
function getSpecificTgtuConsumptionData() {
    var myJSON = { 'formdate': $('#fromTgtu').val(), 'todate': $('#toTgtu').val() };
    const postdata = JSON.stringify(myJSON);
    console.log( postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.123:8080/api/npruunitOverview/SECOverview",
    }).done(function (data) {
        console.log(data)

        formatSpecificTgtuConsumptionData(data);
    })
        .fail(function () {
            var failData = [{
                "Reference": 950.0,
                "FeedRate": 998.0,
                "Actual": 975.0
            },
            {
                "Reference": 953.0,
                "FeedRate": 980.0,
                "Actual": 972.0
            },
            {
                "Reference": 966.0,
                "FeedRate": 980.0,
                "Actual": 979.0
            },
            {
                "Reference": 974.0,
                "FeedRate": 960.0,
                "Actual": 980.0
            },
            {
                "Reference": 910.0,
                "FeedRate": 980.0,
                "Actual": 980.0
            },
            {
                "Reference": 963.0,
                "FeedRate": 955.0,
                "Actual": 982.0
            },
            {
                "Reference": 938.0,
                "FeedRate": 980.0,
                "Actual": 984.0
            },
            {
                "Reference": 939.0,
                "FeedRate": 940.0,
                "Actual": 982.0
            },
            {
                "Reference": 983.0,
                "FeedRate": 960.0,
                "Actual": 982.0
            },
            {
                "Reference": 980.0,
                "FeedRate": 950.0,
                "Actual": 899.0
            },
            {
                "Reference": 900.0,
                "FeedRate": 980.0,
                "Actual": 888.0
            },
            {
                "Reference": 948.0,
                "FeedRate": 950.0,
                "Actual": 904.0
            }
            ]

            formatSpecificTgtuConsumptionData(failData);
        })
}

function formatSpecificTgtuConsumptionData(data) {
    var chartData = { FeedRate: [], Reference: [], Actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.FeedRate.push({ y: element.FeedRate});
        chartData.Reference.push({ y: element.Reference});
        chartData.Actual.push({ y: element.Actual});
    }
    console.log("Tgtuchartdata", chartData);
    showSpecificTgtuConsumptionChart(chartData);
}

function showSpecificTgtuConsumptionChart(data) {
    var chart = new CanvasJS.Chart("tgtuOverallsecgraph", {
        width: 1430,
        height: 450,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        axisX: {
            gridColor: "gray",
            tickLength: 0,
            gridThickness: 0,
            labelFontColor: "#d9d9d9",

            gridDashType: "dot",
            lineThickness: 0,
        },
        dataPointMaxWidth: 15,
        axisY: {
            gridDashType: "dot",
            gridThickness: 1,
            // tickLength: 0,
            labelFontColor: "#d9d9d9"
        },
        axisY2: {
            // tickLength: 0,
            gridThickness: 0,

        },
        data: [{
                type: "column",
                color: "#00b0f0",
                name: "FeedRate",
                toolTipContent: "{name}: {y}",
                axisYType: "secondary",
                dataPoints: data.FeedRate
            },
            {
                type: "line",
                color: "yellow",
                name: "Reference ",
                lineThickness: 4,
                markerSize: 0,
                toolTipContent: "{name}: {y}",
                dataPoints: data.Reference
            },
            {
                type: "line",
                color: "orange",
                name: "Actual",
                lineThickness: 4,
                markerSize: 0,
                toolTipContent: "{name}: {y}",
                dataPoints: data.Actual
            }

        ]
    });

    chart.render();
}
