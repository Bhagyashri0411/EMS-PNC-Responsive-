$(document).ready(function () {
    $("input[name=ppoveralldate]").on('change', function () {
        getSpecificppConsumptionData();
    });
    $("input[name=ppfromFccu]").on('change', function () {
        getSpecificppConsumptionData();
    });
     // // setting from date, to date - 24hrs.
     const d = new Date(sessionStorage.getItem("lastUpdateddate"));
     d.setHours(05);
     d.setMinutes(30);
     d.setSeconds(0);
     $('#ppfromFccu').val(d.toJSON().slice(0,19));
     const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
     tod.setHours(29);
     tod.setMinutes(29);
     tod.setSeconds(0);
     $('#ppoveralldate').val(tod.toJSON().slice(0,19));
     document.getElementById("ppoveralldate").min = $('#ppfromFccu').val();
     document.getElementById("ppfromFccu").max = $('#ppoveralldate').val();
    
     getSpecificppConsumptionData();
})
function getSpecificppConsumptionData(

) {
    var myJSON = { 'fromdate': $('#ppfromFccu').val(), "day":  $('#ppoveralldate').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        method: "POST",
        data: postdata,
        headers: { 'Content-Type': 'application/json' },
        url: "http://localhost:8090/EmsPNC/dhds/overallsecOverviewgraph",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificFccuConsumptionData(data,Difference_In_Days);
    })
        .fail(function () {
            var failData = []
            // var failData = [{
            //     "reference": 920.0,
            //     "feedrate": 979.0,
            //     "actual": 975.0,
            //     "date": '12/10/2021'
            // },
            // {
            //     "reference": 953.0,
            //     "feedrate": 963.0,
            //     "actual": 972.0,
            //     "date": '17/10/2021'
            // },
            // {
            //     "reference": 950.0,
            //     "feedrate": 972.0,
            //     "actual": 979.0,
            //     "date": '20/10/2021'
            // },
            // {
            //     "reference": 945.0,
            //     "feedrate": 976.0,
            //     "actual": 980.0,
            //     "date": '20/10/2021'
            // },
            // {
            //     "reference": 910.0,
            //     "feedrate": 981.0,
            //     "actual": 980.0,
            //     "date": '22/10/2021'
            // },
            // {
            //     "reference": 963.0,
            //     "feedrate": 979.0,
            //     "actual": 982.0,
            //     "date": '23/10/2021'
            // },
            // {
            //     "reference": 938.0,
            //     "feedrate": 980.0,
            //     "actual": 968.0,
            //     "date": '24/10/2021'
            // },
            // {
            //     "reference": 939.0,
            //     "feedrate": 974.0,
            //     "actual": 982.0,
            //     "date": '25/10/2021'
            // },
            // {
            //     "reference": 983.0,
            //     "feedrate": 981.0,
            //     "actual": 982.0,
            //     "date": '26/10/2021'
            // },
            // {
            //     "reference": 980.0,
            //     "feedrate": 965.0,
            //     "actual": 899.0,
            //     "date": '27/10/2021'
            // },
            // {
            //     "reference": 939.0,
            //     "feedrate": 980.0,
            //     "actual": 888.0,
            //     "date": '28/10/2021'
            // },
            // {
            //     "reference": 948.0,
            //     "feedrate": 950.0,
            //     "actual": 904.0,
            //     "date": '29/10/2021'
            // }, 
            // {
            //     "reference": 920.0,
            //     "feedrate": 979.0,
            //     "actual": 975.0,
            //     "date": '12/10/2021'
            // },
            // {
            //     "reference": 953.0,
            //     "feedrate": 963.0,
            //     "actual": 972.0,
            //     "date": '17/10/2021'
            // },
            // {
            //     "reference": 950.0,
            //     "feedrate": 972.0,
            //     "actual": 979.0,
            //     "date": '20/10/2021'
            // },
            // {
            //     "reference": 945.0,
            //     "feedrate": 976.0,
            //     "actual": 980.0,
            //     "date": '21/10/2021'
            // },
            // {
            //     "reference": 910.0,
            //     "feedrate": 981.0,
            //     "actual": 980.0,
            //     "date": '22/10/2021'
            // },
            // {
            //     "reference": 963.0,
            //     "feedrate": 979.0,
            //     "actual": 982.0,
            //     "date": '23/10/2021'
            // },
            // {
            //     "reference": 938.0,
            //     "feedrate": 980.0,
            //     "actual": 968.0,
            //     "date": '24/10/2021'
            // },
            // {
            //     "reference": 939.0,
            //     "feedrate": 974.0,
            //     "actual": 982.0,
            //     "date": '25/10/2021'
            // },
            // {
            //     "reference": 983.0,
            //     "feedrate": 981.0,
            //     "actual": 982.0,
            //     "date": '26/10/2021'
            // }
            // ]

            formatSpecificFccuConsumptionData(failData);
        })
}

function formatSpecificFccuConsumptionData(data,Difference_In_Days) {
    var chartData = { feedrate: [], reference: [], actual: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const PPOverDate = new Date(element.date);
        chartData.feedrate.push({ y: element.feedrate, x:PPOverDate });
        chartData.reference.push({ y: element.reference, x:PPOverDate });
        chartData.actual.push({ y: element.actual, x:PPOverDate });
    }
    console.log("Fccuchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }  
    showSpecificppConsumptionChart(chartData ,Difference_In_Days ,interval);
}

function showSpecificppConsumptionChart(data ,Difference_In_Days ,interval) {
    var chart = new CanvasJS.Chart("ppOverallsecgraph", {
        
        height: 268,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip:{
            shared: true 
        },
        axisX: {
            gridColor: "gray",
            tickLength: 0,
            gridThickness: 0,
            labelFontColor: "#d9d9d9",
            intervalType:Difference_In_Days == true?  "hour":"day",
            valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
            //valueFormatString: "DD MMM" ,
          title:Difference_In_Days == true?  "In hours":" In Days",
           interval: interval,
            labelFontSize: 10,
            gridDashType: "dot",
            lineThickness: 0,
        },
        dataPointWidth: 25,
        axisY: {         
            title: "TOE/MT of Product", 
            gridColor: "gray",
            gridDashType: "dot",
            gridThickness: 1,
            labelFontColor: "#d9d9d9",
        },
        axisY2: {   
            title: "Plant Load(%)",          
            gridThickness: 0,
            labelFontColor: "#d9d9d9"
        },
        data: [{
            type: "column",
            color: "#0796CC",
            name: "Plant Load",               
            axisYType: "secondary",
            dataPoints: data.feedrate
        },
        {
            type: "line",
            color: "#FFC100",
            name: "Reference",
            markerSize: 0,
            lineThickness: 2,
            dataPoints: data.reference
        },
        {
            type: "line",
            color: "#ED7E31",
            name: "Actual",
            markerSize: 0,
            lineThickness: 2,
            dataPoints: data.actual
        }

        ]
    });

    chart.render();
}