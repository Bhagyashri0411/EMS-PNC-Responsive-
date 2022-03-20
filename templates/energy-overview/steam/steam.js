$(document).ready(function () {
    steamtable();
    steamtable2();
    steamDoughnut();
    steamDoughnutProgress2();
    $("input[name=fromsteam]").on('change', function () {
        document.getElementById("steamto").min = $('#fromsteam').val();
        getSpecificSteamConsumptionData();
    });
    $("#steamto").on('change', function () {
        document.getElementById("fromsteam").max = $('#steamto').val();
        getSpecificSteamConsumptionData();
    });

    //    second line graph
    $("input[name=fromsteamline2]").on('change', function () {
        document.getElementById("tosteamline2").min = $('#fromsteamline2').val();
        getSpecificSteamline1ConsumptionData();
    });
    $("input[name=tosteamline2]").on('change', function (event) {
        document.getElementById("fromsteamline2").max = $('#tosteamline2').val();
        getSpecificSteamline1ConsumptionData();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#fromsteam').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#steamto').val(tod.toJSON().slice(0, 19));
    document.getElementById("steamto").min = $('#fromsteam').val();
    document.getElementById("fromsteam").max = $('#steamto').val();

    $('#fromsteamline2').val(d.toJSON().slice(0, 19));
    $('#tosteamline2').val(tod.toJSON().slice(0, 19));
    document.getElementById("tosteamline2").min = $('#fromsteamline2').val();
    document.getElementById("fromsteamline2").max = $('#tosteamline2').val();
    getSpecificSteamConsumptionData();
    getSpecificSteamline1ConsumptionData();
});
function getSpecificSteamline1ConsumptionData() {
    var myJSON = { 'fromdate': $('#fromsteamline2').val(), 'todate': $('#tosteamline2').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EmsPNC/steam/steamGraph",
    }).done(function (data) {
        console.log(data)
        var linediff_In_Days = data[0].showNumberIndex;
        formatSpecificSteamline1ConsumptionData(data, linediff_In_Days);
    })
}

function formatSpecificSteamline1ConsumptionData(data, linediff_In_Days) {
    var chartData = { value1: [], value2: [], value3: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var countline = data.length;
        const steamDateline = new Date(element.date);
        chartData.value1.push({ y: element.value1, x : steamDateline });
        chartData.value2.push({ y: element.value2, x : steamDateline });
        chartData.value3.push({ y: element.value3, x : steamDateline });

    }
    console.log("steamchartdata", chartData);
    var line_interval = 1;
    if (!linediff_In_Days) {
        if (countline / 8 > 1) {
            line_interval = Math.round(countline / 8);
        } else {
            line_interval = 1;
        }

    }
    showSpecificSteamline1ConsumptionChart(chartData, linediff_In_Days, line_interval);
}
function showSpecificSteamline1ConsumptionChart(data, linediff_In_Days, line_interval) {

    var chart = new CanvasJS.Chart("PNCsteamLine2", {
        height: 200,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            gridThickness: 0,
            gridDashType: "dot",
            tickThickness: 0,
            lineThickness: 1,
            lineColor: "#d9d9d9",
            intervalType: linediff_In_Days == true ? "hour" : "day",
            valueFormatString: linediff_In_Days == true ? "HH" : "DD MMM YYYY",
            title: linediff_In_Days == true ? "In hours" : " In Days",
            interval: line_interval,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",

        },
        dataPointMaxWidth: 15,
        axisY: {
            title: "Steam Vent Control Valve OP %",
            gridColor: "gray",
            gridThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },

        data: [{
            type: "spline",
            color: "#0896CC",
            lineThickness: 2,
            name: "LP-CPP",
            dataPoints: data.value1
        },
        {
            type: "spline",
            color: "#c55B11",
            name: "LP-NCU",
            lineThickness: 2,
            markerSize: 0,
            dataPoints: data.value2
        }, {
            type: "spline",
            color: "#F50548",
            name: "LP-SWING",
            lineThickness: 2,
            dataPoints: data.value3
        },


        ]
    });

    chart.render();

}

function getSpecificSteamConsumptionData() {
    var myJSON = { 'fromdate': $('#fromsteam').val(), 'day': $('#steamto').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EmsPNC/steam/specificsteamconsumption",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificSteamConsumptionData(data, Difference_In_Days);
    })

}
function formatSpecificSteamConsumptionData(data, Difference_In_Days) {
    var chartData = { specificsteamconsumption: [], throughput: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const steamDate = new Date(element.date);
        chartData.throughput.push({ y: element.throughput, x: steamDate });
        chartData.specificsteamconsumption.push({ y: element.fuelConsumption, x: steamDate });
    }
    console.log("steamchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificSteamConsumptionChart(chartData, Difference_In_Days, interval);
}
function showSpecificSteamConsumptionChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("steamchartLine", {
        height: 197,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            gridThickness: 2,
            gridDashType: "dot",
            tickThickness: 0,
            lineThickness: 1,
            lineColor: "#d9d9d9",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        dataPointMaxWidth: 15,
        axisY: {
            title: "Specific Steam Consumption MT/MT",
            titleFontSize: 15,
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        axisY2: {
            title: "Throughput (MT/Day)",
            titleFontSize: 15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            minimum:1400,
            maximum:2600
        },
        data: [{
            type: $("#chartsteamdata1 option:selected").val(),
            color: "#00b0f0",
            name: "Throughput",
            markerSize: 0,
            axisYType: "secondary",
            dataPoints: data.throughput
        },
        {
            type: $("#chartsteamdata option:selected").val(),
            color: "orange",
            name: "Specific Steam Consumption",
            markerSize: 0,
            dataPoints: data.specificsteamconsumption
        }

        ]
    });

    chart.render();
    var chartsteamdata = document.getElementById('chartsteamdata');
    chartsteamdata.addEventListener("change", function () {
        chart.options.data[1].type = chartsteamdata.options[chartsteamdata.selectedIndex].value;
        chart.render();
    });

    var chartsteamdata1 = document.getElementById('chartsteamdata1');
    chartsteamdata1.addEventListener("change", function () {
        chart.options.data[0].type = chartsteamdata1.options[chartsteamdata1.selectedIndex].value;
        chart.render();
    });
}

function steamDoughnut() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/steam/steamBreakup",
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
            fontFamily: "Bahnschrift Light",
            // fontColor :"white"
           fontColor :data.colorcode == "none"? "white":data.colorcode,

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
        url: "http://localhost:8090/EmsPNC/steam/secSteam",
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
        url: 'http://localhost:8090/EmsPNC/steam/steamTable'
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
        url: "http://localhost:8090/EmsPNC/steam/steamCapacityUtilization",
    }).done(function (data) {

        loadDoughnutChartProgress2(data);
    })

}

function loadDoughnutChartProgress2(data) {
    CanvasJS.addColorSet("greenShades", [
        "#00b0f0",
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
            fontFamily: "Bahnschrift Light",
            // fontColor : "white"
           fontColor :data.colorcode == "none"? "white":data.colorcode,
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