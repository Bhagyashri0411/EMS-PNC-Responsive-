$(document).ready(function() {
    getEquOverTGTUData();

    $("input[name=fromtgtueqO]").click(function(event) {
        console.log("from", event.target.value);
        getSpecificTGTUOverviewData(event.target.value);
    });

    $("input[name=totgtueqO]").change(function(event) {
        console.log(event.target.value);
        getSpecificTGTUOverviewData(event.target.value);
    });
    // // setting to date
    var now = new Date();
    var toDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#totgtueqO').val(toDate);
    console.log($('#totgtueqO').val(toDate));

    // // setting from date, to date - 24hrs.
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    fromDateString = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    $('#fromtgtueqO').val(fromDateString);
    console.log($('#fromtgtueqO').val(fromDateString));

    getSpecificTGTUOverviewData();
});

function getSpecificTGTUOverviewData() {
    var myJSON = { 'formdate': $('#fromtgtueqO').val(), 'todate': $('#totgtueqO').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
            method: "POST",
            data: postdata,
            headers: { 'Content-Type': 'application/json' },
            url: "http://localhost:8090/api/srutgtuOverview/efficiencyTrends",
        }).done(function(data) {
            console.log(data)

            formatSpecificTGTUOverviewData(data);
        })
        .fail(function() {
            var failData = [{
                    "Boiler2": 980.0,
                    "Boiler1": 2555.0
                },
                {
                    "Boiler2": 950.0,
                    "Boiler1": 2544.0
                },
                {
                    "Boiler2": 966.0,
                    "Boiler1": 2581.0
                },
                {
                    "Boiler2": 974.0,
                    "Boiler1": 2539.0
                },
                {
                    "Boiler2": 1010.0,
                    "Boiler1": 2600.0
                },
                {
                    "Boiler2": 963.0,
                    "Boiler1": 2560.0
                },
                {
                    "Boiler2": 938.0,
                    "Boiler1": 2555.0
                },
                {
                    "Boiler2": 939.0,
                    "Boiler1": 2578.0
                },
                {
                    "Boiler2": 983.0,
                    "Boiler1": 2543.0
                },
                {
                    "Boiler2": 980.0,
                    "Boiler1": 2598.0
                },
                {
                    "Boiler2": 1000.0,
                    "Boiler1": 2517.0
                },
                {
                    "Boiler2": 2590.0,
                    "Boiler1": 2590.0
                },
                {
                    "Boiler2": 938.0,
                    "Boiler1": 2555.0
                },
                {
                    "Boiler2": 939.0,
                    "Boiler1": 2578.0
                },
                {
                    "Boiler2": 983.0,
                    "Boiler1": 2543.0
                },
                {
                    "Boiler2": 980.0,
                    "Boiler1": 2598.0
                },
                {
                    "Boiler2": 1000.0,
                    "Boiler1": 2517.0
                },
                {
                    "Boiler2": 2590.0,
                    "Boiler1": 2590.0
                }

            ]
            formatSpecificTGTUOverviewData(failData);
        })
}

function formatSpecificTGTUOverviewData(data) {
    var chartData = { Boiler1: [], Boiler2: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.Boiler2.push({ y: element.Boiler2 });
        chartData.Boiler1.push({ y: element.Boiler1 });
    }
    console.log("tgtuchartdata", chartData);
    showSpecificTGTUOverviewData(chartData);
}

function showSpecificTGTUOverviewData(data) {
    var chart = new CanvasJS.Chart("TGTU-line", {
        height: 170,
        theme: "dark1",
        backgroundColor: "#26293c",       
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            interval: 1,
            labelFontColor:"#d9d9d9", 
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
          },
          axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor:"#d9d9d9", 
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
                color: "#D945B4",
                name: "Boiler 1",
                markerSize: 0,
                yValueFormatString: "#,###",
                dataPoints: data.Boiler1
            },
            {
                type: "line",
                lineThickness: 2,
                name: "Boiler 2",
                markerSize: 0,
                yValueFormatString: "#,###",
                dataPoints: data.Boiler2
            }
        ]
    });
    chart.render();

    function toogleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}

//bar
function getEquOverTGTUData() {
    $.ajax({
            method: "GET",
            url: "http://localhost:8090/api/srutgtuOverview/equipmentEfficiencies",
        }).done(function(data) {
            formatEquOverTGTUData(data);
        })
        .fail(function() {
            console.log('success');
            var failData = [{
                    "Optimised": 92.0,
                    "BoilerID": "B01",
                    "Actual": 83.0
                },
                {
                    "Optimised": 93.0,
                    "BoilerID": "B02",
                    "Actual": 84.0
                },
                {
                    "Optimised": 93.0,
                    "BoilerID": "B03",
                    "Actual": 84.0
                }
            ]
            formatEquOverTGTUData(failData);

        })
}

function formatEquOverTGTUData(data) {
    var chartData = { Actual: [], Optimised: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.Actual.push({ y: element.Actual, label: element.BoilerID });
        chartData.Optimised.push({ y: element.Optimised, label: element.BoilerID })
    }
    loadcolumntgtu(chartData);

}

function loadcolumntgtu(data) {
    var chart = new CanvasJS.Chart("TGTU-column", {
        height: 170,
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        dataPointMaxWidth: 70,
        dataPointWidth: 70,
        legend: {
            verticalAlign: "top", // "top" , "bottom"
            horizontalAlign: "left"
        },
        axisX: {
            gridThickness: 0,
            lineColor: "white",
            tickThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15
        },
        axisY: {
            gridThickness: 0,
            lineColor: "white",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15
        },
        data: [{
                type: "column",
                name: "Actual",
                color: "#d38d0c  ",
                indexLabel: " {y}",
                indexLabelFontColor: "#d9d9d9",
                indexLabelFontSize: 15,
                dataPoints: data.Actual
            },
            {
                type: "column",
                name: "Optimised",
                color: "#0795cc",
                indexLabel: " {y}",
                indexLabelFontColor: "#d9d9d9",
                indexLabelFontSize: 15,
                dataPoints: data.Optimised
            },
        ]
    });

    chart.render();
}

//table
$.ajax({
    url: "http://localhost:8090/api/srutgtuOverview//kpiOverview",
    method: "GET"
}).done(function(data) {
    var table_data = '';
    $.each(data, function(key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.kpi + '</td>';
        table_data += '<td>' + value.uom + '</td>';
        table_data += '<td class="hydro-tab">' + value.boiler1 + '</td>';
        table_data += '<td class="hydro-tab">' + value.boiler2 + '</td>';
        table_data += '</tr>';
    });
    $('#Equipment_table').append(table_data);
})