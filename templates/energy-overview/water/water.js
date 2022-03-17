$(document).ready(function () {
    waterspecificConsumption();
    condensatesystem();
    Watercard1();
    Watercard2();
    Watercard3();
    Watercard4();
    Watercard5();

    $("input[name=fromwater]").on('change', function (event) {
      document.getElementById('towater').min = $('#fromwater').val();
        getSpecificwaterConsumptionData();
    });

    $("input[name=towater]").on('change', function (event) {
        document.getElementById('fromwater').max = $('#towater').val();
        getSpecificwaterConsumptionData();
    });
    $("#waterCondensate").on('change', function () {
        var demoTur = ($(this).find(":selected").val());
        $('#Chartwatertur').html(demoTur);
        getSpecificwaterConsumptionData();

        console.log($(this).find(":selected").val());
        // console.log($(this).find(":selected").val());
    });

    var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    var timeArray = hoursString.split(':');
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromwater').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#towater').val(tod.toJSON().slice(0, 19));

    document.getElementById('towater').min = $('#fromwater').val();
    document.getElementById('fromwater').max = $('#towater').val();
});

function getSpecificwaterConsumptionData() {
    var myJSON = { 'fromdate': $('#fromwater').val(), 'todate': $('#towater').val(), 'kpi_name': $("#waterCondensate option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: " http://localhost:8090/EmsPNC/water/watergraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificwaterConsumptionData(data, Difference_In_Days);
    })
}

function formatSpecificwaterConsumptionData(data, Difference_In_Days) {
    var chartData = { actual: [], reference: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const waterData = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: waterData });
        chartData.reference.push({ y: element.reference, x: waterData });
    }
    console.log("waterhartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificwaterConsumptionChart(chartData, Difference_In_Days, interval);
}

function showSpecificwaterConsumptionChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("water-chartLine", {
        theme: "dark1",
        height: 300,
        backgroundColor: "#26293c",
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
            gridColor: "gray",
            gridThickness: 2,
            gridThickness: 0,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
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
        }, {
            type: "spline",
            lineThickness: 4,
            lineDashType: "dash",
            color: "#FFC100",
            name: "Reference",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.reference
        }]
    });
    chart.render();

}



function waterspecificConsumption() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/SpecificWaterConsumption",


    }).done(function (data) {

        waterspecificConsumptionRate(data);
        getDropdownvalue(data);

    });
}
function waterspecificConsumptionRate(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.kpi_name + '</td>';
        table_data += '<td>' + value.actual + '</td>';
        table_data += '<td>' + value.Refrance + '</td>';
        table_data += '</tr>';
    });
    $('#specificwater').append(table_data);
}
function condensatesystem() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/water/TotalCondensateGeneration",
        method: "GET"

    }).done(function (data) {

        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpi + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.Refrance + '</td>';
            table_data += '</tr>';
        });
        $('#consystem').append(table_data);

    });
}

function Watercard1() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/CondensateRecovery",

    }).done(function (data) {
        console.log(data)
        document.getElementById("resultnew").innerHTML = data.currentvalue;
        document.getElementById("refnew").innerHTML = data.refvalue;
        document.getElementById("countnew").innerHTML = data.tagvalue;
        document.getElementById("countnew").style.color = data.colorcode == "none" ? "white" : data.colorcode;
        if (data.currentvalue > 0) {
            document.getElementById("resultnew").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("resultnew").innerHTML = data.currentvalue;
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
function Watercard2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/RawWaterIntake",

    }).done(function (data) {
        console.log(data)

        document.getElementById("result0").innerHTML = data.currentvalue;
        document.getElementById("ref0").innerHTML = data.refvalue;
        document.getElementById("count0").innerHTML = data.tagvalue;
        document.getElementById("count0").style.color = data.colorcode == "none" ? "white" : data.colorcode;
        if (data.currentvalue > 0) {
            document.getElementById("result0").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result0").innerHTML = data.currentvalue;
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
function Watercard3() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/DMWaterConsumption",

    }).done(function (data) {
        console.log(data)
        document.getElementById("result2").innerHTML = data.currentvalue;
        document.getElementById("ref2").innerHTML = data.refvalue;
        document.getElementById("count2").innerHTML = data.tagvalue;
        document.getElementById("count2").style.color = data.colorcode == "none" ? "white" : data.colorcode;
        if (data.currentvalue > 0) {
            document.getElementById("result2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result2").innerHTML = data.currentvalue;
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
function Watercard4() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/ROWaterProduction",

    }).done(function (data) {
        console.log(data)

        document.getElementById("result3").innerHTML = data.currentvalue;
        document.getElementById("ref3").innerHTML = data.refvalue;
        document.getElementById("count3").innerHTML = data.tagvalue;
        document.getElementById("count3").style.color = data.colorcode == "none" ? "white" : data.colorcode;
        if (data.currentvalue > 0) {
            document.getElementById("result3").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result3").innerHTML = data.currentvalue;
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
function Watercard5() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/water/BFWConsumption",

    }).done(function (data) {
        console.log(data)
        document.getElementById("result4").innerHTML = data.currentvalue;
        document.getElementById("ref4").innerHTML = data.refvalue;
        document.getElementById("count4").innerHTML = data.tagvalue;
        document.getElementById("count4").style.color = data.colorcode == "none" ? "white" : data.colorcode;
        if (data.currentvalue > 0) {
            document.getElementById("result4").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result4").innerHTML = data.currentvalue;
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

function getDropdownvalue(data) {
    $.each(data, function (key, value) {
        $('#waterCondensate').append(`<option value="${value.kpi_name}">
                                           ${value.kpi_name}
                                      </option>`);
    });
    var demogen1 = $("#waterCondensate option:selected").val();
    $('#Chartwatertur').html(demogen1);
    getSpecificwaterConsumptionData();
}