$(document).ready(function () {
    ncusteamta();
    $("#ncudrop").on('change', function () {
        var demoncu = $(this).find(":selected").attr('name') ;
        $('#ncucharts').html(demoncu);
        ncusteamoverview();
        });
    $("input[name=fromHomencu]").on('change', function (event) {
        ncusteamoverview();
    });
    $("input[name=toHomencu]").on('change', function (event) {
        ncusteamoverview();
    });
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromHomencu').val(d.toJSON().slice(0,19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toHomencu').val(tod.toJSON().slice(0,19));
    document.getElementById("toHomencu").min = $('#fromHomencu').val();
    document.getElementById("fromHomencu").max = $('#toHomencu').val();
   
    ncusteamoverview();
});

function ncusteamoverview() {
    var myJSON = { 'fromdate': $('#fromHomencu').val(), 'todate': $('#toHomencu').val(),'tagname':$("#ncudrop option:selected").val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },        
        url: "http://localhost:8080/HCU/steamgenerationgraph",
        // url: "http://192.168.1.109:8090/NCU/steamgenerationgraph",
    }).done(function (data) {
        var Difference_In_Days = data[0].showNumberIndex;  
        ncugetsteamoverview(data ,Difference_In_Days);
    })

        .fail(function () {
            var failData = []
            // var failData = [
            //     { actual: 1000 },
            //     { actual: 980 },
            //     { actual: 970 },
            //     { actual: 960 },
            //     { actual: 900 },
            //     { actual: 910 },
            //     { actual: 900 },
            //     { actual: 875 },
            //     { actual: 927 },
            //     { actual: 949 },
            //     { actual: 946 },
            //     { actual: 927 },
            //     { actual: 950 },
            //     { actual: 998 },
            //     { actual: 998 },
            //     { actual: 1050 },
            //     { actual: 1050 },
            //     { actual: 999 },
            //     { actual: 998 },
            //     { actual: 998 },
            //     { actual: 1050 },
            // ]
            ncugetsteamoverview(failData);
        })
}


function ncugetsteamoverview(data ,Difference_In_Days) {

    var chartData = { actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const NCUSBDate = new Date(element.date );
        chartData.actual.push({ y: element.actual ,x:NCUSBDate});
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
    showsteambalancencu(chartData ,Difference_In_Days, interval);
}

function showsteambalancencu(data ,Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("chartSteamBalancencu", {
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

function ncusteamta() {
    $.ajax({
        url: "http://192.168.1.109:8090/NCU/steambalance",
        method: "GET"
    }).done(function (data) {
        getncusteamta(data);

    })
        .fail(function () {
            var failData = [{
                "name": "SHP steam Generation",
                "value": "3000"
            },
            {
                "name": "HP Steam Generation",
                "value": "3200"
            },
            {
                "name": "MP Steam Generation",
                "value": "1100"
            },
            {
                "name": "LP Steam Generation",
                "value": "1800"
            },
            {
                "name": "SHP Steam Consumption",
                "value": "750"
            },
            {
                "name": "HP Steam Consumption",
                "value": "150"
            },
            {
                "name": "MP Steam Consumption",
                "value": "150"
            },
            {
                "name": "LP Steam Consumption",
                "value": "150"
            },
            {
                "name": "Export Steam",
                "value": "150"
            },
            {
                "name": "Import Steam",
                "value": "150"
            },
            {
                "name": "Imbalance",
                "value": "150"
            }
            ]
            getncusteamta(failData);
        })
}
function getncusteamta(data) {
    var table_data = '';
    $.each(data, function (key, value) {
        table_data += '<tr>';
        table_data += '<td>' + value.name + '</td>';
        table_data += '<td class="steam-gen2">' + value.value + '</td>';
        table_data += '</tr>';
    });
    $('#ncu_table').append(table_data);
}
