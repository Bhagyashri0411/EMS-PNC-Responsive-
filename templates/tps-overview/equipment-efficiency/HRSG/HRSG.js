$(document).ready(function () {
    HRSGTable();
    $("input[name=FromHRSG]").on('change',function (event) {
        console.log("from", event.target.value);
        getSpecificHRSGData();
    });

    $("input[name=ToHRSG]").on('change',function (event) {
        console.log(event.target.value);
        getSpecificHRSGData();
    }); 


    $("#hrsgr1").on('change', function () {
        demo1=( $(this).find(":selected").val() );
        getSpecificHRSGBarData();
       
        let domLebal1=( $(this).find(":selected").val());
        console.log('tag1', demo1);
        $("#first_HRSG").html(domLebal1);
        console.log($(this).find(":selected").val());
    });
      $("input[name=fromHRSGBar]").on('change',function (event) {
        // console.log($('["#hrsgr1"]:selected').val());
        getSpecificHRSGBarData();
    });
       
     
    
    $("input[name=toHRSGBar]").on('change',function (event) {
    //   console.log($('["#hrsgr1"]:selected').val());
      getSpecificHRSGBarData();
    });
    
    // // setting to date
    var now = new Date();
    // var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    console.log(new Date(sessionStorage.getItem("lastUpdateddate")),'new date');
    // var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
    // var timeArray = hoursString.split(':');
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
               d.setHours(05);
               d.setMinutes(30);
               d.setSeconds(00);
            
    $('#fromhrsgBar').val(d.toJSON().slice(0,19));
    $('#fromHRSG').val(d.toJSON().slice(0,19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
               tod.setHours(29);
               tod.setMinutes(29);
               tod.setSeconds(0);
    $('#tohrsgBar').val(tod.toJSON().slice(0,19));
    $('#toHRSG').val(tod.toJSON().slice(0,19));
    getSpecificHRSGBarData();
    getSpecificHRSGData();

});
function getSpecificHRSGBarData() {
    var myJSON = { 'fromdate': $('#fromhrsgBar').val(), 'todate': $('#tohrsgBar').val(),tagname: $('#hrsgr1 option:selected').val()};
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/HrsgEfficiency",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificHRSGBarData(data ,Difference_In_Days);
    })
        .fail(function () {
            var failData = []
            // var failData = [{
               
            //     "ST01": 73.0,
            //     "ST02": 95.0,
            // },
            // {
               
            //     "ST01": 77.0,
            //     "ST02": 94.0,
            // },
            // {
               
            //     "ST01": 89.0,
            //     "ST02": 91.0,
            // },
            // {
               
            //     "ST01": 79.0,
            //     "ST02": 96.0,
            // },
            // {
               
            //     "ST01": 76.0,
            //     "ST02": 96.0,
            // },
            // {
                
            //     "ST01": 77.0,
            //     "ST02": 93.0,
            // },
            // {
              
            //     "ST01": 99.0,
            //     "ST02": 96.0,
            // },
            // {
                
            //     "ST01": 85.0,
            //     "ST02": 95.0,
            // },
            // {
              
            //     "ST01": 88.0,
            //     "ST02": 66.0,
            // },
            // {
               
            //     "ST01": 87.0,
            //     "ST02": 69.0,
            // },
            // {
               
            //     "ST01": 75.0,
            //     "ST02": 67.0,
            // }
            // ]
            formatSpecificHRSGBarData(failData);
        })
  }
  
  
  function formatSpecificHRSGBarData(data ,Difference_In_Days) {
    var chartData = { Actual: [], Design: []};
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const hrsgDate = new Date(element.date);
        chartData.Actual.push({ y: element.actual ,x:hrsgDate });
        chartData.Design.push({ y: element.design ,x:hrsgDate });      
      
    }
    console.log("STchartdata", chartData);
    var interval = 1;
  if (!Difference_In_Days) {
    if (count/10 > 1) {
       interval =Math.round(count/10);
    }else{
      interval = 1;
    }
}
    showSpecificHRSGBarChart(chartData ,Difference_In_Days ,interval);
  }
  
  function showSpecificHRSGBarChart(data ,Difference_In_Days ,interval) {
    var chart = new CanvasJS.Chart("chartContainerHRSG", {
        height: 230,
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
            title:Difference_In_Days == true?  "In hours":" In Days",
            interval: interval,
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
          lineThickness: 2,
          color: "#0895cc",
          name: "Actual",
          markerSize: 0,
          yValueFormatString: "0.00#",
          dataPoints: data.Actual
      },
      {
          type: "line",
          lineThickness: 2,
          color: "#ffc000",
          name: "Design",
          markerSize: 0,
          yValueFormatString: "0.00#",
          dataPoints: data.Design
      }
    ]
    });
    chart.render();
  }

