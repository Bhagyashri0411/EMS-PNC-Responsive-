$(document).ready(function () {
    steamgeneratorstable();

    $("#fromstreamgene").on('change', function (event) {
        document.getElementById("tostreamgene").min = $('#fromstreamgene').val();
        getSpecificlinesteamGenData();
    });

    $("#tostreamgene").on('change', function (event) {
        document.getElementById("fromstreamgene").max = $('#tostreamgene').val();
        getSpecificlinesteamGenData();
    });

    $("#steamSelect").on('change', function () {
        var demogen = $(this).find(":selected").val();
        $('#generatorsid').html(demogen);
        getSpecificlinesteamGenData();
        console.log($(this).find(":selected").val());
    });

    var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    var timeArray = hoursString.split(':');
    console.log(hoursString ,"hgdhjghfgdfghdgfhg");
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromstreamgene').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#tostreamgene').val(tod.toJSON().slice(0, 19));
    document.getElementById("tostreamgene").min = $('#fromstreamgene').val();
    document.getElementById("fromstreamgene").max = $('#tostreamgene').val();
    getSpecificlinesteamGenData();

});

function getSpecificlinesteamGenData() {
    var myJSON = { 'fromdate': $('#fromstreamgene').val(), 'todate': $('#tostreamgene').val(), 'tagname': $("#steamSelect option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EmsPNC/EquipmentLevelOptimizedOverview/SteamGeneratorGraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificlinesteamGenData(data, Difference_In_Days);
    })
        .fail(function () {
            var failData = []
            formatSpecificlinesteamGenData(failData);
        })
}
function formatSpecificlinesteamGenData(data, Difference_In_Days) {
    var chartData = { Actual: [], Optimized: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const steamGeneData = new Date(element.date);
        chartData.Optimized.push({ y: element.design, x: steamGeneData });
        chartData.Actual.push({ y: element.actual, x: steamGeneData });
    }
    console.log("Homechartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificlinesteamGenData(chartData, Difference_In_Days, interval);
}

function showSpecificlinesteamGenData(data, Difference_In_Days, interval) {

    var chart = new CanvasJS.Chart("SQEqOver-line", {

        height: 450,
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
            titleFontColor: "#d9d9d9",
            titleFontSize: 12,
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
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Actual
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#00F76E",
            name: "Optimized",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Optimized
        }
        ]
    });
    chart.render();
}
function steamgeneratorstable() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: 'GET',
        url: 'http://localhost:8090/EmsPNC/EquipmentLevelOptimizedOverview/SteamGeneratorTable',
    }).done(function (data) {
        getSteamgenerator(data)
        var max1 = 500;
        var table_data = '';
        $.each(data, function (key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.kpiname + '</td>';
            table_data += '<td>' + value.actual + '</td>';
            table_data += '<td>' + value.optimized + '</td>';
            table_data += '<td>' + value.deviation.toFixed(2) + '</td>';
            // table_data += '<td> <progress value =' + value.deviation + ' max=' + max1 + '></progress></td>';

            table_data += '</tr>';
        });
        $('#generatorstable').append(table_data);
    })
}

function getSteamgenerator(data) {
    $.each(data, function (key, value) {
        $('#steamSelect').append(`<option value="${value.kpiname}">
                                           ${value.kpiname}
                                      </option>`);
    });
    var demogen1 = $("#steamSelect option:selected").val();
    $('#generatorsid').html(demogen1);
    getSpecificlinesteamGenData();
}
