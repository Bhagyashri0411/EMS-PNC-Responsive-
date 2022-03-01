$(document).ready(function () {

    $("#fuel").load("./../../templates/energy-overview/fuel/fuel.html", function () { });
    $("#left-sidebar").load("./../templates/left-sidebar/left-sidebar.html");
    $("#bs-example-navbar-collapse-1").load("./../templates/nav/nav.html", function () {
        document.getElementById("user").innerHTML = sessionStorage.getItem("user");
    });
    optimizedtable();
    optimizedfuel();
    optimizedElectrical();
    steamPotential();
    recommendations();
    lastupdatedTime();
    $("#sbo1avu1").on("change", function () {
        getPotentialAreaData();
    });
    getPotentialAreaData();
    $("input[name=fromOpt]").on('change', function (event) {
        // console.log(event.target.value);
        document.getElementById("optimizedrop").min = $('#fromopt').val();
        getSpecificOptConsumptionData();
    });
    $("#optimizedrop").on('change', function (event) {
        //console.log($('["#optimizedrop"]:selected').val());
        document.getElementById("fromopt").max = $('#optimizedrop').val();
        getSpecificOptConsumptionData();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromopt').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#optimizedrop').val(tod.toJSON().slice(0, 19));
    document.getElementById("optimizedrop").min = $('#fromopt').val();
    document.getElementById("fromopt").max = $('#optimizedrop').val();

    getSpecificOptConsumptionData();
});
function lastupdatedTime() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            Authorization:
                sessionStorage.getItem("tokenType") +
                " " +
                sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/Air/lastUpdateTimestamp",
        method: "GET",
    }).done(function (data) {
        const d = new Date(data.lastupdatetimestamp);
        sessionStorage.setItem("lastUpdateddate", d);
        const dmonth = d.getMonth() + 1;
        //alert(sessionStorage.getItem("lastUpdateddate"));
        document.getElementById("optTime").innerHTML = d.getDate() + "-" + dmonth + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

    });
}
function getPotentialAreaData() {
    var myJSON = { 'kpiname': $("#sbo1avu1 option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",

        url: "http://localhost:8090/EmsPNC/potentialgraph",

    }).done(function (data) {

        formatPotentialOpportunityAreaData(data);
    })
        .fail(function () {
            var failData = [{ "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-15T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-16T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-17T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-18T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-19T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-20T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-21T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-22T00:00:00" }, { "actual": 0.0, "showNumberIndex": false, "xAxisNumbers": "0", "date": "2021-08-23T00:00:00" }]

            formatPotentialOpportunityAreaData(failData);

        })
}

function formatPotentialOpportunityAreaData(data) {
    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.actual.push({ y: element.actual });
        // chartData.yvalue.push({ y: element.yvalue });

    }
    loadAreagraph(chartData);

}

function loadAreagraph(data) {
    var chart = new CanvasJS.Chart("chartContainerrArea", {
        backgroundColor: "#26293c",
        height: 100,
        animationEnabled: true,
        title: {
            text: ""
        },

        axisX: {
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            lineThickness: 0,
            tickLength: 0,
            // "minimum":0,



            labelFormatter: function () {
                return " ";

            }
        },
        dataPointMaxWidth: 15,
        axisY: {

            lineThickness: 0,
            gridThickness: 0,
            tickLength: 0,
            "minimum": 0,

            labelFormatter: function () {
                return " ";
            }
        },
        data: [{
            indexLabelFontColor: "darkSlateGray",
            name: "views",
            type: "area",
            color: "#116646",
            ValueFormatString: "#,##0.0mn",

            dataPoints: data.actual


        }],


    });
    chart.render();

}

function getSpecificOptConsumptionData() {
    var myJSON = { 'fromdate': $('#fromopt').val(), day: $('#optimizedrop').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EmsPNC/overallenergycost",
    }).done(function (data) {
        console.log(data, "data 12")
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificOptConsumptionData(data, Difference_In_Days);
    })

}

function formatSpecificOptConsumptionData(data, Difference_In_Days) {
    var chartData = { EnergyCostDesign: [], Throughput: [], energycostActual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const optDate = new Date(element.date);
        chartData.EnergyCostDesign.push({ y: element.design, x: optDate });
        chartData.Throughput.push({ y: element.reference, x: optDate });
        chartData.energycostActual.push({ y: element.actual, x: optDate });
    }
    console.log("Optchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 10);
        } else {
            interval = 1;
        }

    }
    showSpecificOptConsumptionChart(chartData, Difference_In_Days, interval);
}

function showSpecificOptConsumptionChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("SVOptimizationsecgraph", {
        height: 242,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            gridThickness: 0,
            lineThickness: 0,
            labelFontColor: "#d9d9d9",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            tickLength: 0,
            lineThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",

        },
        dataPointMaxWidth: 15,
        axisY: {
            title: "INR/hr",
            gridDashType: "dot",
            gridThickness: 1,
            labelFontColor: "#d9d9d9",

        },
        axisY2: {
            title: "MT/hr",
            gridThickness: 0,
            labelFontColor: "#d9d9d9",


        },
        data: [{
            type: "column",
            color: "#00b0f0",
            name: "Throughput",
            //showInLegend: true,
            axisYType: "secondary",
            // toolTipcontent: "{name}: {y}",
            dataPoints: data.Throughput
        },
        {
            type: "line",
            color: "#ffc000",
            name: "Optimized",
            markerSize: 0,
            lineThickness: 4,
            // toolTipcontent: "{name}: {y}",
            dataPoints: data.EnergyCostDesign
        },
        {
            type: "line",
            color: "#e97b31",
            name: "Actual",
            markerSize: 0,
            lineThickness: 4,
            // toolTipcontent: "{name}: {y}",
            dataPoints: data.energycostActual
        }

        ]
    });

    chart.render();
}

function optimizedtable() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/majorcontributor",
    }).done(function (data) {
        var table_data = '';
        var max1 = 500;
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.majorcontributor(INR/hr) + '</td>';
            table_data += '<td style="text-align: center;">' + value.Actual + '</td>';
            table_data += '<td style="text-align: center;">' + value.Optimized + '</td>';
            table_data += '<td>' + value.Deviation + '</td>';
           // table_data += '<td> <progress value =' + value.Deviation + ' max=' + max1 + '></progress></td>';
            table_data += '</tr>';
        });
        $('#optimizemajortable').append(table_data);

    })
}

function optimizedfuel() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/fuelsystemoverview",
    }).done(function (data) {
        var table_data = '';
        var max1 = 500;
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.fualsystemoverview + '</td>';
            table_data += '<td style="text-align: center;">' + value.actual + '</td>';
            table_data += '<td style="text-align: center;">' + value.design + '</td>';
            table_data += '<td style="text-align: center;">' + value.deviation + '</td>';
            // table_data += '<td> <progress value =' + value.deviation + ' max=' + max1 + '></progress></td>';
            table_data += '</tr>';
        });
        $('#optimizefueltable').append(table_data);

    })
}

function optimizedElectrical() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/electricalpowersystem",
    }).done(function (data) {
        var table_data1 = '';
        var max1 = 700;
        $.each(data, function (key, value) {
            table_data1 += '<tr>';
            table_data1 += '<td>' + value.ElectricalPS + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.Actual + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.Design + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.Deviation + '</td>';
            // table_data1 += '<td> <progress value =' + value.Deviation + ' max=' + max1 + '></progress></td>';
            table_data1 += '</tr>';
        });
        $('#optimizeelectricitytable').append(table_data1);

    })
}

function steamPotential() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: 'http://localhost:8090/EmsPNC/potentialopportunity',
    }).done(function (data) {
        document.getElementById("num").innerHTML = data.potentialopportunity;
        document.getElementById("num-Actual").innerHTML = data.actualCost;
        document.getElementById("num-Optimum").innerHTML = data.designCost;

    });
}

function recommendations() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/recommendation",
    }).done(function (data) {
        getrecommendations(data)
    })

}
function getrecommendations(data) {
    console.log(data, "hiii");
    var table_data = '';
    var max1 = 700;
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.message + '</td>';
        table_data += '</tr>';
    });
    $('#recommendations').append(table_data);

}
function optimizedtable() {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/fuelsystemoverview",
    }).done(function (data) {
        var table_data = '';
        var max1 = 700;
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.majorcontributor + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.design + '</td>';
            table_data += '<td>' + value.deviation + '</td>';
            // table_data += '<td> <progress value =' + value.deviation + ' max=' + max1 + '></progress></td>';
            table_data += '</tr>';
        });
        $('#optimizemajortable').append(table_data);

    })
}