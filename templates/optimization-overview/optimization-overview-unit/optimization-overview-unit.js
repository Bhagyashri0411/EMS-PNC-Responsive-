$(document).ready(function () {

    $("#fuel").load("./../../templates/energy-overview/fuel/fuel.html", function () { });
    $("#left-sidebar").load("./../templates/left-sidebar/left-sidebar.html");
    $("#bs-example-navbar-collapse-1").load("./../templates/nav/nav.html", function () {
        document.getElementById("user").innerHTML = sessionStorage.getItem("user");
    });
    optimizedtable();
    optimizedfuel();
    optimizedElectrical();

   const b =new Date(sessionStorage.getItem("lastUpdateddate"));
   const dmonth = b.getMonth() + 1;
   const setdate = String(b.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + b.getFullYear() + " " + String(b.getHours()).padStart(2, '0') + ":" + String(b.getMinutes()).padStart(2, '0') + ":" + String(b.getSeconds()).padStart(2, '0');
   document.getElementById("optTime").innerHTML = setdate
  
    $("input[name=fromOpt]").on('change', function () {

        document.getElementById("optimizedrop").min = $('#fromopt').val();
        getSpecificOptConsumptionData();
    });
    $("#optimizedrop").on('change', function () {

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

        url: "http://localhost:8090/EmsPNC/OptimizationOverview/overallenergycost",
    }).done(function (data) {
        // console.log(data, "data 12")
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificOptConsumptionData(data, Difference_In_Days);
    })

}

function formatSpecificOptConsumptionData(data, Difference_In_Days) {
    var chartData = { design: [], reference: [], actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const optDate = new Date(element.date);
        chartData.design.push({ y: element.design, x: optDate });
        chartData.reference.push({ y: element.reference, x: optDate });
        chartData.actual.push({ y: element.actual, x: optDate });
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
            dataPoints: data.reference
        },
        {
            type: "line",
            color: "#ffc000",
            name: "Optimized",
            markerSize: 0,
            lineThickness: 4,
            // toolTipcontent: "{name}: {y}",
            dataPoints: data.design
        },
        {
            type: "line",
            color: "#e97b31",
            name: "Actual",
            markerSize: 0,
            lineThickness: 4,
            // toolTipcontent: "{name}: {y}",
            dataPoints: data.actual
        }

        ]
    });

    chart.render();
}

function optimizedfuel() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/OptimizationOverview/fuelsystemoverview",
    }).done(function (data) {
        var table_data = '';
        var max1 = 500;
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.name + '</td>';
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
        url: "http://localhost:8090/EmsPNC/OptimizationOverview/electricalpowersystem",
    }).done(function (data) {
        var table_data1 = '';
        var max1 = 700;
        $.each(data, function (key, value) {
            table_data1 += '<tr>';
            table_data1 += '<td>' + value.name + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.actual + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.design + '</td>';
            table_data1 += '<td style="text-align: center;">' + value.deviation + '</td>';
            // table_data1 += '<td> <progress value =' + value.Deviation + ' max=' + max1 + '></progress></td>';
            table_data1 += '</tr>';
        });
        $('#optimizeelectricitytable').append(table_data1);

    })
}

function optimizedtable() {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8090/EmsPNC/OptimizationOverview/majorcontributor",
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
