$(document).ready(function() {
    generationandconsumer()
    $("#ppdrop").on('change', function() {
        var demopta=$(this).find(":selected").attr('name');
        $('#ppCharts').html(demopta);
        getSteamBalanceOverviewPP();
        // console.log($(this).find(":selected").val());
    });
    $("input[name=fromHomepp]").on('change', function(event) {
        // console.log($('["#sbo1"]:selected').val());
        getSteamBalanceOverviewPP();
    });
    $("input[name=toHomepp]").on('change', function(event) {
        // console.log($('["#sbo1"]:selected').val());
        getSteamBalanceOverviewPP();
    });

    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromHomepp').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toHomepp').val(tod.toJSON().slice(0, 19));
  
    getSteamBalanceOverviewPP();
});

function getSteamBalanceOverviewPP() {
    var myJSON = { 'fromdate': $('#fromHomepp').val(), 'todate': $('#toHomepp').val(),'tagname':$("#ppdrop option:selected").val()};
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
            method: "POST",
            data: postdata,
            headers: { 'Content-Type': 'application/json' },
            url: "http://192.168.1.106:8090/EmsPNC/OHCU/steamgenerationgraph",
        }).done(function(data) {
            var Difference_In_Days = data[0].showNumberIndex;  
            formatSteamPPData(data ,Difference_In_Days);
        })
}


function formatSteamPPData(data ,Difference_In_Days) {
    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const PPSBDate = new Date(element.date );
        chartData.actual.push({ y: element.actual,x:PPSBDate });
    }
    console.log("PPData", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showSteambalancePP(chartData ,Difference_In_Days, interval);
}

function showSteambalancePP(data ,Difference_In_Days, interval) {
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

function generationandconsumer() {
    $.ajax({
        url: "http://192.168.1.106:8090/EmsPNC/BSVI/Steambalance",
        method: "GET"
    }).done(function(data) {
        var table_data = '';
        $.each(data, function(key, value) {
            table_data += '<tr>';
            table_data += '<td>' + value.name + '</td>';
            table_data += '<td class="steam-gen2">' + value.value + '</td>';
            table_data += '</tr>';
        });
        $('#pp_table').append(table_data);
    });
}