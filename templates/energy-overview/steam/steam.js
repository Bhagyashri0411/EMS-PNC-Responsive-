$(document).ready(function () {
    steamtable();
    steamtable2();
    steamDoughnut();
    steamDoughnutProgress2();
    $("input[name=fromSteam]").on('change', function () {
        document.getElementById("steamto").min = $('#fromsteam').val();
        getSpecificSteamConsumptionData();
    });
    $("#steamto").on('change', function () {
        document.getElementById("fromsteam").max = $('#steamto').val();
        getSpecificSteamConsumptionData();
    });

    //    second line graph
    $("input[name=fromsteamline2]").on('change', function () {

        getSpecificSteamline1ConsumptionData();
    });
    $("input[name=tosteamline2]").on('change', function (event) {

        getSpecificSteamline1ConsumptionData();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromsteam').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#steamto').val(tod.toJSON().slice(0, 19));
    document.getElementById("steamto").min = $('#fromsteam').val();
    document.getElementById("fromsteam").max = $('#steamto').val();

    $('#fromsteamline2').val(d.toJSON().slice(0, 19));
    $('#tosteamline2').val(d.toJSON().slice(0, 19));
    document.getElementById("tosteamline2").min = $('#fromsteamline2').val();
    document.getElementById("fromsteamline2").max = $('#tosteamline2').val();
    getSpecificSteamConsumptionData();
    getSpecificSteamline1ConsumptionData();

});
function getSpecificSteamline1ConsumptionData() {
    var myJSON = { 'fromdate': $('#fromSteamline2').val(), 'todate': $('#toSteamline2').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://192.168.1.124:8090/steam/steamGraph",
    }).done(function (data) {
        console.log(data)

        formatSpecificSteamline1ConsumptionData(data);
    })
}

// function formatSpecificSteamline1ConsumptionData(data) {
//     var chartData = { lp_STEAM_TO_FLASHEXPX_PTA: [], lp_STEAM_VENT_AT_PTA: [], hp_STEAM_VENT_AT_HGU: [], mlp_STEAM_VENT_AT_HGU: [], mp_STEAM_VENT_AT_HGU: [], lp_STEAM_VENT_AT_HGU: [], elp_STEAM_VENT: [] };
//     for (let index = 0; index < data.length; index++) {
//         const element = data[index];
//         chartData.lp_STEAM_VENT_AT_PTA.push({ y: element.lp_STEAM_VENT_AT_PTA });
//         chartData.lp_STEAM_TO_FLASHEXPX_PTA.push({ y: element.lp_STEAM_TO_FLASHEXPX_PTA });
//         chartData.hp_STEAM_VENT_AT_HGU.push({ y: element.hp_STEAM_VENT_AT_HGU });
//         chartData.mlp_STEAM_VENT_AT_HGU.push({ y: element.mlp_STEAM_VENT_AT_HGU });

//         chartData.mp_STEAM_VENT_AT_HGU.push({ y: element.mp_STEAM_VENT_AT_HGU });

//         chartData.lp_STEAM_VENT_AT_HGU.push({ y: element.lp_STEAM_VENT_AT_HGU });

//         chartData.elp_STEAM_VENT.push({ y: element.elp_STEAM_VENT });
//     }
//     console.log("steamchartdata", chartData);
//     showSpecificSteamline1ConsumptionChart(chartData);
// }
// function showSpecificSteamline1ConsumptionChart(data) {

//     var chart = new CanvasJS.Chart("PNCsteamLine2", {
//         height: 220,
//         animationEnabled: true,
//         theme: "dark1",
//         backgroundColor: " #26293c",
//         toolTip: {
//             shared: true
//         },
//         axisX: {
//             gridColor: "gray",
//             gridThickness: 0,
//             gridDashType: "dot",
//             tickThickness: 0,
//             lineThickness: 0,
//             labelFontColor: "#bfbfbf",
//             labelFontSize: 15,
//             fontFamily: "Bahnschrift Light",

//         },
//         dataPointMaxWidth: 15,
//         axisY: {
//             title: "Specific Steam Consumption" + "MT/MT",
//             gridColor: "gray",
//             gridThickness: 0,
//             // gridDashType: "dot",
//             labelFontColor: "#d9d9d9",
//             labelFontSize: 15,
//             fontFamily: "Bahnschrift Light",
//         },

