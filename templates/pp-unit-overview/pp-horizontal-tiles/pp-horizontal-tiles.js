$(document).ready(function () {
    pploadGaugeChart();
    pptable();
    cardpp1();
    cardpp2();
    cardpp3();
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
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: "http://192.168.1.106:8090/home/speedometer",
    }).done(function (gaugevalue) {
        ppGaugeChartvalue(gaugevalue);
        console.log(gaugevalue)
    });
}

function ppGaugeChartvalue(gaugevalue) {
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
            "values": gaugevalue.TagValue,
        }]
    };

    setTimeout(() => {
        zingchart.render({
            id: 'pp-zingChart',
            data: myConfig12
        });
    }, 100);
}

function ppGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: "http://192.168.1.106:8090/avu1/specificenergyConsumption",
    }).done(function (gaugevalue) {
        ppGaugeChartvalue(gaugevalue);
        guagevalueppAct()
    });
}
function guagevalueppAct() {
    $.ajax({
        method: "GET",        
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: 'http://192.168.1.106:8090/avu1/specificenergyConsumption',

    }).done(function (data) {
        document.getElementById("devpp").innerHTML = data.deviation + "%";
        document.getElementById("actpp").innerHTML = data.actual;
        document.getElementById("optpp").innerHTML = data.reference;
    });

}

function pptable() {
    $.ajax({
        url: "http://192.168.1.106:8090//api/srutgtuOverview/steamBalanceOverviewTable",
        method: "GET"
    }).done(function (data) {
        getpptable(data);
    })
        .fail(function () {
            var failData = [{ type: "LP", percent: "XX", Ttfeed: "XX" }
            ]

            getpptable(failData);
        })
}

function getpptable(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.type + '</td>';
        table_data += '<td>' + value.percent + '</td>';
        table_data += '<td>' + value.Ttfeed + '</td>';
        table_data += '</tr>';

    });
    $('#pptable').append(table_data);
}


function cardpp1() {
    $.ajax({
        url: 'http://192.168.1.124:8090/pp/secsteamcart',
        method: "GET"
    }).done(function (data) {
        getcardpp1()
    })
        .fail(function () {
            var Faildata = {
                "kpivalue": 325,
                "refvalue": 25
            }
            getcardpp1(Faildata)
        })
}
function getcardpp1(data) {
    document.getElementById("count-pp1").innerHTML = data.refvalue;
    if (data.kpivalue > 0) {
        document.getElementById("result-pp1").innerHTML = "+" + data.kpivalue;
    }
    else {
        document.getElementById("result-pp1").innerHTML = data.kpivalue;
    }
    document.getElementById("ref-pp1").innerHTML = data.refvalue;
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
}

function cardpp2() {
    $.ajax({
        url: 'http://192.168.1.106:8090/home/totalenergyconsumed',
        method: "GET"
    }).done(function (data) {
        getcardpp2()

    })
        .fail(function () {
            var faildata = {
                "refvalue": 325
            }
            getcardpp2(faildata)
        })

}
function getcardpp2(data) {
    document.getElementById("count-pp2").innerHTML = data.refvalue;
}

function cardpp3() {
    $.ajax({
        url: 'http://192.168.1.106:8090/home/totalenergyconsumed',
        method: "GET"
    }).done(function (data) {
        getcardpp3()

    })
        .fail(function () {
            var faildata = {
                "refvalue": 5
            }
            getcardpp3(faildata)
        })

}
function getcardpp3(data) {
    document.getElementById("count-pp3").innerHTML = data.refvalue;
}
function getDoughnutpp() {
    var myJSON = { uom: $("input[name=ratio-name]:checked").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.16:8090/home/totalfuelconsumed1",
    }).done(function (data) {
        loadDoughnutChart(data);
    })
        .fail(function () {
            var faildata =
            {
                "total": 100,
                "electricity": 50,
                "steam": 50
            }
            loadDoughnutChart(faildata)
        })

}
function loadDoughnutChart(data) {
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
}