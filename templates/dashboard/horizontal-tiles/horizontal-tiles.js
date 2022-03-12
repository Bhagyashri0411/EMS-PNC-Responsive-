$(document).ready(function () {
    var abc = 'Ton/hr';
    getDoughnutData(abc);
    loadGaugeChartData();
    guagevaluehomeAct();
    getcardhome1();
    getcardhome2();

    getcardhome3();
    var abc = 'Ton/hr';


    $(".donougt-radio").click(function () {
        console.log($("input[name=fav_language]:checked").val());
        var abc = $("input[name=fav_language]:checked").val()
        getDoughnutData(abc);
    });
});

function pageRedirect() {
    window.location.href = "energy-overview.html";
}

function getDoughnutData(abc) {
    var myJSON = { uom: abc }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/home/totalfuelconsumed",
    }).done(function (data) {
        loadDoughnutChart(data);
    })

}
function loadDoughnutChart(data) {
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#00aa7e",
        "#005374"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("tiles-doughnut", {

        colorSet: "greenShades",
        // height: 145,
        // width: 190,
        theme: "dark1",
        backgroundColor: "#26293c",

        title: {
            text: data.totalfuel.toFixed(2),
            verticalAlign: "center",
            dockInsidePlotArea: true,
            fontWeight: 700,
            fontColor: "#f2f2f2",
            fontFamily: "Bahnschrift Light"
        },
        legend: {
            horizontalAlign: "right",
            verticalAlign: "center", // "top" , "bottom"
            fontSize: 15,
        },
        axisY: {
            title: "Units",
            titleFontSize: 24,
            includeZero: true

        },
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },
        data: [{
            type: "doughnut",
            showInLegend: false,
            // toolTipContent: "{name} : {y}%",
            // indexLabel: " {y}%",
            yValueFormatString: "0.00#",
            indexLabelPlacement: "outside",
            startAngle: 120,
            dataPoints: [
                // { y: data[0].solid, name: "Solid" },
                { y: data.liquid, name: "Liquid", indexLabel:((data.liquid / data.totalfuel) * 100).toFixed(2) + "%" },
                { y: data.gas, name: "Gas", indexLabel: ((data.gas / data.totalfuel) * 100).toFixed(2) + "%" },
            ]
        }]
    });

    chart.render();
}

function loadGaugeChartData() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        type: "GET",
        url: "http://localhost:8090/home/speedometer",
    }).done(function (gaugevalue) {
        console.log(gaugevalue)
        loadGaugeChart(gaugevalue);
    });
}
function guagevaluehomeAct() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: 'http://localhost:8090/home/speedometer',

    }).done(function (data) {
        document.getElementById("dev").innerHTML = data.deviation + '%';
        document.getElementById("act1").innerHTML = data.actual;
        document.getElementById("opt1").innerHTML = data.optimized;
    });

}

function loadGaugeChart(gaugevalue) {
    ZC.LICENSE = ["b55b025e438fa8a98e32482b5f768ff5"];
    var myConfig12 = {
        "type": "gauge",
        "height": "20%",
        "width": "70%",
        "x": "10%",
        "backgroundColor": "#26293c",
        "scale": {
            "size-factor": "200%", //Modify your gauge chart size.
            offsetY: '10px'
        },
        plotarea: {
            padding: '10 0 0 0'
        },
        "scale-r": {
            "aperture": 180,
            "values": "0:100:0",
            item: {
                'font-color': "#d9d9d9",
                'offset-r': -10,
                'font-size': 10,
            },
            "center": {
                "size": 4,
                "background-color": "transparent",
                "border-color": "none"
            },
            "ring": {
                "size": 24,
                "rules": [{
                    "rule": "%v >= 0 && %v <= 10",
                    "background-color": "#02b04f"
                },

                {
                    "rule": "%v >= 11 && %v <= 30",
                    "background-color": "#ffc000"
                },

                {
                    "rule": "%v >= 31 && %v <=100",
                    "background-color": "#ff0000"
                }
                ]
            },
            "guide": {
                "alpha": 0.8
            }
        },
        "plot": {
            "csize": "3%",
            "size": "100%",
            "background-color": "black"
        },
        "series": [{
            "background-color": "black",
            "values": gaugevalue.sec,
            //"values":[50],
        }]
    };

    setTimeout(() => {
        zingchart.render({
            id: 'zingChart',
            data: myConfig12
        });
    }, 100);
}

function getcardhome1() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: 'http://localhost:8090/home/totalenergyconsumed',
        method: "GET"
    }).done(function (data) {


        document.getElementById("resulthome1").innerHTML = data.currentvalue;
        document.getElementById("ref1").innerHTML = data.refvalue;
        document.getElementById("countHorizon1").innerHTML = data.kpivalue;
        if (data.currentvalue > 0) {
            document.getElementById("resulthome1").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("resulthome1").innerHTML = data.currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}

function getcardhome2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: 'http://localhost:8090/home/GHGemmission',
        method: "GET"
    }).done(function (data) {

        document.getElementById("resulthome2").innerHTML = data.currentvalue;
        document.getElementById("ref2").innerHTML = data.refvalue;
        document.getElementById("countHorizon2").innerHTML = data.kpivalue;
        if (data.currentvalue > 0) {
            document.getElementById("resulthome2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("resulthome2").innerHTML = data.currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}
function getcardhome3() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: 'http://localhost:8090/home/SpecificEnergyConsumption',
        method: "GET"
    }).done(function (data) {

        document.getElementById("resulthome3").innerHTML = data.currentvalue;
        document.getElementById("ref3").innerHTML = data.refvalue;
        document.getElementById("countHorizon3").innerHTML = data.kpivalue;
        if (data.currentvalue > 0) {
            document.getElementById("resulthome3").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("resulthome3").innerHTML = data.currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}