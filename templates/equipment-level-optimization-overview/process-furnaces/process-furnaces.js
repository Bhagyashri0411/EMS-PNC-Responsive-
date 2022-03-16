$(document).ready(function () {
    steamprofurnacestable();

    $("input[name=fromprofurnaces]").click(function (event) {
        console.log(event.target.value);
        steamprofurnacesdata();
    });

    $("input[name=toprofurnaces]").change(function (event) {
        console.log(event.target.value);
        steamprofurnacesdata();
    });

    $("#profurnaces").on('change', function () {
        var demogen = $(this).find(":selected").val();
        $('#profurnacesid').html(demogen);
        steamprofurnacesdata();
        // console.log($(this).find(":selected").val());
    });

    var now = new Date();
    // var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    console.log(new Date(sessionStorage.getItem("lastUpdateddate")), 'new date');
    var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    var timeArray = hoursString.split(':');
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);

    $('#fromprofurnaces').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(59);
    tod.setSeconds(0);
    $('#toprofurnaces').val(tod.toJSON().slice(0, 19));


    $("#processtable").on('change', function () {
        kpiname = ($(this).find(":selected").val());
        steamprofurnacestable($(this).find(":selected").val());
    });
    steamprofurnacestable('BSVI')

    steamprofurnacesdata()
});

function steamprofurnacesdata() {
    var myJSON = { 'fromdate': $('#fromprofurnaces').val(), 'todate': $('#toprofurnaces').val(), 'tagname': $("#profurnaces option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/auth/Equipmentlevelopt/SteamprofurnacesGraph",
    }).done(function (data) {
        console.log(data)

        getsteamprofurnacesdata(data);
    })
}
function getsteamprofurnacesdata(data) {
    var chartData = { Actual: [], Optimized: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chartData.Optimized.push({ y: element.Optimized });
        chartData.Actual.push({ y: element.Actual });
    }
    console.log("Homechartdata", chartData);
    showsteamprofurnacesdata(chartData);
}

function showsteamprofurnacesdata(data) {
    var chart = new CanvasJS.Chart("profurnaces-line", {
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
            interval: 1,
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
            lineThickness: 4,
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "#,###",
            dataPoints: data.Actual
        },
        {
            type: "line",
            lineThickness: 4,
            color: "#00F76E",
            name: "Optimized",
            markerSize: 0,
            yValueFormatString: "#,###",
            dataPoints: data.Optimized
        }
        ]
    });
    chart.render();
}
function steamprofurnacestable(kpiname) {
    var myJSON = { tagname: kpiname };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: 'POST',
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: 'http://192.168.1.10:8090/auth/Equipmentlevelopt/Steamprofurnaces',
    }).done(function (data) {
        getsteamprofurnacestable(data);
    })
        .fail(function () {
            var failData = [
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 1 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 2 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 3 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 4 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 5 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 6 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                },
                {
                    "actual": 94.2,
                    "tagname": "Furnace # 7 OFF Gas Consumption",
                    "optimized": 0.0,
                    "deviation": 94.2
                }

            ]

            getsteamprofurnacestable(failData)
        })
}
function getsteamprofurnacestable(data) {
    var max1 = 500;
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.tagname + '</td>';
        table_data += '<td>' + value.actual + '</td>';
        table_data += '<td>' + value.optimized + '</td>';
        table_data += '<td>' + value.deviation + '</td>';
        table_data += '<td> <progress value =' + value.deviation + ' max=' + max1 + '></progress></td>';

        table_data += '</tr>';
    });
    document.getElementById("profurnacestable").innerHTML = table_data
}