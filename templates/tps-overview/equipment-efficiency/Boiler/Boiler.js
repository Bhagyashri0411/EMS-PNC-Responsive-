$(document).ready(function () {
 
  getSteamFuelConsumedData();
 
  BoilerTable();
  $("#r1").on('change', function () {
    getSpecificBOILERData();
    let domLebal1=( $(this).find(":selected").val());
    $("#first_Boiler").html(domLebal1);
});
  $("input[name=fromBoiler]").on('change',function (event) {
    // console.log($('["#r1"]:selected').val());
    getSpecificBOILERData();
});
   
 

$("input[name=toBoiler]").on('change',function (event) {
  // console.log($('["#r1"]:selected').val());
  getSpecificBOILERData();
});

// // setting to date
// var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
console.log(new Date(sessionStorage.getItem("lastUpdateddate")),'new date');
var hoursString = sessionStorage.getItem("lastUpdateddate").split(' ')[1];
const d = new Date(sessionStorage.getItem("lastUpdateddate"));
           d.setHours(05);
           d.setMinutes(30);
           d.setSeconds(0);
        
$('#fromboiler').val(d.toJSON().slice(0,19));
const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
           tod.setHours(29);
           tod.setMinutes(29);
           tod.setSeconds(0);
$('#toboiler').val(tod.toJSON().slice(0,19));
getSpecificBOILERData();

});
function getSpecificBOILERData() {
  var myJSON = { 'fromdate': $('#fromboiler').val(), 'todate': $('#toboiler').val(),tagname: $('#r1 option:selected').val()};
  const postdata = JSON.stringify(myJSON);
  
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
      method: "POST",
      data: postdata,
     
      url: "http://localhost:8090/EMSPro/tpsBoiler/boilerEfficencyBarGraph",
  }).done(function (data) {
    var Difference_In_Days = data[0].showNumberIndex;
      formatSpecificBOILERData(data ,Difference_In_Days);
  })
      .fail(function () {
        var failData = []
        
          formatSpecificBOILERData(failData);
      })
}


function formatSpecificBOILERData(data,Difference_In_Days) {
  var chartData = { Actual: [], Design: [] };
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var count = data.length;
      const boilerDate = new Date(element.date);
      chartData.Actual.push({ y: element.actual,x:boilerDate });
      chartData.Design.push({ y: element.design,x:boilerDate });       
    
  }
  console.log(count,'count');
  console.log("STchartdata", chartData);
  var interval = 1;
  if (!Difference_In_Days) {
    if (count/8 > 1) {
       interval =Math.round(count/8);
    }else{
      interval = 1;
    }
   
  }
  showSpecificBOILERChart(chartData ,Difference_In_Days, interval);
}

