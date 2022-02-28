$(document).ready(function () {
    getEquOverFCCUData();
    // tablehgu();

    $("input[name=fromeqncu]").click(function (event) {
        // console.log("from", event.target.value);
        getSpecificEquipmentOverviewDataNCU();
    });

    $("input[name=toeqncu]").change(function (event) {
        // console.log(event.target.value);
        getSpecificEquipmentOverviewDataNCU();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);

    $('#fromeqncu').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toeqncu').val(tod.toJSON().slice(0, 19));

    getSpecificEquipmentOverviewDataNCU();
    posttableequipment();

});



//bar
function getEquOverFCCUData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/EquipmentOverview/DHDSchart",

    }).done(function (data) {

        formatEquOverFCCUData(data);
    })
        .fail(function () {
            console.log('success');
            var failData = []


            formatEquOverFCCUData(failData);

        })
}

function formatEquOverFCCUData(data) {
    var chartData = { actual: [], design: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.actual.push({ y: element.actual, label: element.id });
        chartData.design.push({ y: element.design, label: element.id });
    }
    loadcolumnequ(chartData);
}

function loadcolumnequ(data) {
    var chart = new CanvasJS.Chart("Equ-columnncu", {
        // height: 120,

        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        dataPointMaxWidth: 40,
        dataPointWidth: 50,
        legend: {
            verticalAlign: "top", // "top" , "bottom"
            horizontalAlign: "left"
        },
        axisX: {
            gridThickness: 0,
            lineColor: "white",
            tickThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15
        },
        axisY: {
            gridThickness: 0,
            lineColor: "white",
            labelFontColor: "#bfbfbf",
            labelFontSize: 15

        },
        data: [{
            type: "column",
            name: "RLNG",
            color: "#0795cc",
            indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.actual
        },
        {
            type: "column",
            name: "Naphtha",
            color: "#d3a10c",
            indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.design
        },


        ]
    });

    chart.render();
}

// function tablehgu() {
//     $.ajax({
//         url: "http://192.168.1.107:8090/EquipmentOverview/ncutable",
//         method: "GET"

//     }).done(function (data) {
//         gettablehgu(data);
//     })
//         .fail(function () {
//             var newdata = [{ "uom": "%", "value1": 653.0, "value2": 653.0, "kpi": "Loading ", "equipment1": "FF-201" },
//             { "uom": "MT/hr", "value1": 345.0, "value2": 653.0, "kpi": "Fuel consumed" },
//             { "uom": "Gcal/hr", "value1": 642.0, "value2": 653.0, "kpi": "Duty Fired" },
//             { "uom": "%", "value1": 642.0, "value2": 653.0, "kpi": "Stack O2" },
//             { "uom": "°C", "value1": 642.0, "value2": 653.0, "kpi": "Stack Temp" }
//             ]
//             gettablehgu(newdata);
//         })
// }

var globledatavariable1;
function posttableequipment() {
    var selectdata = { 'name': $('#kpiTablencu option:selected').val() }
    f1();

    console.log(selectdata);

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: JSON.stringify(selectdata),

        url: "http://localhost:8080/EquipmentOverview/DHDStable",
    }).done(function (data) {
        console.log(data[0].equipment1, "jjjjjjjjjjj");
        globledatavariable1 = data[0].equipment1;
        gblArry.push(globledatavariable1);
        document.getElementById('efficiencyTrendline1').innerHTML = globledatavariable1;
        document.getElementById('equipment1').innerHTML = globledatavariable1;

        gettablehgu(globledatavariable1);
        // getSpecificEquipmentOverviewDataDHDS();
    })
   
}

function gettablehgu(data) {

    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.kpi + '</td>';
        table_data += '<td>' + value.uom + '</td>';
        table_data += '<td>' + value.value1 + '</td>';
        table_data += '<td>' + value.value2 + '</td>';
        table_data += '</tr>';
    });
    // document.getElementById("bodyHguOverview").innerHTML = table_data;
    $('#bodyncuOverview').append(table_data);
}


console.log(gblArry);

var gblArry = []

function getSpecificEquipmentOverviewDataNCU() {
    var myJSON = { 'fromdate': $('#fromeqncu').val(), 'todate': $('#toeqncu').val(), 'name': $('#kpiTablencu option:selected').val() };
    console.log(myJSON, "mes");

    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8080/EquipmentOverview/DHDSgraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificEquipmentOverviewNCU(data, Difference_In_Days);
    })
        .fail(function () {
            var failData =
                formatSpecificEquipmentOverviewNCU(failData);
        })
}

function formatSpecificEquipmentOverviewNCU(data, Difference_In_Days) {
    var chartData = { value1: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const ncuEODate = new Date(element.date);
        chartData.value1.push({ y: element.value1, x: ncuEODate });
    }
    console.log("equdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificEquipmentOverviewChartNCU(chartData, Difference_In_Days, interval);
}

function showSpecificEquipmentOverviewChartNCU(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("Equ-line-ncu", {
        height: 125,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            lineThickness: 2,
            color: "#C55B11",
            name: globledatavariable1,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value1
        }
        ]
    });
    chart.render();

    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}


//Equipment KPI Overview

function f1(y1) {
    console.log(y1, "y1");

    var Turbine;
    var Furnace;

    console.log(Turbine, "tr");

    if ("Turbine" == $('#kpiTablencu option:selected').val()) {

        $(".line").css("display","none");
        $(".col-rt").css("display","none");
      
        $(".line-1").css("display","inline-block");
        $(".col-rt-1").css("display","inline-block");
      
       
    }

    if ("Furnace" == $('#kpiTablencu option:selected').val()) {
       
        $(".line").css("display","inline-block");
        $(".col-rt").css("display","inline-block");
      
        $(".line-1").css("display","none");
        $(".col-rt-1").css("display","none");
    }
}