//         data: [{
//             type: "column",
//             color: "#0896CC",
//             lineThickness: 2,
//             name: "MP-HGU",
//             dataPoints: data.lp_STEAM_TO_FLASHEXPX_PTA
//         },
//         {
//             type: "spline",
//             color: "#c55B11",
//             name: "MLP-HGU ",
//             lineThickness: 2,
//             markerSize: 0,
//             dataPoints: data.lp_STEAM_VENT_AT_PTA
//         }, {
//             type: "column",
//             color: "#c55B11",
//             name: "LP-HGU",
//             lineThickness: 2,
//             dataPoints: data.hp_STEAM_VENT_AT_HGU
//         },
//         {
//             type: "column",
//             color: "#D945B4",
//             name: "LP-PTA",
//             lineThickness: 2,
//             dataPoints: data.mlp_STEAM_VENT_AT_HGU
//         },
//         {
//             type: "column",
//             color: "#FFA700",
//             name: "ELP",
//             lineThickness: 2,
//             dataPoints: data.mp_STEAM_VENT_AT_HGU
//         }, {
//             type: "column",
//             color: "#a708f9",
//             name: "LP-PX-PTA",
//             lineThickness: 2,
//             dataPoints: data.lp_STEAM_VENT_AT_HGU
//         }, {
//             type: "column",
//             color: "#08CC12",
//             name: "HP-HGU",
//             lineThickness: 2,
//             dataPoints: data.elp_STEAM_VENT
//         },

//         ]
//     });

//     chart.render();
//     var chartsteamdata = document.getElementById('chartsteamdata');
//     chartsteamdata.addEventListener("change", function () {
//         chart.options.data[0].type = chartsteamdata.options[chartsteamdata.selectedIndex].value;
//         chart.render();
//     });

//     var chartsteamdata1 = document.getElementById('chartsteamdata1');
//     chartsteamdata1.addEventListener("change", function () {
//         chart.options.data[1].type = chartsteamdata1.options[chartsteamdata1.selectedIndex].value;
//         chart.render();
//     });
// }
// function getSpecificSteamConsumptionData() {
//     var myJSON = { 'fromdate': $('#fromsteam').val(), 'day': $('#steamto').val() };
//     const postdata = JSON.stringify(myJSON);
//     console.log(postdata);
//     $.ajax({
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
//         },
//         method: "POST",
//         data: postdata,

//         url: "http://192.168.1.124:8090/steam/specificsteamconsumption",
//     }).done(function (data) {
//         console.log(data)
//         var Difference_In_Days = data[0].showNumberIndex;
//         formatSpecificSteamConsumptionData(data, Difference_In_Days);
//     })

// }
// function formatSpecificSteamConsumptionData(data, Difference_In_Days) {
//     var chartData = { specificsteamconsumption: [], throughput: [] };
//     for (let index = 0; index < data.length; index++) {
//         const element = data[index];
//         var count = data.length;
//         const steamDate = new Date(element.date);
//         chartData.throughput.push({ y: element.throughput, x: steamDate });
//         chartData.specificsteamconsumption.push({ y: element.fuelConsumption, x: steamDate });
//     }
//     console.log("steamchartdata", chartData);
//     var interval = 1;
//     if (!Difference_In_Days) {
//         if (count / 8 > 1) {
//             interval = Math.round(count / 8);
//         } else {
//             interval = 1;
//         }

//     }
//     showSpecificSteamConsumptionChart(chartData, Difference_In_Days, interval);
// }
// function showSpecificSteamConsumptionChart(data, Difference_In_Days, interval) {
//     var chart = new CanvasJS.Chart("steamchartLine", {
//         height: 220,
//         animationEnabled: true,
//         theme: "dark1",
//         backgroundColor: " #26293c",
//         toolTip: {
//             shared: true
//         },
//         axisX: {
//             gridColor: "gray",
//             gridThickness: 2,
//             gridDashType: "dot",
//             intervalType: Difference_In_Days == true ? "hour" : "day",
//             valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
//             title: Difference_In_Days == true ? "In hours" : " In Days",
//             titleFontSize: 15,
//             interval: interval,
//             tickThickness: 0,
//             lineThickness: 0,
//             labelFontColor: "#d9d9d9",
//             labelFontSize: 15,
//             fontFamily: "Bahnschrift Light",
//         },
//         dataPointMaxWidth: 15,
//         axisY: {
//             title: "Specific Steam Consumption MT/MT",
//             titleFontSize: 15,
//             titleFontColor: "#D9DAD9",
//             gridThickness: 0,
//             labelFontColor: "#bfbfbf",
//             labelFontSize: 15,
//             fontFamily: "Bahnschrift Light",
//         },
//         axisY2: {
//             title: "Throughput (MT/Day)",
//             titleFontSize: 15,
//             titleFontFamily: "Yu Gothic UI Semibold",
//             titleFontColor: "#D9DAD9",
//             gridThickness: 0,
//             labelFontColor: "#bfbfbf",
//             labelFontSize: 15,
//             fontFamily: "Bahnschrift Light",
//         },
//         data: [{
//             type: "column",
//             color: "#00b0f0",
//             name: "Through put",
//             markerSize: 0,
//             axisYType: "secondary",
//             dataPoints: data.throughput
//         },
//         {
//             type: "spline",
//             color: "orange",
//             name: "Specific Steam Consumption",
//             markerSize: 0,
//             dataPoints: data.specificsteamconsumption
//         }

