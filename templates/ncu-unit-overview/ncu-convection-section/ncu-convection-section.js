$(document).ready(function () {

    $("#NCUA").on('change', function () {
        // val = $(this).find(":selected").val()
        getSpecificNCUOverviewData();
        convectiontable();
    })
    $("#dropvalue").on('change', function () {
        // val = $(this).find(":selected").val()
        getSpecificNCUOverviewData();
    })
    $("input[name=nccuconvfromFccu]").on('change', function () {
        document.getElementById("nccuconvoveralldate").min = $('#nccuconvfromFccu').val(); 
        getSpecificNCUOverviewData();
    });
    $("input[name=nccuconvoveralldate]").on('change', function () {
        document.getElementById("nccuconvfromFccu").max = $('#nccuconvoveralldate').val();
        getSpecificNCUOverviewData();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#nccuconvfromFccu').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#nccuconvoveralldate').val(tod.toJSON().slice(0, 19));
    document.getElementById("nccuconvoveralldate").min = $('#nccuconvfromFccu').val();
    document.getElementById("nccuconvfromFccu").max = $('#nccuconvoveralldate').val();


    getSpecificNCUOverviewData();
    // convectiontable();

});

function getSpecificNCUOverviewData() {
    var myJSON = { 'fromdate': $('#nccuconvfromFccu').val(), 'todate': $('#nccuconvoveralldate').val(), 'tagname': $("#dropvalue option:selected").val(), 'unitName': $("#NCUA option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({

        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: "http://localhost:8090/EmsPNC/NCU/ConvectionGraph",
        method: "POST",
        data: postdata,
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;

        formatSpecificNCUOverviewData(data, Difference_In_Days);
        convectiontable(data)
    })
}

function formatSpecificNCUOverviewData(data, Difference_In_Days) {
    var chartData = { tin: [], tout: [], recovery: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const NCUconDate = new Date(element.date);
        chartData.tin.push({ y: element.tin, x: NCUconDate });
        chartData.tout.push({ y: element.tout, x: NCUconDate });
        chartData.recovery.push({ y: element.recovery, x: NCUconDate });
    }
    console.log("NCUchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificNCUOverviewData(chartData, Difference_In_Days, interval);
}

function showSpecificNCUOverviewData(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("NCU-chart-container", {
        // height: 180,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            tickLength: 0,
            gridThickness: 0,
            labelFontColor: "#d9d9d9",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelFontSize: 10,
            gridDashType: "dot",
            lineThickness: 0,

        },
        dataPointMaxWidth: 15,
        axisY: {
            title: "°C",
            gridColor: "gray",
            gridDashType: "dot",
            gridThickness: 1,
            labelFontColor: "#d9d9d9",
            labelFontSize: 12

        },
        axisY2: {
            title: "%",
            gridThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 12
        },
        data: [
            {
                type: "column",
                color: "#0796CC",
                name: "%HeatRecovery",
                axisYType: "secondary",
                dataPoints: data.recovery
            },
            {
                type: "line",
                color: "#D945B4",
                name: "TOUT",
                markerSize: 0,
                lineThickness: 2,
                dataPoints: data.tout
            },
            {
                type: "line",
                color: "#C55B11",
                name: "TIN",
                markerSize: 0,
                lineThickness: 2,
                dataPoints: data.tin
            }

        ]
    });

    chart.render();
}

function convectiontable(data) {
    var myJSON = { 'unitName': $("#NCUA option:selected").val() }
    const postdata = JSON.stringify(myJSON);
    console.log(postdata, "NCUA");

    $.ajax({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        data: postdata,
        url: "http://localhost:8090/EmsPNC/NCU/ConvectionTable",
    }).done(function (data) {
        console.log(data)
        formatconvectiontable(data);
        svg(data)
    })
}

function formatconvectiontable(data) {
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
    document.getElementById("Equipment_body_ncu").innerHTML = table_data
}

function svg(data) {
    document.getElementById("EMS_NWD_UFP_01").innerHTML = data[2].value1;
    document.getElementById("EMS_NWD_BFP_02").innerHTML = data[2].value2;
    document.getElementById("EMS_NWD_LPF_03").innerHTML = data[2].value3;
    document.getElementById("EMS_NWD_DSSH_04").innerHTML = data[2].value4;
    document.getElementById("EMS_NWD_UMP_05").innerHTML = data[2].value5;
    document.getElementById("EMS_NWD_USSH_06").innerHTML = data[2].value6;
    document.getElementById("EMS_NWD_LSSH_07").innerHTML = data[2].value7;
    document.getElementById("EMS_NWD_LMP_08").innerHTML = data[2].value8;
}