//line

function getSpecificHRSGData() {
   

    var hrsgData = { 'fromdate': $('#fromHRSG').val(), 'todate': $('#toHRSG').val() };
    const postdata = JSON.stringify(hrsgData);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/SteamGenerated",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data.showNumberIndex;
        console.log(Difference_In_Days,'gjhghgh');
        formatSpecificHRSGData(data ,Difference_In_Days);
    })
        .fail(function () {
           var failData=[]
            formatSpecificHRSGData(failData);
        })
}


function formatSpecificHRSGData(data ,Difference_In_Days) {
    var chartData = { hrsg3: [], hrsg4: [], hrsg1: [], hrsg2: [], hrsg5: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const hrsg1Date = new Date(element.date);
        chartData.hrsg3.push({ y: element.hrsg3 ,x:hrsg1Date });
        chartData.hrsg4.push({ y: element.hrsg4 ,x:hrsg1Date });
        chartData.hrsg1.push({ y: element.hrsg1 ,x:hrsg1Date });
        chartData.hrsg2.push({ y: element.hrsg2 ,x:hrsg1Date });
        chartData.hrsg5.push({ y: element.hrsg5 ,x:hrsg1Date });
    }
    console.log("HRSGchartdata", chartData);
    var interval= 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showSpecificHRSGChart(chartData ,Difference_In_Days ,interval);
}

function showSpecificHRSGChart(data ,Difference_In_Days,interval) {
    var chart = new CanvasJS.Chart("HRSG-line", {

        height: 230,
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
            title:Difference_In_Days == true?  "In hours":"In Days",
           interval: interval,
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
            lineThickness: 2,
            color: "#C55B11",
            name: "HRSG01",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg1
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#D945B4",
            name: "HRSG02",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg2
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#FFA700",
            name: "HRSG03",
            markerSize: 0,
            yValueFormatHRSGring: "0.00#",
            dataPoints: data.hrsg3
        },
        {
            type: "line",
            lineThickness: 2,
            color: "#0896CC",
            name: "HRSG04",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.hrsg4
        }, {
            type: "line",
            lineThickness: 2,
            color: "#00bc55",
            name: "HRSG05",
            markerSize: 0,
            yValueFormatString: "0.00#",
            dataPoints: data.hrsg5
        }
        ]
    });
    chart.render();
}


//table
function HRSGTable() {
    $.ajax({
        url: "http://localhost:8090/EmsPNC/auth/equipmentefficiencyHRSG/HrsgTable",
        method: "GET"
    }).done(function (data) {
        loadHRSGTable(data);

    })
    .fail(function () {
        var failData = [{
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        { 
            "status": "ON",
        "GENERATION_COST":51,
        "hrsgid": "HRSG5",
        "auxfuelDuty": 90.0,
        "exhaustTemperatureActual": 90.0,
        "flowRateActualMT": 90.0,
        "flowRateActualSRFT": 90.0,
        "fuelRatioActual": 90.0,
        "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        },
        {
            "status": "ON",
            "GENERATION_COST":51,
            "hrsgid": "HRSG5",
            "auxfuelDuty": 90.0,
            "exhaustTemperatureActual": 90.0,
            "flowRateActualMT": 90.0,
            "flowRateActualSRFT": 90.0,
            "fuelRatioActual": 90.0,
            "fuelRatioDesign": 90.0
        }]
        loadHRSGTable(failData);
    })
}

function loadHRSGTable(data) {
    var table_data = '';
    console.log(data)
    $.each(data, function (key, value) {

        table_data += '<tr>';

        
        table_data += '<td>' + value.hrsgid + '</td>';
        table_data += '<td>' + value.Status + '</td>';
        table_data += '<td>' + value.GENERATION_COST + '</td>';
        table_data += '<td>' + value.auxfuelDuty + '</td>';
        table_data += '<td>' + value.flowRateActualMT + '</td>';
        table_data += '<td>' + value.flowRateActualSRFT+ '</td>';
        table_data += '<td>' + value.fuelRatioDesign + '</td>';
        table_data += '<td>' + value.fuelRatioActual + '</td>';
        table_data += '<td>' + value.exhaustTemperatureDesign + '</td>';
        table_data += '<td>' + value.exhaustTemperatureActual + '</td>';
        table_data += '</tr>';

    });
    $('#bodyHRSG_table').append(table_data);


}