$(document).ready(function () {
    getEquOverNCUData();
    $("input[name=fromeqncu]").on('change',function () {
        document.getElementById("toeqncu").min = $('#fromeqncu').val();
        getSpecificEquipmentOverviewDataNCU();
    });

    $("input[name=toeqncu]").on('change',function () {
        document.getElementById("fromeqncu").max = $('#toeqncu').val();
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

    document.getElementById("toeqncu").min = $('#fromeqncu').val();
    document.getElementById("fromeqncu").max = $('#toeqncu').val();
 
    posttableequipment();

});

//bar
function getEquOverNCUData() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/ncuequip/ncuchart",

    }).done(function (data) {
        var chartData = { actual: [], design: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            chartData.actual.push({ y: element.actual, label: element.id });
            chartData.design.push({ y: element.design, label: element.id });
        }
        loadcolumnequ(chartData);
    })
}

function loadcolumnequ(data) {
    var chart = new CanvasJS.Chart("Equ-columnncu", {
        backgroundColor: "#26293c",
        toolTip: {
            shared: true
        },
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
            // indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.actual
        },
        {
            type: "column",
            name: "Naphtha",
            color: "#d3a10c",
            // indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.design
        },


        ]
    });

    chart.render();
}

var globledatavariable1;
var globledatavariable2;
var globledatavariable3;
var globledatavariable4;
var globledatavariable5;
var globledatavariable6;
var globledatavariable7;

function posttableequipment(){
    var selectedData = document.getElementById('kpiTablencu');
    selectedOption = { 'name': selectedData.options[selectedData.selectedIndex].value };
    console.log(selectedOption);

   var selectedData1 = document.getElementById('kpiTablencu').value;
    console.log(selectedData1, "selectData1");
    f1(selectedData1)
    $.ajax({
        url: "http://localhost:8090/ncuequip/ncutable",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: JSON.stringify(selectedOption),        
        
    }).done(function (data) {
        globledatavariable1 = data[0].equipment1;
        globledatavariable2= data[0].equipment2;
        globledatavariable3 = data[0].equipment3;
        globledatavariable4 = data[0].equipment4;
        globledatavariable5 = data[0].equipment5;
        globledatavariable6 = data[0].equipment6;
        globledatavariable7 = data[0].equipment7;
        gblArry.push(globledatavariable1);
        gblArry.push(globledatavariable2);
        gblArry.push(globledatavariable3);
        gblArry.push(globledatavariable4);
        gblArry.push(globledatavariable5);
        gblArry.push(globledatavariable6);
        gblArry.push(globledatavariable7);
        
        tableNcuPostMapping(data);
        getSpecificEquipmentOverviewDataNCU();
    })
}
function tableNcuPostMapping(data) {
    var tabledata = data;
    var assignTable1;

    if (tabledata[0].equipment1 == 'FUEL_CONSUMED_(MT/HR)') {
        assignTable1 = '<tr><th>KPI</th><th>UOM</th><th>H100</th><th>H200</th><th>H300</th><th>H400</th><th>H500</th><th>H600</th><th>H700</th></tr>';
    }
    
   if (tabledata[0].equipment1 == 'CGC STEAM INLET') {
        assignTable1 = '<tr><th>KPI</th><th>UOM</th><th>CGC</th><th>PRC</th><th>ERC</th></tr>';

    }
    document.getElementById("headncuOverview").innerHTML = assignTable1;

    var assignTable = '';

    assignTable += '<tr>';
    //var index = 1;
    for (let i = 0; i < tabledata.length; i++) {
        var val = tabledata[i];
        if (tabledata[0].equipment1 == 'FUEL_CONSUMED_(MT/HR)') {
            assignTable += '<td>' + val['kpi'] + '</td>';
            assignTable += '<td>' + val['uom'] + '</td>';
            assignTable += '<td>' + val['value1'] + '</td>';
            assignTable += '<td>' + val['value2'] + '</td>';
            assignTable += '<td>' + val['value3'] + '</td>';
            assignTable += '<td>' + val['value4'] + '</td>';
            assignTable += '<td>' + val['value5'] + '</td>';            
            assignTable += '<td>' + val['value6'] + '</td>';
            assignTable += '<td>' + val['value7'] + '</td>';
        }
        if (tabledata[0].equipment1 == 'CGC STEAM INLET') {
            assignTable += '<td>' + val['kpi'] + '</td>';
            assignTable += '<td>' + val['uom'] + '</td>';
            assignTable += '<td>' + val['value1'] + '</td>';
            assignTable += '<td>' + val['value2'] + '</td>';
            assignTable += '<td>' + val['value3'] + '</td>';
        }
        assignTable += '</tr>';

    }
    document.getElementById("bodyncuOverview").innerHTML = assignTable;
}

console.log(gblArry);

var gblArry = []

function getSpecificEquipmentOverviewDataNCU() {
    var myJSON = { 'fromdate': $('#fromeqncu').val(), 'todate': $('#toeqncu').val(), 'name': $('#kpiTablencu option:selected').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        url: "http://localhost:8090/ncuequip/ncugraph",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,      
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificEquipmentOverviewNCU(data, Difference_In_Days);
    })
}

function formatSpecificEquipmentOverviewNCU(data, Difference_In_Days) {
    var chartData = { value1: [], value2: [], value3: [], value4: [], value5: [], value6: [], value7: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const date = new Date(element.date);
        chartData.value1.push({ y: element.value1, x: date });
        chartData.value2.push({ y: element.value2, x: date });
        chartData.value3.push({ y: element.value3, x: date });
        chartData.value4.push({ y: element.value4, x: date });
        chartData.value5.push({ y: element.value5, x: date });
        chartData.value6.push({ y: element.value6, x: date });
        chartData.value7.push({ y: element.value7, x: date });
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
           // itemclick: toogleDataSeries
        },
        data: [{
            type: "line",
            lineThickness: 2,
            color: "#C55B11",
            name: globledatavariable1,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value1
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#D945B4",
            name: globledatavariable2,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value2
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#FFA700",
            name: globledatavariable3,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value3
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#0896CC",
            name: globledatavariable4,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value4
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#7030a0",
            name: globledatavariable5,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value5
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#08cc12",
            name: globledatavariable6,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value6
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#08cc12",
            name: globledatavariable7,
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value7
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

        $(".line").css("display", "none");
        $(".col-rt").css("display", "none");

        $(".line-1").css("display", "inline-block");
        $(".col-rt-1").css("display", "inline-block");

    }

    if ("Furnace" == $('#kpiTablencu option:selected').val()) {

        $(".line").css("display", "inline-block");
        $(".col-rt").css("display", "inline-block");

        $(".line-1").css("display", "none");
        $(".col-rt-1").css("display", "none");
    }
}