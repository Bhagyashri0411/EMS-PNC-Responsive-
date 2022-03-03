$(document).ready(function () {
    getEquOverMEGData();
    
    $("input[name=fromeqmeg]").on('change',function () {
        // console.log("from", event.target.value);
        document.getElementById("toeqmeg").min = $('#fromeqmeg').val();
        getSpecificEquipmentOverviewDataMEG();
    });

    $("input[name=toeqmeg]").on('change',function () {
        // console.log(event.target.value);
        document.getElementById("fromeqmeg").max = $('#toeqmeg').val();
        getSpecificEquipmentOverviewDataMEG();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
 
$('#fromeqmeg').val(d.toJSON().slice(0,19));
const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
$('#toeqmeg').val(tod.toJSON().slice(0,19));
document.getElementById("toeqmeg").min = $('#fromeqmeg').val();
    document.getElementById("fromeqmeg").max = $('#toeqmeg').val();
equipmentOverviewKpiTableMeg();
});

//bar
function getEquOverMEGData() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://192.168.1.107:8090/EquipmentOverview/MEGchart",

    }).done(function (data) {

        formatEquOverMEGData(data);
    })
}

function formatEquOverMEGData(data) {
    var chartData = { actual: [], design: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.actual.push({ y: element.actual, label: element.id });
        chartData.design.push({ y: element.design, label: element.id });
    }
    loadcolumneqmeg(chartData);
}

function loadcolumneqmeg(data) {
    var chart = new CanvasJS.Chart("Equ-columnmeg", {
        height: 120,
        theme: "dark1",
        backgroundColor: "#26293c",
toolTip: {
            shared: true
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
            name: "Actual",
            color: "#0795cc",
            //indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.actual
        },
        {
            type: "column",
            name: "Design",
            color: "#d3a10c",
            //indexLabel: " {y}",
            indexLabelFontColor: "#bfbfbf",
            indexLabelFontSize: 15,
            dataPoints: data.design
        },


        ]
    });

    chart.render();
}

//Equipment KPI Overview

function f1() {

    if ("Turbine" == $('#kpiTablemeg option:selected').val()) {

        $(".line").css("display","none");
        $(".col-rt").css("display","none");
      
        $(".line-1").css("display","inline-block");
        $(".col-rt-1").css("display","inline-block");
      
       
    }

    if ("Furnace" == $('#kpiTablemeg option:selected').val()) {
       
        $(".line").css("display","inline-block");
        $(".col-rt").css("display","inline-block");
      
        $(".line-1").css("display","none");
        $(".col-rt-1").css("display","none");
    }
}


var globledatavariable1;
var globledatavariable2;
var globledatavariable3;
var globledatavariable4;
var selectedOption;
var selectedData1;


function equipmentOverviewKpiTableMeg() {
   
    var selectedOption = { 'name': $('#kpiTablemeg option:selected').val() }
     f1();

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: JSON.stringify(selectedOption),
         
        url: "192.168.1.125:8090/EquipmentOverview/MEGtable",
    }).done(function (data) {
        globledatavariable1 = data[0].equipment1;
        globledatavariable2 = data[0].equipment2;
        globledatavariable3 = data[0].equipment3;
        globledatavariable4 = data[0].equipment4;
        gblArry.push(globledatavariable1);
        gblArry.push(globledatavariable2);
        gblArry.push(globledatavariable3);
        gblArry.push(globledatavariable4);
        
        printequipmentOverviewKpiTableMeg(data);
        getSpecificEquipmentOverviewDataMEG();

    })
}

function printequipmentOverviewKpiTableMeg(data) {

    var tabledata = data;
    var assignTable1;

    if (tabledata[0].equipment1 == 'F_501') {
        assignTable1 = '<tr><th>KPI</th><th>UOM</th><th>F_501</th><th>F_502</th><th>F_503</th><th>FF-01</th></tr>';
    }
    
   if (tabledata[0].equipment1 == 'KC001') {
        assignTable1 = '<tr><th>KPI</th><th>UOM</th><th>KC001</th></tr>';

    }
    document.getElementById("headmegOverview").innerHTML = assignTable1;

    var assignTable = '';

    assignTable += '<tr>';
    //var index = 1;
    for (let i = 0; i < tabledata.length; i++) {
        var val = tabledata[i];
        if (tabledata[0].equipment1 == 'F_501') {
            assignTable += '<td>' + val['kpi'] + '</td>';
            assignTable += '<td>' + val['uom'] + '</td>';
            assignTable += '<td>' + val['value1'] + '</td>';
            assignTable += '<td>' + val['value2'] + '</td>';
            assignTable += '<td>' + val['value3'] + '</td>';
            assignTable += '<td>' + val['value4'] + '</td>';
        }
        if (tabledata[0].equipment1 == 'KC001') {
            assignTable += '<td>' + val['kpi'] + '</td>';
            assignTable += '<td>' + val['uom'] + '</td>';
            assignTable += '<td>' + val['value1'] + '</td>';
        }
        assignTable += '</tr>';

    }
    document.getElementById("bodymegOverview").innerHTML = assignTable;
}
console.log(gblArry);

var gblArry = []

function getSpecificEquipmentOverviewDataMEG() {
    var myJSON = { 'fromdate': $('#fromeqmeg').val(), 'todate': $('#toeqmeg').val(), 'name': $('#kpiTablemeg option:selected').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
         
        url: "http://192.168.1.125:8090/EquipmentOverview/MEGgraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificEquipmentOverviewData(data ,Difference_In_Days);
    })
}

function formatSpecificEquipmentOverviewData(data ,Difference_In_Days) {
    var chartData = { value2: [], value1: [], value3: [], value4: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const OHCUEODate = new Date(element.date);
        chartData.value2.push({ y: element.value2,x:OHCUEODate });
        chartData.value1.push({ y: element.value1 ,x:OHCUEODate});
        chartData.value3.push({ y: element.value3,x:OHCUEODate });
        chartData.value4.push({ y: element.value4 ,x:OHCUEODate});
    }
    console.log("equdata", chartData);
    var interval=1;
    if (!Difference_In_Days) {
        if (count/8 > 1) {
           interval =Math.round(count/8);
        }else{
          interval = 1;
        }
       
      }
    showSpecificEquipmentOverviewChartmeg(chartData,Difference_In_Days, interval);
}

function showSpecificEquipmentOverviewChartmeg(data,Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("Equ-line-meg", {   
        height: 114,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            intervalType:Difference_In_Days == true?  "hour":"day",
            valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
          title:Difference_In_Days == true?  "In hours":" In Days",
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
        },
        {
            type: "line",
            lineThickness: 2,
            name: globledatavariable2,
            color: "#D945B4",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value2
        },
        {
            type: "line",
            lineThickness: 2,
            name: globledatavariable3,
            color: "#FFA700",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value3
        },
        {
            type: "line",
            lineThickness: 2,
            name: globledatavariable4,
            color: "#0896CC",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.value4
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