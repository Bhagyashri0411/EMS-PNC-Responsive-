$(document).ready(function () {
    hdpeloadGaugeChart();
    hdpeOverview();
    hdpebreakOverview();
    cardhdpe1()
    cardhdpe2();
    hdpeGaugeChart()


    var abc = 'MTOE/Ton';
    getDoughnuthdpe(abc);

    $(".hdpe-doughnut").click(function () {
        console.log($("input[name=ratio-name]:checked").val());
        var abc = $("input[name=ratio-name]:checked").val()
        getDoughnuthdpe(abc);
    });

});


function hdpeloadGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: "http://192.168.1.106:8090/home/speedometer",
    }).done(function (gaugevalue) {
        hdpeGaugeChartvalue(gaugevalue);
        console.log(gaugevalue)
    });
}

function hdpeGaugeChartvalue(gaugevalue) {
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
            id: 'hdpe-zingChart',
            data: myConfig12
        });
    }, 100);
}

function hdpeGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: "http://192.168.1.106:8090/avu1/specificenergyConsumption",
    }).done(function (gaugevalue) {
        hdpeGaugeChartvalue(gaugevalue);
        guagevaluehdpeAct()
    });
}
function guagevaluehdpeAct() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EMSPro/fccu/specificenergyConsumption",
        // url: 'http://192.168.1.106:8090/avu1/specificenergyConsumption',

    }).done(function (data) {
        document.getElementById("devhdpe").innerHTML = data.deviation + "%";
        document.getElementById("acthdpe").innerHTML = data.actual;
        document.getElementById("opthdpe").innerHTML = data.reference;
    });

}

function hdpebreakOverview() {
    $.ajax({
        url: "http://192.168.1.106:8090//api/srutgtuOverview/steamBalanceOverviewTable",
        method: "GET"
    }).done(function (data) {
        gethdpebreakOverview(data);
    })
        .fail(function () {
            var failData = [{ breakUp: "HP", percent: "XX", TtProduct: "XX" },
            { breakUp: "MHP", percent: "XX", TtProduct: "XX" },
            { breakUp: "MP", percent: "XX", TtProduct: "XX" },
            { breakUp: "LP", percent: "XX", TtProduct: "XX" }
            ]

            gethdpebreakOverview(failData);
        })
}

function gethdpebreakOverview(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.breakUp + '</td>';
        table_data += '<td class="percents ">' + value.percent + '</td>';
        table_data += '<td class=" product">' + value.TtProduct + '</td>';
        table_data += '</tr>';

    });
    $('#Break_table').append(table_data);
}

function hdpeOverview() {
    $.ajax({
        url: "http://192.168.0.132:8090//api/srutgtuOverview/steamBalanceOverviewTable",
        method: "GET"
    }).done(function (data) {
        getsrutgtuOverview(data);
    })
        .fail(function () {
            var failData = [{ parameter: "S4 Selectivity", UOM: "-", Reference: "xx", Actual: "xx", Deviation: "xx" },
            { parameter: "CO2 Production", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
            { parameter: "EOE", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
            { parameter: "Total Electricity Consumption", UOM: "MWh", Reference: "xx", Actual: "xx", Deviation: "xx" },
            { parameter: "GHG Emission (tCO2e)", UOM: "Ton/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
            ]

            gethdpeOverview(failData);
        })
}

function gethdpeOverview(data) {
    var table_data = '';
    $.each(data, function (key, value) {

        table_data += '<tr>';
        table_data += '<td>' + value.parameter + '</td>';
        table_data += '<td class="hdpe-tab">' + value.UOM + '</td>';
        table_data += '<td class="hdpe-tab">' + value.Reference + '</td>';
        table_data += '<td class="hdpe-tab">' + value.Actual + '</td>';
        table_data += '<td class="hdpe-tab">' + value.Deviation + '</td>';
        table_data += '</tr>';

    });
    $('#Parameter_table').append(table_data);
}

function cardhdpe1() {
    $.ajax({
        url: 'http://192.168.1.106:8090/home/totalenergyconsumed',
        method: "GET"
    }).done(function (data) {
        getcardhdpe1()
    })
        .fail(function () {
            var Faildata = {
                "kpivalue": 325,
                "refvalue": 25
            }
            getcardhdpe1(Faildata)
        })
}
function getcardhdpe1(data) {
    document.getElementById("count-hdpe1").innerHTML = data.refvalue;
    if (data.kpivalue > 0) {
        document.getElementById("result-hdpe1").innerHTML = "+" + data.kpivalue;
    }
    else {
        document.getElementById("result-hdpe1").innerHTML = data.kpivalue;
    }
    document.getElementById("ref-hdpe1").innerHTML = data.kpivalue;
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

function cardhdpe2() {
    $.ajax({
        url: 'http://192.168.1.106:8090/home/totalenergyconsumed',
        method: "GET"
    }).done(function (data) {
        getcardhdpe2()

    })
        .fail(function () {
            var faildata = {
                "refvalue": 325
            }
            getcardhdpe2(faildata)
        })

}
function getcardhdpe2(data) {
    document.getElementById("count-hdpe2").innerHTML = data.refvalue;
}

function getDoughnuthdpe(abc) {
    var myJSON = { uom: abc }
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
                "steam": 30,
                "electricity": 20,
                "fuel": 50
            }
            loadDoughnutChart(faildata)
        })

}
function loadDoughnutChart(data) {
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#00aa7e",
        "#005374"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("titles-hdpe", {

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
                { y: data.fuel, name: "Fuel" },
                { y: data.steam, name: "Steam" },
                { y: data.electricity, name: "Electricity" }
            ]
        }]
    });

    chart.render();
}