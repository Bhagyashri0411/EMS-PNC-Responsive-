$(document).ready(function () {
    pploadGaugeChart();
    cardpp1();
    cardpp2();
    cardpp3();
    cardpp4()
    ppGaugeChart()
    getDoughnutpp();
    $(".pp-doughnut").click(function () {
        console.log($("input[name=ratio-name]:checked").val());
        var abc = $("input[name=ratio-name]:checked").val()
        getDoughnutpp(abc);
    });

});

function pploadGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/pp/specificenergyConsumption",
    }).done(function (data) {
        ZC.LICENSE = ["b55b025e438fa8a98e32482b5f768ff5"];
        var myConfig12 = {
            "type": "gauge",
            "height": "19%",
            "width": "60%",
            "x": "20%",
            "backgroundColor": "#26293c",
            "scale": {
                "size-factor": "250%", //Modify your gauge chart size.
                offsetY: '10px'
            },
            plotarea: {
                padding: '10 0 0 0'
            },
            "scale-r": {
                "aperture": 180,
                "values": "0:100:0",
                item: {
                    'font-color': "#bfbfbf",
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
                "values": data.specificenergy,
            }]
        };

        setTimeout(() => {
            zingchart.render({
                id: 'pp-zingChart',
                data: myConfig12
            });
        }, 100);
    });
}

function ppGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/pp/specificenergyConsumption",
    }).done(function (data) {
        document.getElementById("devpp").innerHTML = data.deviation + "%";
        document.getElementById("actpp").innerHTML = data.actual;
        document.getElementById("optpp").innerHTML = data.reference;
    });
}
function cardpp1() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/pp/secsteamcart',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count-pp1").innerHTML = data.tagvalue;
        document.getElementById("ref-pp1").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result-pp1").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result-pp1").innerHTML = data.currentvalue;
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
    })
}
function cardpp2() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/pp/secelectricitycart',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count-pp2").innerHTML = data.tagvalue;
        document.getElementById("ref-pp2").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result-pp2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result-pp2").innerHTML = data.currentvalue;
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
    })
}
function cardpp3() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/pp/totalelectricityConsumption',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count-pp3").innerHTML = data.totalelectricityConsumption;
    })
}
function cardpp4() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/pp/totalelectricityConsumptionSHPEquivalent',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count-pp4").innerHTML = data.totalelectricityConsumptionshp;
    })
}
function getDoughnutpp() {
    var myJSON = { uom: $("input[name=ratio-name]:checked").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/pp/PPDoughnut",
    })
    .done(function (data) {
        var energyConsumed = data[0].energyConsumed;
        console.log(energyConsumed);

        loadDoughnutChartpp(energyConsumed);

    })
    
}
function loadDoughnutChartpp(energyConsumed) {
    // console.log(energyConsumed)
    CanvasJS.addColorSet("greenShades", [
         "#ffa600",
        "#00aa7e",
        //"#005374"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("titles-pp", {

        colorSet: "greenShades",
        // height: 120,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: energyConsumed.total.toFixed(2),
            verticalAlign: "center",
            dockInsidePlotArea: true,
            fontWeight: 500,
            fontColor: "#f2f1e7",
            fontFamily: "Bahnschrift Light"
        },

        axisY: {
            title: "Units",
            titleFontSize: 24,
            includeZero: true

        },

        data: [{
            type: "doughnut",
            yValueFormatString: "0.00#",
            indexLabelPlacement: "outside",
            startAngle: 100,
            dataPoints: [
                { y: energyConsumed.fuel, name: "Fuel", indexLabel: ((energyConsumed.fuel / energyConsumed.total) * 100).toFixed(2) + "% " },
                { y: energyConsumed.steam, name: "Steam", indexLabel: ((energyConsumed.steam / energyConsumed.total) * 100).toFixed(2) + "% " },
                { y: energyConsumed.electicity, name: "Electricity", indexLabel: ((energyConsumed.electicity / energyConsumed.total) * 100).toFixed(2) + "% " }
            ]
        }]
    });

    chart.render();
}