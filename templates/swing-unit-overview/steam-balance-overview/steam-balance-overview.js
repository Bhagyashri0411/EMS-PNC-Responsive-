$(document).ready(function () {
    swingsteamta();
    $("#swingdrop").on('change', function () {
        var demoswing = $(this).find(":selected").attr('name');
        $('#swingcharts').html(demoswing);
        swingsteamoverview();
        // console.log($(this).find(":selected").val());
    });
    $("input[name=fromHomeswing]").on('change',function (event) {
        // console.log($('["#swingdrop"]:selected').val());
        swingsteamoverview();
    });
    $("input[name=toHomeswing]").on('change',function (event) {
        // console.log($('["#swingdrop"]:selected').val());
        swingsteamoverview();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromHomeswing').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toHomeswing').val(tod.toJSON().slice(0, 19));
    swingsteamoverview();
});

function swingsteamoverview() {
    var myJSON = { 'fromdate': $('#fromHomeswing').val(), 'todate': $('#toHomeswing').val(), 'tagname':$("#swingdrop option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://192.168.1.107:8090/SWINGsbo/steambalanceoverviewgraph",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;        
        swinggetsteamoverview(data ,Difference_In_Days);
    })

      
}


function swinggetsteamoverview(data ,Difference_In_Days) {

    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const swingSBDate = new Date(element.date );
        chartData.actual.push({ y: element.actual,x:swingSBDate });
    }
    console.log("FccuData", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showSteambalancefccu(chartData ,Difference_In_Days, interval);
}

function showSteambalancefccu(data ,Difference_In_Days, interval) {
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
            intervalType:Difference_In_Days == true?  "hour":"day",
            valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
         //valueFormatString: "DD MMM" ,
           title:Difference_In_Days == true?  "In hours":" In Days",
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
            name: "actual",
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
        url: "http://192.168.1.107:8090/SWINGsbo/SteambalanceTable",
        method: "GET"
    }).done(function (data) {
        getgenerationandconsumer(data);

    })
        .fail(function () {
            var failData = []
            //     {
            //         "name": "HP Steam Import",
            //         "value": "3200"
            //     },
            //     {
            //         "name": "LP Steam Generation",
            //         "value": "1800"
            //     },
            //     {
            //         "name": "LP Steam export",
            //         "value": "150"
            //     },
            //     {
            //         "name": "LP Steam Consumption",
            //         "value": "1800"
            //     },
            //     {
            //         "name": "LP Steam export",
            //         "value": "150"
            //     },
            //     {
            //         "name": "Imbalance",
            //         "value": "150"
            //     }
            // ]
            getgenerationandconsumer(failData);
        })
}
// })
function getgenerationandconsumer(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.GeneratorsConsumers + '</td>';
        table_data += '<td class="steam-gen2">' + value.TPH + '</td>';
        table_data += '</tr>';
    });
    $('#swing_table').append(table_data);
    // });
}

