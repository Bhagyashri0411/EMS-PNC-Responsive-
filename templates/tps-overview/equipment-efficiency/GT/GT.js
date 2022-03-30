$(document).ready(function () {
  GasTable();

  $("#gtr1").on('change', function () {
    demo1 = ($(this).find(":selected").val());
    $("#gtvalue").html(demo1);
    getSpecificGTBarData();
  });

  // loadlineGT();
  $("input[name=fromGT]").on('change', function () {
    document.getElementById("toGT").min = $("#fromGT").val();
    getSpecificGTData();
  });

  $("input[name=toGT]").on('change', function () {
    document.getElementById("fromGT").max = $("#toGT").val();
    getSpecificGTData();
  });

  $("input[name=fromGTBar]").on('change', function (event) {
    document.getElementById("togtBar").min = $("#fromgtBar").val();
    getSpecificGTBarData();
  });

  $("input[name=toGTBar]").on('change', function (event) {
    document.getElementById("fromgtBar").max = $("#togtBar").val();
    getSpecificGTBarData();
  });

  const d = new Date(sessionStorage.getItem("lastUpdateddate"));
  d.setHours(-05);
  d.setMinutes(00);
  d.setSeconds(0);
  $('#fromgtBar').val(d.toJSON().slice(0, 19));
  $('#fromGT').val(d.toJSON().slice(0, 19));
  const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
  tod.setHours(18);
  tod.setSeconds(59);
  tod.setSeconds(0);
  $('#togtBar').val(tod.toJSON().slice(0, 19));
  $('#toGT').val(tod.toJSON().slice(0, 19));
  getSpecificGTBarData();
  getSpecificGTData();

  document.getElementById("toGT").min = $("#fromGT").val();
  document.getElementById("fromGT").max = $("#toGT").val();

  document.getElementById("togtBar").min = $("#fromgtBar").val();
  document.getElementById("fromgtBar").max = $("#togtBar").val();

});
function getSpecificGTBarData() {
  var myJSON = { 'fromdate': $('#fromgtBar').val(), 'todate': $('#togtBar').val(), tagname: $('#gtr1 option:selected').val() };
  const postdata = JSON.stringify(myJSON);
  console.log(postdata);
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
    },
    method: "POST",
    data: postdata,
    url: "http://localhost:8090/EmsPNC/EquipmentEfficiency/GTbargraph",
  }).done(function (data) {
    console.log(data)
    var Difference_In_Days = data[0].showNumberIndex;
    var chartData = { actual: [], design: [] };
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var count = data.length;
      const gtDate = new Date(element.date);
      chartData.actual.push({ y: element.actual, x: gtDate });
      chartData.design.push({ y: element.design, x: gtDate });

    }
    console.log("STchartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count / 10 > 1) {
        interval = Math.round(count / 10);
      } else {
        interval = 1;
      }
    }
    showSpecificGTBarChart(chartData, Difference_In_Days, interval);
  })
}

function showSpecificGTBarChart(data, Difference_In_Days, interval) {
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
      intervalType: Difference_In_Days == true ? "hour" : "day",
      valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
      title: Difference_In_Days == true ? "In hours" : " In Days",
      interval: interval,
      labelFontColor: "#d9d9d9",
      // labelFontSize: 15,
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
      dataPoints: data.actual
    },
    {
      type: "line",
      lineThickness: 2,
      color: "#ffc000",
      name: "Design",
      markerSize: 0,
      yValueFormatString: "0.00#",
      dataPoints: data.design
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
      "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
    },
    method: "POST",
    data: postdata,
    url: "http://localhost:8090/EmsPNC/EquipmentEfficiency/GTlinegraph",
  }).done(function (data) {
    console.log(data)
    var Difference_In_Days = data[0].showNumberIndex;
    var chartData = { GT3: [], GT4: [], GT1: [], GT2: [], GT5: [] };
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var count = data.length;
      const gt1Date = new Date(element.date);
      chartData.GT3.push({ y: element.gt3, x: gt1Date });
      chartData.GT4.push({ y: element.gt4, x: gt1Date });
      chartData.GT1.push({ y: element.gt1, x: gt1Date });
      chartData.GT2.push({ y: element.gt2, x: gt1Date });
      chartData.GT5.push({ y: element.gt5, x: gt1Date });
    }
    console.log("GTdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count / 8 > 1) {
        interval = Math.round(count / 8);
      } else {
        interval = 1;
      }

    }
    showSpecificGTChart(chartData, Difference_In_Days, interval);
  })
}

function showSpecificGTChart(data, Difference_In_Days, interval) {
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
      intervalType: Difference_In_Days == true ? "hour" : "day",
      valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
      title: Difference_In_Days == true ? "In hours" : " In Days",
      interval: interval,
      labelFontColor: "#d9d9d9",
      // labelFontSize: 15,
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
    url: "http://localhost:8090/EmsPNC/EquipmentEfficiency/GTTable",
    method: "GET"
  }).done(function (data) {
    var table_data = '';
    $.each(data, function (key, value) {

      table_data += '<tr>';
      table_data += '<td>' + value.GasTurbineID + '</td>';
      table_data += '<td>' + value.STATUS + '</td>';
      table_data += '<td>' + value.CapacityUtilizationDesign.toFixed(2) + '</td>';
      table_data += '<td>' + value.CapacityUtilizationActual.toFixed(2) + '</td>';
      table_data += '<td>' + value.DutyFired.toFixed(2) + '</td>';
      table_data += '<td>' + value.PowerGenerationCost.toFixed(2) + '</td>';
      table_data += '<td>' + value.HeatRateDesign.toFixed(2) + '</td>';
      table_data += '<td>' + value.HeatRateActual.toFixed(2) + '</td>';
      table_data += '<td>' + value.ExhaustTemperatureDesign.toFixed(2) + '</td>';
      table_data += '<td>' + value.ExhaustTemperatureActual.toFixed(2) + '</td>';
      table_data += '</tr>';

    });
    $('#bodyGas_table').append(table_data);
  })

}