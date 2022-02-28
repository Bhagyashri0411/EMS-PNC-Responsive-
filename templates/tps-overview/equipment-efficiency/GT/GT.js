$(document).ready(function () {
  GasTable();

  // loadlineGT();
  $("input[name=fromGT]").on('change',function (event) {
    console.log("from", event.target.value);
    getSpecificGTData();
  });

  $("input[name=toGT]").on('change',function (event) {
    console.log(event.target.value);
    getSpecificGTData();
  });
  

  $("#gtr1").on('change', function () {
    demo1=( $(this).find(":selected").val() );
    getSpecificGTBarData();
    
    let domLebal1=( $(this).find(":selected").val());
    console.log('tag1', demo1);
    $("#first_GT").html(domLebal1);
    console.log($(this).find(":selected").val());
});
  $("input[name=fromGTBar]").on('change',function (event) {
    // console.log($('["#gtr1"]:selected').val());
    getSpecificGTBarData();
});
   
 

$("input[name=toGTBar]").on('change',function (event) {
  // console.log($('["#gtr1"]:selected').val());
  getSpecificGTBarData();
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
           d.setSeconds(0);
        
$('#fromgtBar').val(d.toJSON().slice(0,19));
$('#fromGT').val(d.toJSON().slice(0,19));
const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
           tod.setHours(29);
           tod.setMinutes(29);
           tod.setSeconds(0);
$('#togtBar').val(tod.toJSON().slice(0,19));
$('#toGT').val(tod.toJSON().slice(0,19));
getSpecificGTBarData();
getSpecificGTData();



});
function getSpecificGTBarData() {
  var myJSON = { 'fromdate': $('#fromgtBar').val(), 'todate': $('#togtBar').val(),tagname: $('#gtr1 option:selected').val()};
  const postdata = JSON.stringify(myJSON);
  console.log(postdata);
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
      method: "POST",
      data: postdata,
      url: "http://localhost:8080/EquipmentEfficiency/GTbargraph",
  }).done(function (data) {
      console.log(data)
      var Difference_In_Days = data[0].showNumberIndex;
      formatSpecificGTBarData(data ,Difference_In_Days);
  })
      .fail(function () {
        var failData = []
          
          formatSpecificGTBarData(failData);
      })
}


function formatSpecificGTBarData(data ,Difference_In_Days) {
  var chartData = { Actual: [], Design: [] };
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    var count = data.length;
    const gtDate = new Date(element.date);
      chartData.Actual.push({ y: element.actual ,x:gtDate });
      chartData.Design.push({ y: element.design,x:gtDate });       
    
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
  showSpecificGTBarChart(chartData,Difference_In_Days,interval);
}

function showSpecificGTBarChart(data,interval,Difference_In_Days) {
  var chart = new CanvasJS.Chart("chartContainerGT", {
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

function getSpecificGTData() {
  var myJSON = { 'fromdate': $('#fromGT').val(), 'todate': $('#toGT').val() };
  const postdata = JSON.stringify(myJSON);
  console.log(postdata);
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
    method: "POST",
    data: postdata,
    url: "http://localhost:8080/EquipmentEfficiency/GTlinegraph",
  }).done(function (data) {
    console.log(data)
    var Difference_In_Days1 = data[0].showNumberIndex;
    formatSpecificGTData(data,Difference_In_Days1);
  })
    .fail(function () {
      var failData = []
     
      formatSpecificGTData(failData);
    })
}

function formatSpecificGTData(data ,Difference_In_Days1) {
  var chartData = { GT3: [], GT4: [], GT1: [], GT2: [], GT5: [] };
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    var count = data.length;
        const gt1Date = new Date(element.date);
    chartData.GT3.push({ y: element.gt3,x:gt1Date });
    chartData.GT4.push({ y: element.gt4,x:gt1Date });
    chartData.GT1.push({ y: element.gt1,x:gt1Date });
    chartData.GT2.push({ y: element.gt2,x:gt1Date });
    chartData.GT5.push({ y: element.gt5,x:gt1Date });
  }
  console.log("GTdata", chartData);
  var interval1 = 1;
  if (!Difference_In_Days1) {
    if (count/8 > 1) {
       interval1 =Math.round(count/8);
    }else{
      interval1 = 1;
    }
   
  }
  showSpecificGTChart(chartData ,Difference_In_Days1 ,interval1);
}


