$(document).ready(function () {
    megsteamta();
    $("#megdrop").on('change', function () {
        var demomeg = $(this).find(":selected").val()
        $('#megcharts').html(demomeg);
        megsteamoverview();
    });

    $("input[name=fromHomemeg]").on('change', function () {
        document.getElementById("toHomemeg").min = $('#fromHomemeg').val();
        megsteamoverview();
    });
    $("input[name=toHomemeg]").on('change', function () {
        document.getElementById("fromHomemeg").max = $('#toHomemeg').val();
        megsteamoverview();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(-05);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#fromHomemeg').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(59);
    tod.setSeconds(0);
    $('#toHomemeg').val(tod.toJSON().slice(0, 19));
    document.getElementById("toHomemeg").min = $('#fromHomemeg').val();
    document.getElementById("fromHomemeg").max = $('#toHomemeg').val();

    megsteamoverview();
});

function megsteamoverview() {
    var myJSON = { 'fromdate': $('#fromHomemeg').val(), 'todate': $('#toHomemeg').val(), 'tagname': $("#megdrop option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/MEGsteambalanceoverview/steambalanceoverviewgraph",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;
        meggetsteamoverview(data, Difference_In_Days);
    })
}
function meggetsteamoverview(data, Difference_In_Days) {
    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const MEGSBDate = new Date(element.date);
        chartData.actual.push({ y: element.actual, x: MEGSBDate });
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
    showsteambalancemeg(chartData, Difference_In_Days, interval);
}

function showsteambalancemeg(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartSteamBalancemeg", {
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

function megsteamta() {
    $.ajax({
        url: "http://localhost:8090/MEGsteambalanceoverview/MEGSteambalanceTable",
        method: "GET"
    }).done(function (data) {
        getDropmeg(data);
        var table_data = '';
        $.each(data, function (key, value) {
    
            table_data += '<tr>';
            table_data += '<td>' + value.GeneratorsConsumers + '</td>';
            table_data += '<td class="steam-gen2">' + value.TPH + '</td>';
            table_data += '</tr>';
        });
        $('#meg_table').append(table_data);
    })

}
function getDropmeg(data) {
    $.each(data, function (key, value) {
        $('#megdrop').append(`<option value="${value.GeneratorsConsumers}">
                                           ${value.GeneratorsConsumers}
                                      </option>`);
    });
    var demogen1 = $("#megdrop option:selected").val();
    $('#megcharts').html(demogen1);
    megsteamoverview();
}