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
        url: "http://192.168.1.124:8090/pp/specificenergyConsumption",
        // url: "http://192.168.1.106:8090/home/speedometer",
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
        url: "http://192.168.1.124:8090/pp/specificenergyConsumption",
    }).done(function (data) {
        document.getElementById("devpp").innerHTML = data.deviation + "%";
        document.getElementById("actpp").innerHTML = data.actual;
        document.getElementById("optpp").innerHTML = data.reference;
    });
}
function cardpp1() {
    $.ajax({
        url: 'http://192.168.1.124:8090/pp/secsteamcart',
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
        url: 'http://192.168.1.124:8090/pp/secelectricitycart',
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
        url: 'http://192.168.1.124:8090/pp/totalelectricityConsumption',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count-pp3").innerHTML = data.totalelectricityConsumption;
    })
}
function cardpp4() {
    $.ajax({
        url: 'http://192.168.1.124:8090/pp/totalelectricityConsumptionSHPEquivalent',
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
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.124:8090/pp/PPDoughnu",
    }).done(function (data) {
        CanvasJS.addColorSet("greenShades", [
            "#ffa600",
            "#00aa7e"
        ]);
        var dataPoints = [];
        var chart = new CanvasJS.Chart("titles-pp", {

            colorSet: "greenShades",
            // height: 130,
            // width: 190,
            theme: "dark1",
            backgroundColor: "#26293c",

            title: {
                text: data.total,
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
                toolTipContent: "{name} : {y}%",
                indexLabel: " {y}%",
                yValueFormatString: "#,###",
                indexLabelPlacement: "outside",
                startAngle: 120,
                dataPoints: [
                    // { y: data.fuel, name: "Fuel" },
                    { y: data.steam, name: "Steam" },
                    { y: data.electricity, name: "Electricity" }
                ]
            }]
        });

        chart.render();
    })

}