$(document).ready(function () {
    SteamTable();

    $("#str1").on('change', function () {
        let domLebal1 = ($(this).find(":selected").val());
        $("#stgvalue").html(domLebal1);
        getSpecificSTBarData();
    });
    $("input[name=fromstBar]").on('change', function (event) {
        document.getElementById("tostBar").min = $("#fromstBar").val();
        getSpecificSTBarData();
    });

    $("input[name=tostBar]").on('change', function (event) {
        document.getElementById("fromstBar").max = $("#tostBar").val();
        getSpecificSTBarData();
    });

    // multiple line date
    $("input[name=stf]").on('change', function () {
        document.getElementById("stt").min = $("#stf").val();
        getSpecificSTData();
    });

    $("input[name=stt]").on('change', function () {
        document.getElementById("stf").max = $("#stt").val();
        getSpecificSTData();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromstBar').val(d.toJSON().slice(0, 19));
    $('#stf').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#tostBar').val(tod.toJSON().slice(0, 19));
    $('#stt').val(tod.toJSON().slice(0, 19));
    getSpecificSTData();
    getSpecificSTBarData();

    document.getElementById("tostBar").min = $("#fromstBar").val();
    document.getElementById("fromstBar").max = $("#tostBar").val();

    document.getElementById("stt").min = $("#stf").val();
    document.getElementById("stf").max = $("#stt").val();
});
function getSpecificSTBarData() {
    var myJSON = { 'fromdate': $('#fromstBar').val(), 'todate': $('#tostBar').val(), tagname: $('#str1 option:selected').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/st/steamturbineefficiency",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        var chartData = { Actual: [], Design: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            var count = data.length;
            const stDate = new Date(element.date);
            chartData.Actual.push({ y: element.actual, x: stDate });
            chartData.Design.push({ y: element.design, x: stDate });
    
        }
        console.log("STchartdata", chartData);
        var interval = 1;
        if (!Difference_In_Days) {
            if (count / 10 > 1) {
                interval = Math.round(count / 10);
            } else {
                interval = 1;
            }
        }
        showSpecificSTBarChart(chartData, Difference_In_Days, interval);
    })
}

function showSpecificSTBarChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartContainerST", {
        height: 230,
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
            title: Difference_In_Days == true ? "In hours" : " In Days",
            interval: interval,
            labelAngle: -50,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        toolTip: {
            shared: true
        },

        data: [{
            type: "line",
            lineThickness: 2,
            color: "#0895cc",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Actual
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#ffc000",
            name: "Design",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Design
        }
        ]
    });
    chart.render();
}

function getSpecificSTData() {
    var myJSON = { 'fromdate': $('#stf').val(), 'todate': $('#stt').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/st/capacityutilization",
    }).done(function (data) {
        var Difference_In_Days1 = data[0].showNumberIndex;
        var chartData = { STG3: [], STG1: [], STG2: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            var count = data.length;
            const st1Date = new Date(element.date);
            chartData.STG3.push({ y: element.stg3, x: st1Date });
    
            chartData.STG1.push({ y: element.stg1, x: st1Date });
            chartData.STG2.push({ y: element.stg2, x: st1Date });
    
        }
        console.log("STchartdata", chartData);
        var interval1 = 1;
        if (!Difference_In_Days1) {
            if (count / 8 > 1) {
                interval1 = Math.round(count / 8);
            } else {
                interval1 = 1;
            }
    
        }
        showSpecificSTChart(chartData, Difference_In_Days1, interval1);
    })
}

function showSpecificSTChart(data, Difference_In_Days1, interval1) {
    var chart = new CanvasJS.Chart("ST-line", {
        height: 230,
        theme: "dark1",
        backgroundColor: "#26293c",
        title: {
            text: ""
        },
        axisX: {
            gridThickness: 0,
            tickLength: 0,
            lineThickness: 0,
            intervalType: Difference_In_Days1 == true ? "hour" : "day",
            valueFormatString: Difference_In_Days1 == true ? "HH" : "DD MMM YYYY",
            title: Difference_In_Days1 == true ? "In hours" : " In Days",
            interval: interval1,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",

        },
        toolTip: {
            shared: true
        },

        data: [{
            type: "line",
            lineThickness: 2,
            color: "#C55B11",
            name: "STG01",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.STG1
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#D945B4",
            name: "STG02",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.STG2
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#FFA700",
            name: "STG03",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.STG3
        }
        ]
    });
    chart.render();
}

//table

function SteamTable() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/st/sttable",
        method: "GET"
    }).done(function (data) {
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.type + '</td>';
            table_data += '<td>' + value.Status + '</td>';
            table_data += '<td>' + value.steamimport.toFixed(2) + '</td>';
            table_data += '<td>' + value.hpsteamextracted.toFixed(2) + '</td>';
            table_data += '<td>' + value.mpsteamextracted.toFixed(2) + '</td>';
            table_data += '<td>' + value.steamcondensate.toFixed(2) + '</td>';
            table_data += '<td>' + value.steamduty.toFixed(2) + '</td>';
            table_data += '<td>' + value.powergenerationcost.toFixed(2) + '</td>';
            table_data += '<td>' + value.powergenerateddesign.toFixed(2) + '</td>';
            table_data += '<td>' + value.powergeneratedactual.toFixed(2) + '</td>';
            table_data += '<td>' + value.heatratedesign.toFixed(2) + '</td>';
            table_data += '<td>' + value.heatrateactual.toFixed(2) + '</td>';
            table_data += '</tr>';
        });
        $('#bodySteam_table').append(table_data);
    })
}