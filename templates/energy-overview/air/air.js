$(document).ready(function () {
    Aircard1();
    Aircard2();
    Aircard3();
    Aircard4();
    Aircard5();
    plantair();
    instrumentair();
    airDecoking();

    $("#op-air").on('change', function () {
        demo1 = ($(this).find(":selected").val());
        let domLebal1 = ($(this).find(":selected").attr('name'));
        $("#heading-air").html(domLebal1);
        getSpecificAirConsumptionData();
        console.log($(this).find(":selected").val());
    });

    $("input[name=fromair]").on('change', function () {
        document.getElementById('toair').min = $('#fromair').val();
        getSpecificAirConsumptionData();
    });

    $("input[name=toair]").on('change', function () {
        document.getElementById('fromair').max = $('#toair').val();
        getSpecificAirConsumptionData();
    });

    // // setting from date, to date - 24hrs.
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromair').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toair').val(tod.toJSON().slice(0, 19));

    getSpecificAirConsumptionData();
    $("#Airtable").on('change', function () {
        plantair($(this).find(":selected").val());
        console.log($(this).find(":selected").val());
    });
    plantair('Consumers');

    $("#Airtable1").on('change', function () {
        instrumentair($(this).find(":selected").val());
        console.log($(this).find(":selected").val());
    });
    instrumentair('Consumers')
    document.getElementById('toair').min = $('#fromair').val();
    document.getElementById('fromair').max = $('#toair').val();
});

function getSpecificAirConsumptionData() {
    var myJSON = { 'fromdate': $('#fromair').val(), 'todate': $('#toair').val(), kpi_name: $("#op-air option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: " http://localhost:8090/EmsPNC/Air/PlantAirGeneration",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificAirConsumptionData(data, Difference_In_Days);
    })
        .fail(function () {
            var failData = []
            formatSpecificAirConsumptionData(failData);
        })
}

function formatSpecificAirConsumptionData(data, Difference_In_Days) {
    var chartData = { actual: [], reference: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const airDate = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: airDate });
        chartData.reference.push({ y: element.reference, x: airDate });
    }
    console.log("Airhartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificAirConsumptionChart(chartData, Difference_In_Days, interval);
}

function showSpecificAirConsumptionChart(data, Difference_In_Days, interval) {

    var chart = new CanvasJS.Chart("air-line", {
        // width: 1000,
        height: "250",
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },

        axisX: {
            labelFontColor: "#d9d9d9",
            lineColor: "gray",
            tickThickness: 0,
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : "In Days",
            interval: interval,
            labelAngle: -20

        },
        axisY: {
            title: "",
            gridColor: "gray",
            // gridThickness: 2,
            gridThickness: 0,
            gridDashType: "dot",
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            // stripLines: [{
            //     value: data.reference,
            //     thickness: 4,
            //     color: "#FFC100",
            //     lineDashType: "dash",
            // }]
        },

        dataPointMaxWidth: 15,

        toolTip: {
            shared: true
        },
        data: [{
            type: "spline",
            lineThickness: 4,
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.actual
        },
        {
            type: "spline",
            lineThickness: 4,
            color: "#ffc000",
            lineDashType: "dash",
            name: "Reference",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.reference
        }]
    });
    chart.render();


}

function plantair(kpiname) {
    var myJSON = { kpiname: kpiname };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata, "mess");
    $.ajax({
        headers: {
            "Content-Type": "application/json",
        },
        data: postdata,
        url: "http://localhost:8090/EmsPNC/Air/plantairtable",
        method: "POST"

    }).done(function (data) {

        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '</tr>';
        });
        document.getElementById("plantair").innerHTML = table_data
    });
}

function instrumentair(kpiname) {
    var myJSON = { kpiname: kpiname };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata, "mess");
    $.ajax({
        headers: {
            "Content-Type": "application/json",
        },
        data: postdata,

        url: "http://localhost:8090/EmsPNC/Air/airconsumerTable",
        // url: "http://localhost:8090/EmsPNC/Air/airconsumerTable",
        method: "POST"

    }).done(function (data) {

        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '</tr>';
        });
        document.getElementById("instrumentair").innerHTML = table_data
    });
}

function airDecoking() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/Air/DecokingAirTable",
        method: "GET"

    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.Unit + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '</tr>';
        });
        document.getElementById("decokingair").innerHTML = table_data
    })
}

function Aircard1() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
        },
        url: "http://localhost:8090/EmsPNC/Air/PlantAirTotalGeneration",
        method: "GET"
    }).done(function (data) {
        console.log(data)
        if (data.currentvalue > 0) {
            document.getElementById("result_air1").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_air1").innerHTML = data.currentvalue;
        }


        document.getElementById("ref_air1").innerHTML = data.refvalue;
        document.getElementById("count_air1").innerHTML = data.tagvalue;
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
function Aircard2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/Air/PlantAirTotalConsumption",
        method: "GET",
    }).done(function (data) {
        console.log(data)
        if (data.currentvalue > 0) {
            document.getElementById("result_air2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_air2").innerHTML = data.currentvalue;
        }
        document.getElementById("ref_air2").innerHTML = data.refvalue;
        document.getElementById("count_air2").innerHTML = data.tagvalue;
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
function Aircard3() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/Air/InstrumentAirTotalGeneration",
        method: "GET",
    }).done(function (data) {
        console.log(data)
        if (data.currentvalue > 0) {
            document.getElementById("result_air3").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_air3").innerHTML = data.currentvalue;
        }
        document.getElementById("ref_air3").innerHTML = data.refvalue;
        document.getElementById("count_air3").innerHTML = data.tagvalue;
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

function Aircard4() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/Air/InstrumentAirTotalConsumption",
        method: "GET"
    }).done(function (data) {
        console.log(data)
        if (data.currentvalue > 0) {
            document.getElementById("result_air4").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_air4").innerHTML = data.currentvalue;
        }
        document.getElementById("ref_air4").innerHTML = data.refvalue;
        document.getElementById("count_air4").innerHTML = data.tagvalue;
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
function Aircard5() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/Air/AirGenerationCost",
        method: "GET"
    }).done(function (data) {
        console.log(data)
        if (data.currentvalue > 0) {
            document.getElementById("result_air5").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_air5").innerHTML = "null";
        }
        document.getElementById("ref_air5").innerHTML = "null";
        document.getElementById("count_air5").innerHTML = data.aircostgeneration;
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