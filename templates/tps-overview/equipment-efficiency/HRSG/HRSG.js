$(document).ready(function () {
    HRSGTable();
    // 1st card code
    $("#hrsgr1").on('change', function () {
        var demohrsgr = $(this).find(":selected").val();
        $('#hrefvalue').html(demohrsgr);
        getSpecificHRSGBarData();
    });
    $("input[name=fromHRSGBar]").on('change', function () {
        document.getElementById('toHRSGBar').min = $('#fromHRSGBar').val();
        getSpecificHRSGBarData();
    });

    $("input[name=toHRSGBar]").on('change', function () {
        document.getElementById('fromHRSGBar').max = $('#toHRSGBar').val();
        getSpecificHRSGBarData();
    });

    //multiline date code
    $("input[name=fromHRSG]").on('change', function () {
        document.getElementById('toHRSG').min = $('#fromHRSG').val();
        getSpecificHRSGData();
    });

    $("input[name=toHRSG]").on('change', function () {
        document.getElementById('fromHRSG').max = $('#toHRSG').val();
        getSpecificHRSGData();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(00);

    $('#fromHRSGBar').val(d.toJSON().slice(0, 19));
    $('#fromHRSG').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toHRSGBar').val(tod.toJSON().slice(0, 19));
    $('#toHRSG').val(tod.toJSON().slice(0, 19));

    document.getElementById('toHRSGBar').min = $('#fromHRSGBar').val();
    document.getElementById('fromHRSGBar').max = $('#toHRSGBar').val();
    document.getElementById('toHRSG').min = $('#fromHRSG').val();
    document.getElementById('fromHRSG').max = $('#toHRSG').val();
    getSpecificHRSGBarData();
    getSpecificHRSGData();
});
function getSpecificHRSGBarData() {
    var myJSON = { 'fromdate': $('#fromHRSGBar').val(), 'todate': $('#toHRSGBar').val(), tagname: $('#hrsgr1 option:selected').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/HrsgEfficiency",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        var chartData = { Actual: [], Design: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            var count = data.length;
            const hrsgDate = new Date(element.date);
            chartData.Actual.push({ y: element.actual, x: hrsgDate });
            chartData.Design.push({ y: element.design, x: hrsgDate });
    
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
        showSpecificHRSGBarChart(chartData, Difference_In_Days, interval);
    })
}

function showSpecificHRSGBarChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartContainerHRSG", {
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

//line

function getSpecificHRSGData() {
    var hrsgData = { 'fromdate': $('#fromHRSG').val(), 'todate': $('#toHRSG').val() };
    const postdata = JSON.stringify(hrsgData);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/SteamGenerated",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        var chartData = { hrsg3: [], hrsg4: [], hrsg1: [], hrsg2: [], hrsg5: [] };
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            var count = data.length;
            const hrsg1Date = new Date(element.date);
            chartData.hrsg3.push({ y: element.hrsg3, x: hrsg1Date });
            chartData.hrsg4.push({ y: element.hrsg4, x: hrsg1Date });
            chartData.hrsg1.push({ y: element.hrsg1, x: hrsg1Date });
            chartData.hrsg2.push({ y: element.hrsg2, x: hrsg1Date });
            chartData.hrsg5.push({ y: element.hrsg5, x: hrsg1Date });
        }
        console.log("HRSGchartdata", chartData);
        var interval = 1;
        if (!Difference_In_Days) {
            if (count / 8 > 1) {
                interval = Math.round(count / 8);
            } else {
                interval = 1;
            }
    
        }
        showSpecificHRSGChart(chartData, Difference_In_Days, interval);
    })
}

function showSpecificHRSGChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("HRSG-line", {

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
            title: Difference_In_Days == true ? "In hours" : "In Days",
            interval: interval,
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
            name: "HRSG01",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg1
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#D945B4",
            name: "HRSG02",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg2
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#FFA700",
            name: "HRSG03",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg3
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#0896CC",
            name: "HRSG04",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.hrsg4
        }, {
            type: "line",
            lineThickness: 2,
            color: "#00bc55",
            name: "HRSG05",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.hrsg5
        }
        ]
    });
    chart.render();
}


//table
function HRSGTable() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/HrsgTable",
        method: "GET"
    }).done(function (data) {
        var table_data = '';
        console.log(data)
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.hrsgid + '</td>';
            table_data += '<td>' + value.Status + '</td>';
            table_data += '<td>' + value.GENERATION_COST.toFixed(2) + '</td>';
            table_data += '<td>' + value.auxfuelDuty.toFixed(2) + '</td>';
            table_data += '<td>' + value.flowRateActualMT.toFixed(2) + '</td>';
            table_data += '<td>' + value.flowRateActualSRFT.toFixed(2) + '</td>';
            table_data += '<td>' + value.fuelRatioDesign.toFixed(2) + '</td>';
            table_data += '<td>' + value.fuelRatioActual.toFixed(2) + '</td>';
            table_data += '<td>' + value.exhaustTemperatureDesign.toFixed(2) + '</td>';
            table_data += '<td>' + value.exhaustTemperatureActual.toFixed(2) + '</td>';
            table_data += '</tr>';

        });
        $('#bodyHRSG_table').append(table_data);
    })
}