$(document).ready(function () {
    megloadGaugeChart();
    megOverview();
    megbreakOverview();
    parametertableMEG();
    cardmeg1()
    // megGaugeChart()
    guagevaluemegAct();

    getDoughnutmeg();

    $(".meg-doughnut").click(function () {
        console.log($("input[name=ratio-name]:checked").val());
        var abc = $("input[name=ratio-name]:checked").val()
        getDoughnutmeg(abc);
    });

});


function megloadGaugeChart() {
    $.ajax({
        type: "GET",
        
        // url: "http://localhost:8080/fccu/specificenergyConsumption",
        url: "http://192.168.1.109:8090/MEG/GUAGEspecificenergyConsumption",
    }).done(function (gaugevalue) {
        megGaugeChartvalue(gaugevalue);
        console.log(gaugevalue)
    });
}

function megGaugeChartvalue(gaugevalue) {
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
            id: 'meg-zingChart',
            data: myConfig12
        });
    }, 100);
}
function guagevaluemegAct() {
    $.ajax({
        method: "GET",        
        // url: "http://localhost:8080/fccu/specificenergyConsumption",
        url: 'http://192.168.1.109:8090/MEG/GUAGEspecificenergyConsumption',

    }).done(function (data) {
        document.getElementById("devmeg").innerHTML = data.deviation + "%";
        document.getElementById("actmeg").innerHTML = data.actual;
        document.getElementById("optmeg").innerHTML = data.reference;
    });

}

function megbreakOverview() {
    $.ajax({
        url: "http://192.168.1.106:8090//api/srutgtuOverview/steamBalanceOverviewTable",
        method: "GET"
    }).done(function (data) {
        getmegbreakOverview(data);
    })
        .fail(function () {
            var failData = [{ breakUp: "HP", percent: "XX", TtProduct: "XX" },
            { breakUp: "MHP", percent: "XX", TtProduct: "XX" },
            { breakUp: "MP", percent: "XX", TtProduct: "XX" },
            { breakUp: "LP", percent: "XX", TtProduct: "XX" }
            ]

            getmegbreakOverview(failData);
        })
}

function getmegbreakOverview(data) {
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

function megOverview() {
    $.ajax({
        url: "http://192.168.1.109:8090/MEG/MEGParameterTable",
        method: "GET"
    }).done(function (data) {
        getmegOverview(data);
    })
        // .fail(function () {
        //     var failData = [{ parameter: "S4 Selectivity", UOM: "-", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "CO2 Production", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "EOE", UOM: "T/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "Total Electricity Consumption", UOM: "MWh", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     { parameter: "GHG Emission (tCO2e)", UOM: "Ton/hr", Reference: "xx", Actual: "xx", Deviation: "xx" },
        //     ]

        //     getmegOverview(failData);
        // })
}

function getmegOverview(data) {
    var table_data = '';
    $.each(data, function (key, value) {

        table_data += '<tr>';
        table_data += '<td>' + value.Parameter + '</td>';
        table_data += '<td class="meg-tab">' + value.UOM + '</td>';
        table_data += '<td class="meg-tab">' + value.Reference + '</td>';
        table_data += '<td class="meg-tab">' + value.Actual + '</td>';
        table_data += '<td class="meg-tab">' + value.Deviation + '</td>';
        table_data += '</tr>';

    });
    $('#Parameter_table_meg').append(table_data);
}

function cardmeg1() {
    $.ajax({
        url: 'http://192.168.1.109:8090/MEG/MEGtotalSteamConsumptioncard',
        method: "GET"
    }).done(function (data) {
        getcardmeg1(data)
    })
        .fail(function () {
            var Faildata = {
                "TotalSteamConsumption": 1579.2,
                "currentvalue": 25.3,
                "refvalue":56
            }
            getcardmeg1(Faildata)
        })
}
function getcardmeg1(data) {
    document.getElementById("count-meg1").innerHTML = data.TotalSteamConsumption;
    
}


function getDoughnutmeg() {
    var myJSON = { uom: $("input[name=ratio-name]:checked").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.109:8090/MEG/MEGDoughnutECBU",
    }).done(function (data) {
        var energyConsumed = data[0].energyConsumed;
        console.log(energyConsumed);

        loadDoughnutChartmeg(energyConsumed);

    })
    // .fail(function () {
    //     var failData ={
    //         energyConsumed:{
    //         "fuel":24,"steam":56,"electricity":45,"total":568}
    //     }

    //     var energyConsumed = failData[0].energyConsumed;
    //     loadDoughnutChartmeg(energyConsumed);
        
    // })
    
}
function loadDoughnutChartmeg(energyConsumed) {
    // console.log(energyConsumed)
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#00aa7e",
        "#005374"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("titles-meg", {

        colorSet: "greenShades",
        height: 120,
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
function parametertableMEG() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.109:8090/NCU/specificenergyConsumptiontable"
    }).done(function (data) {
        getparametertableMEG(data)
    })
    .fail(function () {
        var faildata = [{ "parameter": "GHG Emission (tCO2e) ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "Total Electricity  ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "Consumption ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "Net import Energy ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "RLNG import ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "LPG import ", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 },
        { "parameter": "OFFGas Export", "uom": "Ton/hr", "reference": 23, "actual": 0,"deviation":0 }]
        getparametertableMEG(faildata)
    })
}
function getparametertableMEG(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.parameter + '</td>';
        table_data += '<td>' + value.uom + '</td>';
        table_data += '<td>' + value.reference + '</td>';        
        table_data += '<td>' + value.actual + '</td>';
        table_data += '<td>' + value.deviation + '</td>';
        // if (value.deviation > 0) {
        //     table_data += '<td class="r1">' + "+" + value.deviation + '</td>';
        // }
        // else {
        //     table_data += '<td class="r1">' + value.deviation + '</td>';
        // }

        table_data += '</tr>';
    });
    $('#MEG_card_body').append(table_data);
    // $(".r1").each(function () {
    //     var text = $(this).text();
    //     if (/[+-]?\d+(\.\d+)?/.test(text)) {
    //         var num = parseFloat(text);
    //         if (num < 0) {
    //             $(this).addClass("negative");
    //         } else if (num > 0) {
    //             $(this).addClass("positive");
    //         }

    //     }
    // });
}