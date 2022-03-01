$(document).ready(function () {
    hdpeloadGaugeChart();
    hdpeOverview();
    hdpebreakOverview();
    shdpebreakOverview();
    cardhdpe1()
    // cardhdpe2();
    hdpeGaugeChart()

    getDoughnuthdpe();

    $(".hdpe-doughnut").click(function () {
        console.log($("input[name=ratio-name]:checked").val());
        var abc = $("input[name=ratio-name]:checked").val()
        getDoughnuthdpe(abc);
    });

});


function hdpeloadGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/fccu/specificenergyConsumption",
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
        // url: "http://localhost:8090/EmsPNC/fccu/specificenergyConsumption",
        url: "http://192.168.1.119:8090/auth/HDPE/specificenergyConsumption",
    }).done(function (gaugevalue) {
        hdpeGaugeChartvalue(gaugevalue);
        guagevaluehdpeAct()
        
    });
}
function guagevaluehdpeAct() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/fccu/specificenergyConsumption",
        // url: 'http://localhost:8090/EmsPNC/auth/HDPE/specificenergyConsumption',

    }).done(function (data) {
    document.getElementById("devhdpe").innerHTML = data.deviation + "%";
    document.getElementById("acthdpe").innerHTML = data.actual;
    document.getElementById("opthdpe").innerHTML = data.reference;
    });

}

function hdpebreakOverview() {
    $.ajax({
        url: "http://192.168.1.119:8090/auth/HDPE/SECSteamTabledata",
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
        table_data += '<td class=" product">' + value.product + '</td>';
        table_data += '</tr>';

    });
    $('#Break_table').append(table_data);
}

function shdpebreakOverview() {
    $.ajax({
        url: "http://192.168.1.119:8090/auth/HDPE/SECSteam",
        method: "GET"
    }).done(function (data) {
        console.log(data,);
        getshdpebreakOverview(data);

    })
        
}
function getshdpebreakOverview(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.id + '</td>';
        table_data += '<td class="percents ">' + value.produt + '</td>';
        table_data += '<td class=" product">' + value.value + '</td>';
        table_data += '</tr>';

    });
    $('#shptable').append(table_data);
}

function hdpeOverview() {
    $.ajax({
        url: "http://192.168.1.119:8090/auth/HDPE/parameterhdpe",
        method: "GET"
    }).done(function (data) {
        gethdpeOverview(data);
    })
        // .fail(function () {
        //     var failData = [{ parameter: "S4 Selectivity", UOM: "-", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "CO2 Production", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "EOE", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "Total Electricity Consumption", UOM: "MWh", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "GHG Emission (tCO2e)", UOM: "Ton/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     ]

        //     gethdpeOverview(failData);
        // })
}

function gethdpeOverview(data) {
    var table_data = '';
    $.each(data, function (key, value) {

        table_data += '<tr>';
        table_data += '<td>' + value.parameter + '</td>';
        table_data += '<td class="hdpe-tab">' + value.uom + '</td>';
        table_data += '<td class="hdpe-tab">' + value.reference + '</td>';
        table_data += '<td class="hdpe-tab">' + value.actual + '</td>';
        table_data += '<td class="hdpe-tab">' + value.deviation + '</td>';
        table_data += '</tr>';

    });
    $('#Parameter_table').append(table_data);
}

function cardhdpe1() {
    $.ajax({
        url: 'http://192.168.1.119:8090/auth/HDPE/SECElectricity',
        method: "GET"
    }).done(function (data) {
        getcardhdpe1(data)
    })
        
}
function getcardhdpe1(data) {
    document.getElementById("count-hdpe1").innerHTML = data.reference;
    if (data.deviation > 0) {
        document.getElementById("result-hdpe1").innerHTML = "+" + data.deviation;
    }
    else {
        document.getElementById("result-hdpe1").innerHTML = data.deviation;
    }
    document.getElementById("ref-hdpe1").innerHTML = data.actual;
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


function getDoughnuthdpe() {
    var myJSON = { uom: $("input[name=ratio-name]:checked").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.119:8090/auth/HDPE/FCCUDoughnut",
    }).done(function (data) {
        var energyConsumed = data[0].energyConsumed;
            console.log(energyConsumed);

            loadDoughnutHoriCharthdpe1(energyConsumed);
    })
        

}
function loadDoughnutHoriCharthdpe1(energyConsumed) {
    // console.log(energyConsumed)
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",    //yellow
        "#00aa7e",  //green
        // "#005374"   //blue
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("titles-hdpe", {

        colorSet: "greenShades",
        height: 120,
        // width: 160,
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
                // { y: energyConsumed.fuel, name: "Fuel", indexLabel: ((energyConsumed.fuel / energyConsumed.total) * 100).toFixed(2) + "% " },
                { y: energyConsumed.steam, name: "Steam", indexLabel: ((energyConsumed.steam / energyConsumed.total) * 100).toFixed(2) + "% " },
                { y: energyConsumed.electicity, name: "Electricity", indexLabel: ((energyConsumed.electicity / energyConsumed.total) * 100).toFixed(2) + "% " }
            ]
        }]
    });

    chart.render();
}