function showSpecificBOILERChart(data ,Difference_In_Days ,interval) {
  console.log('kjkj');
  var chart = new CanvasJS.Chart("chartContainerBoiler", {
      height: 230,
      theme: "dark1",
      backgroundColor: "#26293c",
      title: {
          text: ""
      },
      toolTip: {
        shared: true  //disable here. 
      },
      axisX: {
        labelFontColor: "#d9d9d9",
        lineColor: "gray",
        tickThickness: 0,
         intervalType:Difference_In_Days == true?  "hour":"day",
         valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
        interval: interval,
        labelAngle: -20
         
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

//three bar
function getSteamFuelConsumedData() {
  $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
    method: "GET",
    url: "http://192.168.1.116:8080/tpsBoiler/fuelConsumedBarGraph",

  }).done(function (data) {

    formatSteamFuelConsumedData(data);
  })
    .fail(function () {
      var failData=[]
      
      formatSteamFuelConsumedData(failData);

    })
}
function formatSteamFuelConsumedData(data) {
  var chartData = { RLNG: [],BFO: [], OFF_Gas:[],HSD:[]  };
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    chartData.RLNG.push({ y: element.RLNG, label: element.BoilerID });
    chartData.BFO.push({ y: element.BFO, label: element.BoilerID });
    chartData.OFF_Gas.push({ y: element.OFF_Gas, label: element.BoilerID });
    chartData.HSD.push({ y: element.HSD, label: element.BoilerID });
  }
  Fuelconsumed(chartData);

}

function Fuelconsumed(data) {
  console.log(data,"hhhh");
  var chart = new CanvasJS.Chart("chartBoiler2",
    {
      height: 240,
      backgroundColor: "#26293c",
      title: {
        text: ""
      },
      dataPointMaxWidth: 40,
      dataPointWidth: 50,
      legend: {
        verticalAlign: "top",  // "top" , "bottom"
        horizontalAlign: "left"
      },
      toolTip: {
        shared: true  //disable here. 
      },
      axisX: {
        gridThickness: 0,
        lineColor: "white",
        labelFontColor: "#d9d9d9",
        labelFontSize: 15,
        tickThickness: 0,

      },
      axisY: {
        gridThickness: 0,
        lineColor: "white",
        labelFontColor: "#d9d9d9",
        labelFontSize: 15,
      },
      data: [
        {
          type: "column",
          name: "RLNG",
          color: "#d38d0c  ",
          indexLabel: " {y}",
          indexLabelFontColor: "#d9d9d9",
          indexLabelFontSize: 15,
          dataPoints: data.RLNG
        },
        {
          type: "column",
          name: "BFO",
          color: "#0795cc",
          indexLabel: " {y}",
          indexLabelFontColor: "#d9d9d9",
          indexLabelFontSize: 15,
          dataPoints: data.BFO
        }, {
          type: "column",
          name: "HSD",
          color: "#d944b4  ",
          indexLabel: " {y}",
          indexLabelFontColor: "#d9d9d9",
          indexLabelFontSize: 15,
          dataPoints: data.OFF_Gas
        },
        {
          type: "column",
          name: "FO",
          color: "#a5a5a5",
          indexLabel: " {y}",
          indexLabelFontColor: "#d9d9d9",
          indexLabelFontSize: 15,
          dataPoints: data.HSD
        }


      ]
    });

  chart.render();
}

//table

function BoilerTable() {
  $.ajax({
    url: "http://192.168.1.116:8080/tpsBoiler/boilerTable",
    method: "GET"
  }).done(function (data) {
    loadBoilerTable(data) 
  })
  .fail(function () {
    var failData = [
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-1","steamgenerationcost":59, "SteamGenerated":80.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":80.0,"StackO2":80.0,"StackExitTempDesign":80.0,"StackExitTempActual":58},
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-2","steamgenerationcost":59, "SteamGenerated":60.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":60.0,"StackO2":60.0,"StackExitTempDesign":60.0,"StackExitTempActual":58},
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-3","steamgenerationcost":59, "SteamGenerated":70.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":70.0,"StackO2":70.0,"StackExitTempDesign":70.0,"StackExitTempActual":58},
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-1","steamgenerationcost":59, "SteamGenerated":80.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":80.0,"StackO2":80.0,"StackExitTempDesign":80.0,"StackExitTempActual":58},
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-2","steamgenerationcost":59, "SteamGenerated":60.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":60.0,"StackO2":60.0,"StackExitTempDesign":60.0,"StackExitTempActual":58},
    {"Status":"ON","Loading":72,"FualConsumed":96,"DutyFired":63,"BoilerID":"UB-3","steamgenerationcost":59, "SteamGenerated":70.0,"SteamtoFualRatioDesign":0.0,"SteamtoFualRatioActual":70.0,"StackO2":70.0,"StackExitTempDesign":70.0,"StackExitTempActual":58},]
   
      loadBoilerTable(failData);

  })

}

function loadBoilerTable(data){
  var table_data = '';
  $.each(data, function (key, value) {

    table_data += '<tr>';

    table_data += '<td>' + value.BoilerID + '</td>';
    table_data += '<td>' + value.Status + '</td>';
    table_data += '<td>' + value.Loading + '</td>';    
    table_data += '<td>' + value.steamgenerationcost+ '</td>';
    table_data += '<td>' + value.FualConsumed + '</td>';
    table_data += '<td>' + value.DutyFired + '</td>';
    table_data += '<td>' + value.SteamGenerated + '</td>';
    table_data += '<td>' + value.SteamtoFualRatioDesign + '</td>';
    table_data += '<td>' + value.SteamtoFualRatioActual + '</td>';
    table_data += '<td>' + value.StackO2 + '</td>';
    table_data += '<td>' + value.StackExitTempDesign + '</td>';
    table_data += '<td>' + value.StackExitTempActual + '</td>';
    table_data += '</tr>';

  });
  $('#bodyboiler_table').append(table_data);

}