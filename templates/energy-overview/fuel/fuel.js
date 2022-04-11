$(document).ready(function () {
    loadCardfuel1();
    loadCardfuel2();
    // var xyz = "TON/HR";
    $("input[name=from]").on('change', function (event) {

        document.getElementById("PNCfuelto").min = $('#PNCfuelfrom').val();
        getSpecificFuelPNCData();
    });
    $("input[name=srs]").on('change', function (event) {
        getSpecificFuelPNCData();
    });

    $("#PNCfuelto").on('change', function () {

        document.getElementById("PNCfuelfrom").max = $('#PNCfuelto').val();
        getSpecificFuelPNCData();
    });

    // // setting from date, to date - 24hrs.
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#PNCfuelfrom').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#PNCfuelto').val(tod.toJSON().slice(0, 19));
    document.getElementById("PNCfuelto").min = $('#PNCfuelfrom').val();
    document.getElementById("PNCfuelfrom").max = $('#PNCfuelto').val();
    console.log(d, 'daa');
    // console.log(new Date(d.toJSON()), 'JSON');

    getSpecificFuelPNCData();

    // for doughnut radio button
    getFuelDoughnutData();
    $(".fuel-doughnut").click(function () {
        var xyz = $("input[name=dtdt]:checked").val()
        getFuelDoughnutData(xyz);
    });
    getFuelDoughnutData();
});


function getSpecificFuelPNCData() {
    var myJSON = { 'fromdate': $('#PNCfuelfrom').val(), 'uom': $("input[type=radio][name=srs]:checked").val(), 'day': $('#PNCfuelto').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EMSPNC/auth/Fuel/fuelgraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificFuelPNCData(data, Difference_In_Days);

    })
}

function formatSpecificFuelPNCData(data, Difference_In_Days) {
    var chartData = { Throughput: [], FuelConsumption: [] };
    var minMaxThroughput = [];
    var minMaxTEC = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const fuelDate = new Date(element.date);
        chartData.FuelConsumption.push({ y: element.fuelConsumption, x: fuelDate });
        chartData.Throughput.push({ y: element.throughput, x: fuelDate });
        minMaxThroughput.push(element.throughput);
        minMaxTEC.push(element.fuelConsumption);
    }
    console.log("chartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificFuelPNCChart(chartData, Difference_In_Days, interval ,minMaxThroughput ,minMaxTEC);
}


