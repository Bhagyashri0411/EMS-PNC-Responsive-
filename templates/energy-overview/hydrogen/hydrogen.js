$(document).ready(function () {
    hydrogencard1();
    hydrogencard2();
    hydrogencard3();
    hydrogencard4();
    genratortable();
    consumertable();
    exporttable();


    $("#op-hydrogen").on('change', function () {
        demo1 = ($(this).find(":selected").val());
        let domLebal1 = ($(this).find(":selected").attr('name'));
        $("#heading-hydrogen").html(domLebal1);
        getSpecificHydrogenConsumptionData();
        console.log($(this).find(":selected").val());
    });

    $("input[name=fromhydrogen]").on('change', function () {
        // console.log($('["#Hydrogen"]:selected').val());
        getSpecificHydrogenConsumptionData();
    });

    $("input[name=tohydrogen]").on('change', function () {
        // console.log($('["#Hydrogen"]:selected').val());
        getSpecificHydrogenConsumptionData();
    });

    // // setting from date, to date - 24hrs.
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromhydrogen').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#tohydrogen').val(tod.toJSON().slice(0, 19));

    getSpecificHydrogenConsumptionData();
});
function getSpecificHydrogenConsumptionData() {
    var myJSON = { 'fromdate': $('#fromhydrogen').val(), 'todate': $('#tohydrogen').val(), kpi_name: $("#op-hydrogen option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        data: postdata,

        url: "http://192.168.1.120:8090/HydrogenScreen/TotalHydrogenGenerationGraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificHydrogenConsumptionData(data, Difference_In_Days);
    })
        .fail(function () {
            var failData = []

            formatSpecificHydrogenConsumptionData(failData);
        })
}

function formatSpecificHydrogenConsumptionData(data, Difference_In_Days) {
    var chartData = { actual: [], reference: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const hydrogenDate = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: hydrogenDate });
        chartData.reference.push({ y: element.reference, x: hydrogenDate });
    }
    console.log("Hydrogenhartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificHydrogenConsumptionChart(chartData, Difference_In_Days, interval);
}

function showSpecificHydrogenConsumptionChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("hydrogen-line", {
        height: "248",
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip: {
            shared: true  //disable here. 
        },
        axisX: {
            gridColor: "gray",
            gridThickness: 2,
            gridDashType: "dot",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            title: Difference_In_Days == true ? "In hours" : " In Days",
            titleFontSize: 15,
            interval: interval,
            tickThickness: 0,
            lineThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",

        },
        axisY: {
            gridColor: "gray",
            gridThickness: 2,
            gridThickness: 0,
            gridDashType: "dot",
            stripLines: [{
                thickness: 4,
                color: "#FFC100",
                lineDashType: "dash",
            }]
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
            name: "Reference",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.reference
        }]
    });
    chart.render();


}



function genratortable() {
    $.ajax({
        url: "http://192.168.1.120:8090/HydrogenScreen/TableGenerators",
        method: "GET"

    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.Generators + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '</tr>';

        });
        // $('#hydrogen_table1').append(table_data);
        document.getElementById("hydrogen_table1").innerHTML = table_data
    })
}


function consumertable() {
    $.ajax({
        url: "http://192.168.1.120:8090/HydrogenScreen/TableConsumers",
        method: "GET"

    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '</tr>';

        });
        $('#hydrogen_table2').append(table_data);

    })
}


function exporttable() {
    $.ajax({
        url: "http://192.168.1.120:8090/HydrogenScreen/TableExportImport",
        method: "GET"

    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.kpivalue + '</td>';
            table_data += '</tr>';

        });
        $('#hydrogen_table3').append(table_data);
    })
}

function hydrogencard1() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/HydrogenScreen/Card1TotalHydrogenGeneration",

    }).done(function (data) {
        document.getElementById("count_hydro1").innerHTML = data.tagvalue;
        document.getElementById("ref_hydro1").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result_hydro1").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_hydro1").innerHTML = data.currentvalue;
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
function hydrogencard2() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/HydrogenScreen/Card2TotalHydrogenconsumption",

    }).done(function (data) {
        document.getElementById("count_hydro2").innerHTML = data.tagvalue;
        document.getElementById("ref_hydro2").innerHTML = data.refvalue;
        if (data.currentvalue > 0) {
            document.getElementById("result_hydro2").innerHTML = "+" + data.currentvalue;
        }
        else {
            document.getElementById("result_hydro2").innerHTML = data.currentvalue;
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
function hydrogencard3() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/HydrogenScreen/Card3HydrogentoOffgas",

    }).done(function (data) {
        document.getElementById("count_hydro3").innerHTML = data.tagvalue;

    })
}
function hydrogencard4() {
    $.ajax({
        method: "GET",
        url: "http://192.168.1.120:8090/HydrogenScreen/Card4imbalance",

    }).done(function (data) {
        document.getElementById("count_hydro4").innerHTML = data.tagvalue;
        // document.getElementById("ref_hydro4").innerHTML = data.refvalue;
        // if (data.currentvalue > 0) {
        //     document.getElementById("result_hydro4").innerHTML = "+" + data.currentvalue;
        // }
        // else {
        //     document.getElementById("result_hydro4").innerHTML = data.currentvalue;
        // }
        // $(".result").each(function () {
        //     var text = $(this).text();
        //     if (/[+-]?\d+(\.\d+)?/.test(text)) {
        //         var num = parseFloat(text);
        //         if (num < 0) {
        //             $(this).addClass("red");
        //         } else if (num > 0) {
        //             $(this).addClass("green");
        //         }

        //     }
        // });
    })
}