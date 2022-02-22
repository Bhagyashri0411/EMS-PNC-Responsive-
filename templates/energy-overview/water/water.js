$(document).ready(function() {
    waterspecificConsumption();
    condensatesystem();
    // Watercard();

    $("#water").on('change', function() {
        getSpecificwaterConsumptionData($(this).find(":selected").val());
        console.log($(this).find(":selected").val());
    });

    $("input[name=fromwater]").change(function(event) {
        console.log($('["#water"]:selected').val());
        getSpecificwaterConsumptionData($('[#water]:selected').val());
    });

    $("input[name=towater]").change(function(event) {
        console.log($('["#water"]:selected').val());
        getSpecificwaterConsumptionData($('[#water]:selected').val());
    });

    // // setting to date
    var now = new Date();
    var toDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#towater').val(toDate);

    // // setting from date, to date - 24hrs.
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    fromDateString = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#fromwater').val(fromDateString);

    getSpecificwaterConsumptionData('Specific Raw Water Consumption');

});

function getSpecificwaterConsumptionData(tagName) {
    var myJSON = { 'fromdate': $('#fromwater').val(), 'todate': $('#towater').val(), tagName: tagName };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
            method: "POST",
            data: postdata,
            headers: { 'Content-Type': 'application/json' },
            url: " http://192.168.1.116/api/energyconsumtion/watergraph  ",
        }).done(function(data) {
            console.log(data)

            formatSpecificwaterConsumptionData(data);
        })
        .fail(function() {
            // var failData = {
            //     reference: 2530,
            //     actual: [{
            //             "actual": 2555.0
            //         },
            //         {
            //             "actual": 2544.0
            //         },
            //         {
            //             "actual": 2581.0
            //         },
            //         {
            //             "actual": 2539.0
            //         },
            //         {
            //             "actual": 2600.0
            //         },
            //         {
            //             "actual": 2560.0
            //         },
            //         {
            //             "actual": 2555.0
            //         },
            //         {
            //             "actual": 2578.0
            //         },
            //         {
            //             "actual": 2543.0
            //         },
            //         {
            //             "actual": 2598.0
            //         },
            //         {
            //             "actual": 2517.0
            //         },
            //         {
            //             "actual": 2590.0
            //         }

            //     ]
            // }
            // formatSpecificwaterConsumptionData(failData);
        })
}

function formatSpecificwaterConsumptionData(data) {
    var chartData = { actual: [], reference: data.reference };
    for (let index = 0; index < data.actual.length; index++) {
        const element = data.actual[index];
        chartData.actual.push({ y: element.actual });
    }
    console.log("waterhartdata", chartData);
    showSpecificwaterConsumptionChart(chartData);
}

function showSpecificwaterConsumptionChart(data) {
    var chart = new CanvasJS.Chart("water-chartLine", {
        theme: "dark1",
        backgroundColor: "#26293c",
        axisX: {
            gridColor: "gray",
            gridThickness: 2,
            gridDashType: "dot",
            tickLength: 0,
            lineThickness: 0,
            interval: 2,
            "minimum": 0,
        },
        axisY: {
            gridColor: "gray",
            gridThickness: 2,
            gridThickness: 0,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            stripLines: [{
                value: data.reference,
                thickness: 4,
                color: "#FFC100",
                lineDashType: "dash",
            }]
        },

        dataPointMaxWidth: 15,

        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            lineThickness: 4,
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "#,###",
            dataPoints: data.actual
        }]
    });
    chart.render();

}

function waterspecificConsumption() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/specificwater",
        method: "GET"

    }).done(function(data) {

        var table_data = '';
        $.each(data, function(key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.type + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.reference + '</td>';
            table_data += '</tr>';
        });
        $('#specificwater').append(table_data);

    });
}

function condensatesystem() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/condensateSystem",
        method: "GET"

    }).done(function(data) {

        var table_data = '';
        $.each(data, function(key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.type + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.reference + '</td>';
            table_data += '</tr>';
        });
        $('#consystem').append(table_data);

    });
}

function Watercard1() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/waterCard",
        method: "GET"
    }).done(function(data) {
        console.log(data)
        document.getElementById("resultwater0").innerHTML = data[0].diff;
        document.getElementById("refnew").innerHTML = data[0].tagBenchmarkValue;
        document.getElementById("countnew").innerHTML = data[0].tagValue;
    });

}
function Watercard2() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/waterCard",
        method: "GET"
    }).done(function(data) {
        console.log(data)

        document.getElementById("resultwater1").innerHTML = data[1].diff;
        document.getElementById("ref0").innerHTML = data[1].tagBenchmarkValue;
        document.getElementById("count0").innerHTML = data[1].tagValue;
    });

}
function Watercard3() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/waterCard",
        method: "GET"
    }).done(function(data) {
        console.log(data)
        document.getElementById("resultwater2").innerHTML = data[2].diff;
        document.getElementById("ref2").innerHTML = data[2].tagBenchmarkValue;
        document.getElementById("count2").innerHTML = data[2].tagValue;

    });

}
function Watercard4() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/waterCard",
        method: "GET"
    }).done(function(data) {
        console.log(data)

        document.getElementById("resultwater3").innerHTML = data[3].diff;
        document.getElementById("ref3").innerHTML = data[3].tagBenchmarkValue;
        document.getElementById("count3").innerHTML = data[3].tagValue;
    });

}
function Watercard5() {
    $.ajax({
        url: "http://192.168.1.116/api/energyconsumtion/waterCard",
        method: "GET"
    }).done(function(data) {
        console.log(data)
        document.getElementById("resultwater4").innerHTML = data[4].diff;
        document.getElementById("ref4").innerHTML = data[4].tagBenchmarkValue;
        document.getElementById("count4").innerHTML = data[4].tagValue;
    });

}