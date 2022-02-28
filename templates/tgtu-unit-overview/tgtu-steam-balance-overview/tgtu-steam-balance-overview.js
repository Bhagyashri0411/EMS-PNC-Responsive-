$(document).ready(function () {
    srutgtuOverview()
    $("#tsbo1").on('change', function () {
        getSteamBalanceOverviewTGTU($(this).find(":selected").val());
        console.log($(this).find(":selected").val());
    });

    $("input[name=fromSteamTGTU]").change(function (event) {
        console.log($('["#tsbo1"]:selected').val());
        getSteamBalanceOverviewTGTU($('[#tsbo1]:selected').val());
    });

    $("input[name=toSteamTGTU]").change(function (event) {
        console.log($('["#tsbo1"]:selected').val());
        getSteamBalanceOverviewTGTU($('[#tsbo1]:selected').val());
    });
   
      // // setting to date
      var now = new Date();
      var toDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
      $('#toSteamtgtu').val(toDate);
  
      // // setting from date, to date - 24hrs.
      var fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 1);
      fromDateString = new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
      $('#fromSteamtgtu').val(fromDateString);
      getSteamBalanceOverviewTGTU('LP Steam Generation');
});

function getSteamBalanceOverviewTGTU(tagName) {
    var myJSON = { 'formdate': $('#fromSteamtgtu').val(), 'todate': $('#toSteamtgtu').val(), tagName: tagName };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8080/api/srutgtuOverview/steamBalanceOverview",
    }).done(function (data) {
        console.log(data)

        formatSteamTGTUData(data);
    })
        .fail(function () {
            var failData = [
                    {
                        "Actual": 1000.0
                    },
                    {
                        "Actual": 980.0
                    },
                    {
                        "Actual": 970.0
                    },
                    {
                        "Actual": 960.0
                    },
                    {
                        "Actual": 900.0
                    },
                    {
                        "Actual": 910.0
                    },
                    {
                        "Actual": 900.0
                    },
                    {
                        "Actual": 875.0
                    },
                    {
                        "Actual": 927.0
                    },
                    {
                        "Actual": 949.0
                    },
                    {
                        "Actual": 946.0
                    },
                    {
                        "Actual": 927.0
                    },
                    {
                        "Actual": 949.0
                    },
                    {
                        "Actual": 946.0
                    },
                    {
                        "Actual": 927.0
                    },
                    {
                        "Actual": 950.0
                    },
                    {
                        "Actual": 998.0
                    },
                    {
                        "Actual": 998.0
                    },
                    {
                        "Actual": 930.0
                    },
                    {
                        "Actual": 950.0
                    },
                    {
                        "Actual": 970.0
                    },
                    {
                        "Actual": 980.0
                    },
                    {
                        "Actual": 990.0
                    },
                    {
                        "Actual": 1010.0
                    },
                    {
                        "Actual": 1000.0
                    },
                    {
                        "Actual": 970.0
                    },
                    {
                        "Actual": 930.0
                    },
                    {
                        "Actual": 950.0
                    },
                    {
                        "Actual": 970.0
                    },
                    {
                        "Actual": 980.0
                    },
                    {
                        "Actual": 990.0
                    },
                    {
                        "Actual": 1010.0
                    },
                    {
                        "Actual": 1000.0
                    },
                    {
                        "Actual": 970.0
                    },
                    {
                        "Actual": 930.0
                    },
                    {
                        "Actual": 950.0
                    }
                ]
                formatSteamTGTUData(failData);
        })
}

function formatSteamTGTUData(data) {
    var chartData = { Actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.Actual.push({ y: element.Actual });
    }
    console.log("TGTUData", chartData);
    SteambalanceTGTU(chartData);
}

function SteambalanceTGTU(data) {
    var chart = new CanvasJS.Chart("chartSteamBalanceTGTU", {
        height: 309,

        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            tickThickness: 0,
            interval: 1,
            labelFontColor: "#d9d9d9"
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 2,
            tickThickness: 0,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            // dockInsidePlotArea: true,
            //  itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            lineThickness: 4,
            color: "#02a6e3",
            //axisYType: "secondary",
            name: "Actual",
            toolTipContent: "{name}: {y}",
            markerSize: 0,
            yValueFormatString: "#,###",
            dataPoints: data.Actual
        }
        ]
    });
    chart.render();



}
function srutgtuOverview() {
$.ajax({
    url: "http://localhost:8080//api/srutgtuOverview/steamBalanceOverviewTable",
    method: "GET"
}).done(function (data) {

    var table_data = '';
    $.each(data, function (key, value) {

        table_data += '<tr>';

        table_data += '<td>' + value.gctagName + '</td>';
        table_data += '<td class="hydro-tab">' + value.tph + '</td>';
        
        table_data += '</tr>';

    });
    $('#TGTU_table').append(table_data);

});
}