function showSpecificGTChart(data ,Difference_In_Days1 ,interval1) {
  var chart = new CanvasJS.Chart("GT-line", {
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
      intervalType:Difference_In_Days1 == true?  "hour":"day",
            valueFormatString:Difference_In_Days1 == true?  "HH":"DD MMM YYYY" ,
            title:Difference_In_Days1 == true?  "In hours":" In Days",
           interval: interval1,
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
      name: "GT1",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.GT1
    },
    {
      type: "line",
      lineThickness: 2,
      color: "#D945B4",
      name: "GT2",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.GT2
    },
    {
      type: "line",
      lineThickness: 2,
      color: "#FFA700",
      name: "GT3",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.GT3
    },
    {
      type: "line",
      lineThickness: 2,
      color: "#0896CC",
      name: "GT4",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.GT4
    }
      ,
    {
      type: "line",
      lineThickness: 2,
      color: "#08cc12",
      name: "GT5",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.GT5
    }
    ]
  });
  chart.render();
}
//table
function GasTable() {
  $.ajax({
    url: "http://localhost:8080/EquipmentEfficiency/GTTable",
    method: "GET"
  }).done(function (data) {
    loadGasTable(data);
  })
  // .fail(function () {
  //   var failData = [
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT1",
  //       "CapacityUtilisationDesign": 80.0,
  //       "CapacityUtilisationActual": 80.0,
  //       "ExhaustTemperatureDesign": 80.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 80.0,
  //       "DutyFired": 80.0,
  //       "HeatRateDesign": 80.0,
  //       "HeatRateActual": 80.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT2",
  //       "CapacityUtilisationDesign": 60.0,
  //       "CapacityUtilisationActual": 60.0,
  //       "ExhaustTemperatureDesign": 60.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 60.0,
  //       "DutyFired": 60.0,
  //       "HeatRateDesign": 60.0,
  //       "HeatRateActual": 60.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT3",
  //       "CapacityUtilisationDesign": 70.0,
  //       "CapacityUtilisationActual": 70.0,
  //       "ExhaustTemperatureDesign": 70.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 70.0,
  //       "DutyFired": 70.0,
  //       "HeatRateDesign": 70.0,
  //       "HeatRateActual": 70.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT4",
  //       "CapacityUtilisationDesign": 90.0,
  //       "CapacityUtilisationActual": 90.0,
  //       "ExhaustTemperatureDesign": 90.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 90.0,
  //       "DutyFired": 90.0,
  //       "HeatRateDesign": 90.0,
  //       "HeatRateActual": 90.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT1",
  //       "CapacityUtilisationDesign": 80.0,
  //       "CapacityUtilisationActual": 80.0,
  //       "ExhaustTemperatureDesign": 80.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 80.0,
  //       "DutyFired": 80.0,
  //       "HeatRateDesign": 80.0,
  //       "HeatRateActual": 80.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT2",
  //       "CapacityUtilisationDesign": 60.0,
  //       "CapacityUtilisationActual": 60.0,
  //       "ExhaustTemperatureDesign": 60.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 60.0,
  //       "DutyFired": 60.0,
  //       "HeatRateDesign": 60.0,
  //       "HeatRateActual": 60.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT3",
  //       "CapacityUtilisationDesign": 70.0,
  //       "CapacityUtilisationActual": 70.0,
  //       "ExhaustTemperatureDesign": 70.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 70.0,
  //       "DutyFired": 70.0,
  //       "HeatRateDesign": 70.0,
  //       "HeatRateActual": 70.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT4",
  //       "CapacityUtilisationDesign": 90.0,
  //       "CapacityUtilisationActual": 90.0,
  //       "ExhaustTemperatureDesign": 90.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 90.0,
  //       "DutyFired": 90.0,
  //       "HeatRateDesign": 90.0,
  //       "HeatRateActual": 90.0
  //     },
  //     {
  //       "Status": "ON",
  //       "GasTurbineID": "GT5",
  //       "CapacityUtilisationDesign": 90.0,
  //       "CapacityUtilisationActual": 90.0,
  //       "ExhaustTemperatureDesign": 90.0,
  //       "PowerGenerationCost": 62.0,
  //       "ExhaustTemperatureActual": 90.0,
  //       "DutyFired": 90.0,
  //       "HeatRateDesign": 90.0,
  //       "HeatRateActual": 90.0
  //     }]
       
  //     loadGasTable(failData);
  //   })
}
function loadGasTable(data) {
  var table_data = '';
  $.each(data, function (key, value) {

    table_data += '<tr>';

 
    table_data += '<td>' + value.GasTurbineID + '</td>';
    table_data += '<td>' + value.STATUS + '</td>';
    table_data += '<td>' + value.CapacityUtilizationDesign + '</td>';
    table_data += '<td>' + value.CapacityUtilizationActual + '</td>';
    table_data += '<td>' + value.DutyFired + '</td>';
    table_data += '<td>' + value.PowerGenerationCost + '</td>';
    table_data += '<td>' + value.HeatRateDesign + '</td>';
    table_data += '<td>' + value.HeatRateActual + '</td>';
    table_data += '<td>' + value.ExhaustTemperatureDesign + '</td>';
    table_data += '<td>' + value.ExhaustTemperatureActual + '</td>';
    table_data += '</tr>';

  });
  $('#bodyGas_table').append(table_data);

}



