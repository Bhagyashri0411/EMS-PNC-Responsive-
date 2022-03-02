$(document).ready(function () {
    steamturbinetable();
    $("input[name=fromSteamTurbine]").on('change', function (event) {
        console.log(event.target.value);
        getSpecificlinesteamTurData();
    });

    $("input[name=toSteamTurbine]").on('change', function (event) {
        console.log(event.target.value);
        getSpecificlinesteamTurData();
    });

    $("#opt-steamTurbine").on('change', function () {
        var demoTur=($(this).find(":selected").val());
        $('#turbineid').html(demoTur);
        getSpecificlinesteamTurData();
        console.log($(this).find(":selected").val());
    });
    var now = new Date();
    // var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    console.log(new Date(sessionStorage.getItem("lastUpdateddate")),'new date');
    var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    var timeArray = hoursString.split(':');
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
               d.setHours(05);
               d.setMinutes(30);
               d.setSeconds(0);
            
    $('#fromsteamurbine').val(d.toJSON().slice(0,19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
               tod.setHours(29);
               tod.setMinutes(29);
               tod.setSeconds(0);
    $('#tosteamturbine').val(tod.toJSON().slice(0,19));
    getSpecificlinesteamTurData();


});

function getSpecificlinesteamTurData(tagname) {
    var myJSON = { 'fromdate': $('#fromsteamurbine').val(), 'todate': $('#tosteamturbine').val(), 'tagname': $("#opt-steamTurbine option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
         
        url: "http://192.168.1.123:8080/auth/Equipmentlevelopt/SteamTurbineExtractionGraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificlinesteamGenData(data ,Difference_In_Days);
    })
        .fail(function () {
            var failData =[]
            formatSpecificlinesteamGenData(failData);
        })
}
function formatSpecificlinesteamGenData(data ,Difference_In_Days) {
    var chartData = { Actual: [], Optimized: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const steamData = new Date(element.date );
        chartData.Optimized.push({ y: element.design ,x:steamData});
        chartData.Actual.push({ y: element.actual ,x:steamData});
    }
    console.log("Homechartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showSpecificlinesteamGenData(chartData ,Difference_In_Days, interval);
}

function showSpecificlinesteamGenData(data ,Difference_In_Days, interval) {

    var chart = new CanvasJS.Chart("SQsteamTurbine-line", {

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
            intervalType:Difference_In_Days == true?  "hour":"day",
            valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
         //valueFormatString: "DD MMM" ,
           title:Difference_In_Days == true?  "In hours":" In Days",
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
            lineThickness: 4,
            color: "#00B1F0",
            name: "Actual",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.Actual
        },
        {
            type: "line",
            lineThickness: 4,
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
function steamturbinetable() {
    $.ajax({
        method: 'GET',
        url: 'http://192.168.1.123:8080/auth/Equipmentlevelopt/SteamTurbineExtraction',
    }).done(function (data) {
        getsteamturbinetable(data);
    })
        .fail(function () {
            var failData = [
                {"actual":94.2,
                "tagname":"STG #1 HP Extraction",
                "optimized":0.0,
                "deviation": 94.2
            },
            {"actual":94.2,
                "tagname":"STG #2 HP Extraction",
                "optimized":0.0,
                "deviation": 94.2
            },
            {"actual":94.2,
                "tagname":"STG #3 HP Extraction",
                "optimized":0.0,
                "deviation": 94.2
            },
            {"actual":94.2,
                "tagname":"STG #1 MP Extraction",
                "optimized":0.0,
                "deviation": 94.2
            },
            {"actual":94.2,
            "tagname":"STG #2 MP Extraction",
            "optimized":0.0,
            "deviation": 94.2
            },
            {"actual":94.2,
            "tagname":"STG #3 MP Extraction",
            "optimized":0.0,
            "deviation": 94.2
            }
            
        ]

            getsteamturbinetable(failData)
        })
}
function getsteamturbinetable(data) {
    var max1= 500;
   var table_data = '';
   $.each(data, function (key, value) {
       table_data += '<tr>';
       table_data += '<td>' + value.tagname + '</td>';
       table_data += '<td>' + value.actual + '</td>';
       table_data += '<td>' + value.optimised + '</td>';
       table_data += '<td>' + value.derivation + '</td>';
    //    table_data += '<td> <progress value =' + value.derivation + ' max=' + max1 + '></progress></td>';

       table_data += '</tr>';
   });
   $('#turbinetable').append(table_data);
}