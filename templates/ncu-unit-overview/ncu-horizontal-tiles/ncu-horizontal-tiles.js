$(document).ready(function () {
    loadGaugeChart();
    specifictable();
    parametertable();
    guagevaluencuAct();
    postFuelDoughnutDataNCU1();

    $(".ncu-doughnut").click(function () {
        console.log($("input[name=ratio-name]:checked").val());
        var abc = $("input[name=ratio-name]:checked").val()
        postFuelDoughnutDataNCU1(abc);
    });
    getpiechartncu();
});


function getpiechartncu() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/ncu/donutgraph",
    }).done(function (data) {
        var fuelConsumed = data[0].steamConsumed;
        CanvasJS.addColorSet("greenShades", [
            "#ffa600",
            "#00aa7e",
            "#005374",
            "#d944b4"
        ]);
        var dataPoints = [];
        var chart = new CanvasJS.Chart("Fuel-ncu", {
    
            colorSet: "greenShades",
            // height: 145,
            // width: 190,
            theme: "dark1",
            backgroundColor: "#26293c",
    
            title: {
                text: fuelConsumed.total.toFixed(2),
                verticalAlign: "center",
                dockInsidePlotArea: true,
                fontWeight: 100,
                // fontColor: "#f2f2f2",
                fontColor :fuelConsumed.colorcode == "none"? "white":fuelConsumed.colorcode,
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
                    { y: fuelConsumed.shp, name: "SHP", indexLabel: ((fuelConsumed.shp / fuelConsumed.total) * 100).toFixed(2) + "%" },
                    { y: fuelConsumed.hp, name: "HP", indexLabel: ((fuelConsumed.hp / fuelConsumed.total) * 100).toFixed(2) + "%" },
                    { y: fuelConsumed.mp, name: "MP", indexLabel: ((fuelConsumed.mp / fuelConsumed.total) * 100).toFixed(2) + "%" },
                    { y: fuelConsumed.lp, name: "LP", indexLabel: ((fuelConsumed.lp / fuelConsumed.total) * 100).toFixed(2) + "%" },
    
                ]
            }]
        });
    
        chart.render();
    })
}

function postFuelDoughnutDataNCU1() {
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

        url: "http://localhost:8090/EmsPNC/ncu/NCUDoughnut",
    })
        .done(function (data) {
            var energyConsumed = data[0].energyConsumed;
            console.log(energyConsumed);

            loadDoughnutHoriChartNCU1(energyConsumed);

        })
}
function loadDoughnutHoriChartNCU1(energyConsumed) {

    console.log(energyConsumed)
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
        "#00aa7e",
        "#005374"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("titles-ncu", {

        colorSet: "greenShades",
        // height: 120,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: energyConsumed.total.toFixed(2),
            verticalAlign: "center",
            dockInsidePlotArea: true,
            fontWeight: 500,
            // fontColor: "#f2f1e7",
            fontColor :energyConsumed.colorcode == "none"? "white":energyConsumed.colorcode,
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

function loadGaugeChart() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/ncu/specificenergyConsumption",
    }).done(function (data) {
        console.log(data.specificenergy, "bbmefnmenfm");
        ZC.LICENSE = ["b55b025e438fa8a98e32482b5f768ff5"];
        var myConfig12 = {
            "type": "gauge",
            "height": "19%",
            "width": "40%",
            "x": "30%",
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
                id: 'zingChart',
                data: myConfig12
            });
        }, 100);
    });
}
function guagevaluencuAct() {
    $.ajax({
        method: "GET",
        url: 'http://localhost:8090/EmsPNC/ncu/specificenergyConsumption',

    }).done(function (data) {
        document.getElementById("devncu").innerHTML = data.deviation + "%";
        document.getElementById("actncu").innerHTML = data.actual;
        document.getElementById("optncu").innerHTML = data.reference;
    });

}

function specifictable() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/ncu/specificenergyConsumptiontable"
    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.type + '</td>';
            table_data += '<td>' + value.sec.toFixed(2) + '</td>';
            table_data += '<td>' + value.reference.toFixed(2) + '</td>';
            if (value.deviation > 0) {
                table_data += '<td class="r1">' + "+" + value.deviation + '</td>';
            }
            else {
                table_data += '<td class="r1">' + value.deviation + '</td>';
            }

            table_data += '</tr>';
        });
        $('#ncutable').append(table_data);
        $(".r1").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("negative");
                } else if (num > 0) {
                    $(this).addClass("positive");
                }

            }
        });
    })
}

function parametertable() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EmsPNC/ncu/parametertable"
    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.parameter + '</td>';           
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.reference + '</td>';
            if (value.deviation > 0) {
                table_data += '<td class="r1">' + "+" + value.deviation + '</td>';
            }
            else {
                table_data += '<td class="r1">' + value.deviation + '</td>';
            }
            table_data += '</tr>';
        });
        $('#NCU_card_body').append(table_data);
        $(".r1").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("negative");
                } else if (num > 0) {
                    $(this).addClass("positive");
                }

            }
        });
    })
}