//         ]
//     });

//     chart.render();
//     var chartsteamdata = document.getElementById('chartsteamdata');
//     chartsteamdata.addEventListener("change", function () {
//         chart.options.data[0].type = chartsteamdata.options[chartsteamdata.selectedIndex].value;
//         chart.render();
//     });

//     var chartsteamdata1 = document.getElementById('chartsteamdata1');
//     chartsteamdata1.addEventListener("change", function () {
//         chart.options.data[1].type = chartsteamdata1.options[chartsteamdata1.selectedIndex].value;
//         chart.render();
//     });
// }

function steamDoughnut() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.124:8090/steam/steamBreakup",
    }).done(function (data) {
        loadDoughnutChart(data);
    })

}
function loadDoughnutChart(data) {
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#003f5c",
        "#00aa7e",
        "#4D5363"
    ]);
    // var dataPoints = [];
    var chart = new CanvasJS.Chart("steam-doughnutChart", {
        colorSet: "greenShades",
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: data.steambreakup.toFixed(2),
            // text: "D",
            verticalAlign: "center",
            dockInsidePlotArea: true,
            color: "white",
            fontFamily: "Bahnschrift Light"

        },
        axisY: {
            title: "Units",
            titleFontSize: 20,
            includeZero: true

        },
        data: [{
            type: "doughnut",
            yValueFormatString: "0.00#",
            indexLabelPlacement: "outside",
            startAngle: 64,
            dataPoints: [
                { y: data.shp, name: "SHP", indexLabel: ((data.shp / data.steambreakup) * 100).toFixed(2) + "%" },
                { y: data.hp, name: "HP", indexLabel: ((data.hp / data.steambreakup) * 100).toFixed(2) + "%" },
                { y: data.mp, name: "MP", indexLabel: ((data.mp / data.steambreakup) * 100).toFixed(2) + "%" },
                { y: data.lp, name: "LP", indexLabel: ((data.lp / data.steambreakup) * 100).toFixed(2) + "%" },
            ]
        }]
    });
    chart.render();
}

function steamtable() {
    $.ajax({
        url: "http://192.168.1.124:8090/steam/secSteam",
        method: "GET"
    }).done(function (data) {
        console.log(data)
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.type + '</td>';
            table_data += '<td class="align-num">' + value.sec + '</td>';
            table_data += '<td>' + value.reference + '</td>';
            if (value.deviation > 0) {
                table_data += '<td class="r1">' + "+ " + value.deviation + '</td>';
            }
            else {
                table_data += '<td class="r1">' + "- " + value.deviation + '</td>';
            }

            table_data += '</tr>';
        });
        $('#steam_table').append(table_data);
        $(".r1").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("negative");
                } else if (num > 0) {
                    $(this).addClass("positive");
                }

            }
        });
    })

}
function steamtable2() {
    $.ajax({
        method: 'GET',
        url: 'http://192.168.1.124:8090/steam/steamTable'
    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.name + '</td>';
            table_data += '<td class="align-num">' + value.value + '</td>';
            table_data += '</tr>';
            document.getElementById("shpsteamgeneration").innerHTML = table_data
        });
    })

}

function steamDoughnutProgress2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://192.168.1.124:8090/steam/steamCapacityUtilization",
    }).done(function (data) {

        loadDoughnutChartProgress2(data);
    })

}

function loadDoughnutChartProgress2(data) {
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#D9D9D9"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("doughnutChartprogress", {
        colorSet: "greenShades",
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip: {
            enabled: false,
        },
        title: {
            text: data.steamgenerationcapacityutilization.toFixed(2) + " %",
            verticalAlign: "center",
            dockInsidePlotArea: true,
            color: "white",
            fontFamily: "Bahnschrift Light"

        },
        axisY: {
            title: "Units",
            titleFontSize: 20,
            includeZero: true

        },
        data: [{
            type: "doughnut",
            toolTipContent: false,
            yValueFormatString: "0.00#",
            startAngle: 64,
            dataPoints: [
                { y: data.steamgenerationcapacityutilization, },
                { y: 100 - data.steamgenerationcapacityutilization },
            ]
        }]
    });
    chart.render();
}