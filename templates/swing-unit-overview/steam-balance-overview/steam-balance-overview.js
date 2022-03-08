$(document).ready(function () {
    swingsteamta();
    $("#swingdrop").on('change', function () {
        var demoswing = $(this).find(":selected").val();
        $('#swingcharts').html(demoswing);
        swingsteamoverview();
    });
    $("input[name=fromHomeswing]").on('change', function () {
        document.getElementById("toHomeswing").min = $('#fromHomeswing').val();
        swingsteamoverview();
    });
    $("input[name=toHomeswing]").on('change', function (event) {
        document.getElementById("fromHomeswing").max = $('#toHomeswing').val();
        swingsteamoverview();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(-05);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#fromHomeswing').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(59);
    tod.setSeconds(0);
    $('#toHomeswing').val(tod.toJSON().slice(0, 19));
    document.getElementById("toHomeswing").min = $('#fromHomeswing').val();
    document.getElementById("fromHomeswing").max = $('#toHomeswing').val();

    swingsteamoverview();
});

function swingsteamoverview() {
    var myJSON = { 'fromdate': $('#fromHomeswing').val(), 'todate': $('#toHomeswing').val(), 'tagname': $("#swingdrop option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/SWINGsbo/steambalanceoverviewgraph",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        swinggetsteamoverview(data, Difference_In_Days);
    })
}


function swinggetsteamoverview(data, Difference_In_Days) {
    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const swingSBDate = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: swingSBDate });
    }
    console.log("FccuData", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showsteambalanceswing(chartData, Difference_In_Days, interval);
}

function showsteambalanceswing(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartSteamBalanceswing", {
        height: 225,
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip: {
            shared: true  //disable here. 
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
            tickThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15
        },
        axisY: {
            title: "",
            gridColor: "gray",
            gridThickness: 1,
            tickThickness: 0,
            gridDashType: "dot",
            labelFontColor: "#d9d9d9",
            labelFontSize: 15
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
        },
        data: [{
            type: "line",
            lineThickness: 4,
            color: "#02a6e3",
            name: "Actual",
            markerSize: 0,
            //toolTipContent: "{name}: {y}",
            yValueFormatString: "0.00#",
            dataPoints: data.actual
        }]
    });
    chart.render();
}

function swingsteamta() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/SWINGsbo/SteambalanceTable",
        method: "GET"
    }).done(function (data) {
        getDropswing(data);
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.GeneratorsConsumers + '</td>';
            table_data += '<td class="steam-gen2">' + value.TPH + '</td>';
            table_data += '</tr>';
        });
        $('#swing_table').append(table_data);
    })

}
function getDropswing(data) {
    $.each(data, function (key, value) {
        $('#swingdrop').append(`<option value="${value.GeneratorsConsumers}">
                                           ${value.GeneratorsConsumers}
                                      </option>`);
    });
    var demogen1 = $("#swingdrop option:selected").val();
    $('#swingcharts').html(demogen1);
    swingsteamoverview();
}