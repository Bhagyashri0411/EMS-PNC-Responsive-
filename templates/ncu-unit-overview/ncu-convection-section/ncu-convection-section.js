$(document).ready(function() {

    $("#NCUA").on('change', function (){
        // val = $(this).find(":selected").val()
        convectiontable();
    })
    $("#dropvalue").on('change', function (){
        // val = $(this).find(":selected").val()
        getSpecificNCUOverviewData();
    })
    $("input[name=nccuconvfromFccu]").on('change', function () {
        getSpecificNCUOverviewData();
    });
    $("input[name=nccuconvoveralldate]").on('change', function () {
        getSpecificNCUOverviewData();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#nccuconvfromFccu').val(d.toJSON().slice(0,19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#nccuconvoveralldate').val(tod.toJSON().slice(0,19));
    document.getElementById("nccuconvoveralldate").min = $('#nccuconvfromFccu').val();
    document.getElementById("nccuconvfromFccu").max = $('#nccuconvoveralldate').val();
   
    
    getSpecificNCUOverviewData();
    convectiontable();
    
});

function getSpecificNCUOverviewData() {
    var myJSON = { 'fromdate': $('#nccuconvfromFccu').val(), 'todate': $('#nccuconvoveralldate').val(),'tagname':$("#dropvalue option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
            method: "POST",
            data: postdata,
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
            },
            url: "http://192.168.1.109:8090/NCU/ConvectionGraph",
        }).done(function(data) {
            console.log(data)

            formatSpecificNCUOverviewData(data);
        })
}

function formatSpecificNCUOverviewData(data) {
    var chartData = { design: [], actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.design.push({ y: element.design});
        chartData.actual.push({ y: element.actual});
    }
    console.log("NCUchartdata", chartData);
    showSpecificNCUOverviewData(chartData);
}

function showSpecificNCUOverviewData(data) {
    var chart = new CanvasJS.Chart("NCU-chart-container", {
        // height: 180,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        axisX: {
            gridColor: "gray",
            gridThickness: 2,
            gridDashType: "dot",
            tickThickness: 0,
            lineThickness: 0,
            labelFontColor:"#bfbfbf", 
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        
        },
        dataPointMaxWidth: 15,
        axisY: {
            title: "°C",
            gridThickness: 0,
            labelFontColor:"#bfbfbf", 
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
            "minimum":0
        },
        axisY2: {
            title: "%",
            titleFontSize:15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor:"#D9DAD9",
            gridThickness: 0,
            labelFontColor:"#bfbfbf", 
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        data: [
            {
                type: "line",
                color: "orange",
                name: "Desing",
                markerSize: 0,
                toolTipContent: "<b>{name}:{y}",
                dataPoints: data.design
            },
            {
                type: "line",
                color: "#D945B4",
                name: "Actual",
                markerSize: 0,
                toolTipContent: "<b>{name}:{y}",
                dataPoints: data.actual
            }

        ]
    });

    chart.render();
}

function convectiontable(){
    var myJSON = { 'name': $("#NCUA option:selected").val()}
    const postdata = JSON.stringify(myJSON);
    console.log(postdata,"NCUA");

    $.ajax({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        data: postdata,
        url: "http://192.168.1.109:8090/NCU/ConvectionTable",
    }).done(function(data) {
        console.log(data)
       // [{"value6":577.23,"value5":574.23,"value8":583.23,"value7":580.23,"value2":565.23,"value1":562.23,"kpi":"Avg. Temperature IN","value4":571.23,"value3":568.23,"equipment2":"BFP","equipment3":"LFP","equipment4":"DSSH","equipment5":"UMP","equipment1":"UFP","equipment6":"USSH","equipment7":"LSSH","equipment8":"LMP"},{"value6":578.23,"value5":575.23,"value8":584.23,"value7":581.23,"value2":566.23,"value1":563.23,"kpi":"Avg. Temperature OUT","value4":572.23,"value3":569.23,"equipment2":"BFP","equipment3":"LFP","equipment4":"DSSH","equipment5":"UMP","equipment1":"UFP","equipment6":"USSH","equipment7":"LSSH","equipment8":"LMP"},{"value6":67.0,"value5":67.0,"value8":67.0,"value7":67.0,"value2":67.0,"value1":67.0,"kpi":"% Heat Recovery(Actual/Design)","value4":67.0,"value3":67.0,"equipment2":"BFP","equipment3":"LFP","equipment4":"DSSH","equipment5":"UMP","equipment1":"UFP","equipment6":"USSH","equipment7":"LSSH","equipment8":"LMP"}]
        formatconvectiontable(data);
        svg(data)
    })
}

function formatconvectiontable(data){

    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.kpi + '</td>';
        table_data += '<td>' + value.value1 + '</td>';
        table_data += '<td>' + value.value2 + '</td>';
        table_data += '<td>' + value.value3 + '</td>';        
        table_data += '<td>' + value.value4 + '</td>';
        table_data += '<td>' + value.value5 + '</td>';
        table_data += '<td>' + value.value6 + '</td>';
        table_data += '<td>' + value.value7 + '</td>';
        table_data += '<td>' + value.value8 + '</td>';
        table_data += '</tr>';
    });
    $('#Equipment_body_ncu').append(table_data);
}

function svg(data){
    document.getElementById("EMS_NWD_UFP_01").innerHTML = data[2].value1;
    document.getElementById("EMS_NWD_BFP_02").innerHTML = data[2].value2;
    document.getElementById("EMS_NWD_LPF_03").innerHTML = data[2].value3;
    document.getElementById("EMS_NWD_DSSH_04").innerHTML = data[2].value4;
    document.getElementById("EMS_NWD_UMP_05").innerHTML = data[2].value5;
    document.getElementById("EMS_NWD_USSH_06").innerHTML = data[2].value6;
    document.getElementById("EMS_NWD_LSSH_07").innerHTML = data[2].value7;
    document.getElementById("EMS_NWD_LMP_08").innerHTML = data[2].value8;
}

