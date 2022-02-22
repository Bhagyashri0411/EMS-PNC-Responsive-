$(document).ready(function() {
    var val
    
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
            url: "http://192.168.0.131:8090/api/npruunitOverview/SECOverview",
        }).done(function(data) {
            console.log(data)

            formatSpecificNCUOverviewData(data);
        })
        .fail(function() {
            var failData = [{
                "Reference": 950.0,
                "FeedRate": 998.0,
                "Actual": 975.0
            },
            {
                "Reference": 953.0,
                "FeedRate": 980.0,
                "Actual": 972.0
            },
            {
                "Reference": 966.0,
                "FeedRate": 980.0,
                "Actual": 979.0
            },
            {
                "Reference": 974.0,
                "FeedRate": 960.0,
                "Actual": 980.0
            },
            {
                "Reference": 910.0,
                "FeedRate": 980.0,
                "Actual": 980.0
            },
            {
                "Reference": 963.0,
                "FeedRate": 955.0,
                "Actual": 982.0
            },
            {
                "Reference": 938.0,
                "FeedRate": 980.0,
                "Actual": 984.0
            },
            {
                "Reference": 939.0,
                "FeedRate": 940.0,
                "Actual": 982.0
            },
            {
                "Reference": 983.0,
                "FeedRate": 960.0,
                "Actual": 982.0
            },
            {
                "Reference": 980.0,
                "FeedRate": 950.0,
                "Actual": 899.0
            },
            {
                "Reference": 900.0,
                "FeedRate": 980.0,
                "Actual": 888.0
            },
            {
                "Reference": 948.0,
                "FeedRate": 950.0,
                "Actual": 904.0
            }
            ]
            formatSpecificNCUOverviewData(failData);
        })
}

function formatSpecificNCUOverviewData(data) {
    var chartData = { FeedRate: [], Reference: [], Actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.FeedRate.push({ y: element.FeedRate});
        chartData.Reference.push({ y: element.Reference});
        chartData.Actual.push({ y: element.Actual});
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
        data: [{
                type: "column",
                color: "#00b0f0",
                name: " % Heat Recovery Compared to Design",
                axisYType: "secondary",
                toolTipContent: "{label} <br> <b>{name}:</b> {y} ",
                dataPoints: data.FeedRate

            },
            {
                type: "line",
                color: "orange",
                name: " Avg. Temp IN",
                markerSize: 0,
                toolTipContent: "<b>{name}:{y}",
                dataPoints: data.Actual
            },
            {
                type: "line",
                color: "#D945B4",
                name: "Avg. Temp OUT ",
                markerSize: 0,
                toolTipContent: "<b>{name}:{y}",
                dataPoints: data.Reference
            }

        ]
    });

    chart.render();
}

function convectiontable(){
    var myJSON = { 'tagname': $("#NCUA option:selected").val()}
    const postdata = JSON.stringify(myJSON);
    console.log(postdata,"NCUA");

    $.ajax({
        method: "POST",
        data: postdata,
        url: "http://192.168.0.131:8090/api/npruunitOverview/SECOverview",
    }).done(function(data) {
        console.log(data)

        formatconvectiontable(data);
        svg(data)
    })
    .fail(function(){
        var failData = [
            { "kpi":"% Avg. Temperature IN<br> to design","UFP":514,	"BFP":234 ,"LFP":24,"DSSH":258,"UMP":479,"USSH":753,"LSSH":532,"LMP":879},            
            { "kpi":"Avg. Temperature OUT<br> to design","UFP":514,	"BFP":234 ,"LFP":24,"DSSH":258,"UMP":479,"USSH":753,"LSSH":532,"LMP":879},            
            { "kpi":"% Heat Recovery compared<br> to design","UFP":514,	"BFP":234 ,"LFP":24,"DSSH":258,"UMP":479,"USSH":753,"LSSH":532,"LMP":879},
            ]
        formatconvectiontable(failData);
        svg(failData);
    })
}

function formatconvectiontable(data){

    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.kpi + '</td>';
        table_data += '<td>' + value.UFP + '</td>';
        table_data += '<td>' + value.BFP + '</td>';
        table_data += '<td>' + value.LFP + '</td>';        
        table_data += '<td>' + value.DSSH + '</td>';
        table_data += '<td>' + value.UMP + '</td>';
        table_data += '<td>' + value.USSH + '</td>';
        table_data += '<td>' + value.LSSH + '</td>';
        table_data += '<td>' + value.LMP + '</td>';
        table_data += '</tr>';
    });
    $('#Equipment_body_ncu').append(table_data);
}

function svg(data){
    console.log(data[2].UFP,"data[2].UFP");
    document.getElementById("EMS_NWD_UFP_01").innerHTML = data[2].UFP;
    document.getElementById("EMS_NWD_BFP_02").innerHTML = data[2].BFP;
    document.getElementById("EMS_NWD_LPF_03").innerHTML = data[2].LFP;
    document.getElementById("EMS_NWD_DSSH_04").innerHTML = data[2].DSSH;
    document.getElementById("EMS_NWD_UMP_05").innerHTML = data[2].UMP;
    document.getElementById("EMS_NWD_USSH_06").innerHTML = data[2].USSH;
    document.getElementById("EMS_NWD_LSSH_07").innerHTML = data[2].LSSH;
    document.getElementById("EMS_NWD_LMP_08").innerHTML = data[2].LMP;
}