function getFuelDoughnutData() {
    var myJSON = { uom: $("input[name=dtdt]:checked").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EMSPNC/auth/Fuel/totalfuelconsumed",
    }).done(function (data) {
        if (myJSON.uom == 'INR/hr') {

            loadDoughnutChartFuelINR(data);
        }
        else {

            loadDoughnutChartFuel(data);
        }
    })
        .fail(function () {
            var faildata = {};
            var faildata = { 'liquid': 100, 'gas': 156, 'total': 277 }
            console.log(postdata, 'hiii');
            var faildata = { 'bfo': 100, 'rlng': 156, 'total': 277, 'off': 100, 'hsd': 100, 'Grease': 90 }

            if (myJSON.uom == 'INR/hr')
                if (myJSON.uom == 'INR/hr') {


                    loadDoughnutChartFuelINR(faildata);

                }
                else {
                    loadDoughnutChartFuel(faildata);
                }
        })

}
function loadDoughnutChartFuelINR(data) {
    CanvasJS.addColorSet("greenShades", [ //colorSet Array
        "#ffa600",
        "#ffa600",
        "#ffa600",

        "#00aa7e",
        "#00aa7e",


        //  "#ffa600",
        // "#00aa7e",
        // "#00aa7e",
        // "#00aa7e",
        // "#005374",
        // "#005374",
        // "#005374",

    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("doughnutChart", {
        colorSet: "greenShades",
        height: 150,
        // width: 180,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: data[0].total.toFixed(2),
            verticalAlign: "center",
            dockInsidePlotArea: true,
            fontSize: 15,
            fontWeight: 700,
            // fontColor : "white",
     fontColor :data[0].colorcode == 'none'? "white":data[0].colorcode,
            fontFamily: "Bahnschrift Light"

        },
        axisY: {
            title: "Units",
            titleFontSize: 24,
            includeZero: true

        },
        data: [{
            type: "doughnut",
            // showInLegend: true,
            // toolTipContent: " {name}:{y}%",
            // indexLabel: " {y}%",
            yValueFormatString: "0.00#",
            indexLabelPlacement: "outside",
            startAngle: 64,
            dataPoints: [
                { y: data[0].bfo, name: "BFO", indexLabel: ((data[0].bfo / data[0].total) * 100).toFixed(2) + "%" },
                { y: data[0].hsd, name: "HSD", indexLabel: ((data[0].hsd / data[0].total) * 100).toFixed(2) + "%" },
                { y: data[0].Grease, name: "GREASE", indexLabel: ((data[0].Grease / data[0].total) * 100).toFixed(2) + "%" },
                { y: data[0].off, name: "OFFGAS", indexLabel: ((data[0].off / data[0].total) * 100).toFixed(2) + "%" },
                { y: data[0].rlng, name: "RLNG", indexLabel: ((data[0].rlng / data[0].total) * 100).toFixed(2) + "%" },
            ]
        }]
    });

    chart.render();
}
function loadDoughnutChartFuel(data) {
    CanvasJS.addColorSet("greenShades", [ //colorSet Array

        "#ffa600",
        "#00aa7e",
        "#005374",

    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("doughnutChart", {
        colorSet: "greenShades",
        height: 150,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: data[0].total.toFixed(2),
            verticalAlign: "center",
            dockInsidePlotArea: true,
            fontWeight: 300,
            // fontColor : "white",
             fontColor :data[0].colorcode == 'none'? "white":data[0].colorcode,
            fontFamily: "Bahnschrift Light"

        },
        axisY: {
            title: "Units",
            titleFontSize: 14,
            includeZero: true

        },
        data: [{
            type: "doughnut",
            yValueFormatString: "0.00#",
            indexLabelPlacement: "outside",
            startAngle: 64,
            dataPoints: [
                { y: data[0].liquid, name: "Liquid", indexLabel: ((data[0].liquid / data[0].total) * 100).toFixed(2) + "%" },
                { y: data[0].gas, name: "Gas", indexLabel: ((data[0].gas / data[0].total) * 100).toFixed(2) + "%" },

            ]
        }]
    });

    chart.render();
}


function showSpecificFuelPNCChart(data, Difference_In_Days, interval, minMaxThroughput ,minMaxTEC) {
    var minValueThroughput = Math.min(...minMaxThroughput);
 var maxValueThroughput = Math.max(...minMaxThroughput);
 var minValueminMaxTEC = Math.min(...minMaxTEC);
 var maxValueminMaxTEC = Math.max(...minMaxTEC);
    var chart = new CanvasJS.Chart("fuel-chart-container", {
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            labelFontColor: "#d9d9d9",
            lineColor: "gray",
            tickThickness: 0,
            intervalType: Difference_In_Days == 1 ? "hour" : "day",
            valueFormatString: Difference_In_Days == 1 ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == 1 ? "In hours" : "In Days",
            interval: interval,
            //labelAngle: -20,
            titleFontSize: 14,
        },

        dataPointMaxWidth: 15,
        axisY: {
            title: "Specific Fuel Consumption " + $("input[type=radio][name=srs]:checked").val() + "of Product",
            titleFontSize: 15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            minimum : minValueminMaxTEC - 0.02,
            maximum :  maxValueminMaxTEC + 0.02

        },
        axisY2: {
            title: "MT/Day",
            titleFontSize: 15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            minimum : minValueThroughput - 100,
            maximum : maxValueThroughput + 100
        },
        data: [{
            type: $("#chartType1 option:selected").val(),
            color: "#00b0f0",
            name: "Throughput",
            markerSize: 0,
            axisYType: "secondary",
            yValueFormatString: "0.00#",
            dataPoints: data.Throughput

        },
        {
            type: $("#chartType option:selected").val(),
            color: "#ED7E31",
            name: "Specific Fuel Consumption",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.FuelConsumption
        }

        ]
    });

    chart.render();
    renderdatagraph(chart)
}
function renderdatagraph(chart) {
    var chartType = document.getElementById('chartType');
    chartType.addEventListener("change", function () {
        chart.options.data[1].type = chartType.options[chartType.selectedIndex].value;
        chart.render();
    });

    var chartType1 = document.getElementById('chartType1');
    chartType1.addEventListener("change", function () {
        chart.options.data[0].type = chartType1.options[chartType1.selectedIndex].value;
        chart.render();
    });
}

function loadCardfuel1() {
    $.ajax({
        method: "GET",

        url: "http://localhost:8090/EMSPNC/auth/Fuel/secfuelMTMT",



    }).done(function (data) {
        console.log(data, "321222");
        document.getElementById("count_fuel1").innerHTML = data.tagvalue;
        document.getElementById("count_fuel1").style.color =data.colorcode == "none" ? "white" : data.colorcode;
        document.getElementById("ref_fuel1").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result_fuel1").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_fuel1").innerHTML = data.currentvalue;
        }

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });
    })
}

function loadCardfuel2() {
    $.ajax({
        method: "GET",

        url: "http://localhost:8090/EMSPNC/auth/Fuel/secfuelToeMT",



    }).done(function (data) {
        console.log(data, "321222");
        document.getElementById("count_fuel2").innerHTML = data.tagvalue;
       document.getElementById("count_fuel2").style.color =data.colorcode == "none" ? "white" : data.colorcode;
        document.getElementById("ref_fuel2").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result_fuel2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_fuel2").innerHTML = data.currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });
    })
}