$(document).ready(function () {
    ppsteamta();
    $("#ppdrop").on('change', function () {
        var demopp = $(this).find(":selected").val();
        $('#ppcharts').html(demopp);
        ppsteamoverview();
    });
    $("input[name=fromHomepp]").on('change', function () {
        document.getElementById("toHomepp").min = $('#fromHomepp').val();
        ppsteamoverview();
    });
    $("input[name=toHomepp]").on('change', function (event) {
        document.getElementById("fromHomepp").max = $('#toHomepp').val();
        ppsteamoverview();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(-05);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#fromHomepp').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(59);
    tod.setSeconds(0);
    $('#toHomepp').val(tod.toJSON().slice(0, 19));
    document.getElementById("toHomepp").min = $('#fromHomepp').val();
    document.getElementById("fromHomepp").max = $('#toHomepp').val();

    ppsteamoverview();
});

function ppsteamoverview() {
    var myJSON = { 'fromdate': $('#fromHomepp').val(), 'todate': $('#toHomepp').val(), 'tagname': $("#ppdrop option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/ppsteam/steamgenerationgraph",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        ppgetsteamoverview(data, Difference_In_Days);
    })
}

function ppgetsteamoverview(data, Difference_In_Days) {
    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const ppSBDate = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: ppSBDate });
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
    showsteambalancepp(chartData, Difference_In_Days, interval);
}

function showsteambalancepp(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartSteamBalancepp", {
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

function ppsteamta() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/ppsteam/Steambalance",
        method: "GET"
    }).done(function (data) {
        getDroppp(data);
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.name + '</td>';
            table_data += '<td class="steam-gen2">' + value.value + '</td>';
            table_data += '</tr>';
        });
        $('#pp_table').append(table_data);   
    })

}
function getDroppp(data) {
    $.each(data, function (key, value) {
        $('#ppdrop').append(`<option value="${value.name}">
                                           ${value.name}
                                      </option>`);
    });
    var demogen1 = $("#ppdrop option:selected").val();
    $('#ppCharts').html(demogen1);
    ppsteamoverview();
}