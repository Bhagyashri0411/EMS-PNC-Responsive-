$(document).ready(function () {
  $("#horizontal-tiles").load(
    "./../../templates/dashboard/horizontal-tiles/horizontal-tiles.html"
  );
  $("#sec-distribution").load(
    "./../../templates/sec-distribution/sec-distribution.html"
  );
  $("input[name=fromHome]").on("change", function (event) {
    document.getElementById("homeEms1").min = $('#fromHome1').attr('label');
    getSpecificHomeConsumptionData();
  });

  $("#r1").on("change", function () {
    domLebal1 = $(this).find(":selected").attr('label');
    $("#first-box-title").html(domLebal1);
    getSpecificHomeConsumptionData();
  });

  $("#homeEms1").on("change", function () {
    document.getElementById("fromHome1").max = $('#homeEms1').val();
    getSpecificHomeConsumptionData();
  });

  totalThroughput();
  lastupdatedTime();
});
function lastupdatedTime() {
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("accessToken"),
    },
    url: "http://localhost:8090/Air/lastUpdateTimestamp",
    method: "GET",
  }).done(function (data) {
    const d = new Date(data.lastupdatetimestamp);
    sessionStorage.setItem("lastUpdateddate", d);
    const dmonth = d.getMonth() + 1;
    const setdate = String(d.getDate()).padStart(2, '0') + "-" + String(dmonth).padStart(2, '0') + "-" + d.getFullYear() + " " + String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0') + ":" + String(d.getSeconds()).padStart(2, '0');
    //alert(sessionStorage.getItem("lastUpdateddate"));
    document.getElementById("homeTime").innerHTML = setdate;
    var now = new Date();
    var fromDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 19);
    console.log(new Date(sessionStorage.getItem("lastUpdateddate")), "new date");
    // var hoursString = sessionStorage.getItem("lastUpdateddate").split(" ")[1];
    var hoursString = sessionStorage.getItem("lastUpdateddate");
    var timeArray = hoursString.split(":");
    const dateVal = new Date(sessionStorage.getItem("lastUpdateddate"));
    const dtaval = new Date();
    dateVal.setHours(05);
    dateVal.setMinutes(30);
    dateVal.setSeconds(0);
    $("#fromHome1").val(dateVal.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#homeEms1').val(tod.toJSON().slice(0, 19));
    // console.log(dateVal.toJSON().slice(0,19), "daa");
    document.getElementById("homeEms1").min = $('#fromHome1').val();
    document.getElementById("fromHome1").max = $('#homeEms1').val();
    getSpecificHomeConsumptionData("1");
  });
}

function getSpecificHomeConsumptionData(intervalType, domLebal1) {
  var myJSON = {
    fromdate: $("#fromHome1").val(),
    kpiname: $("#r1 option:selected").attr('label'),
    day: $("#homeEms1").val(),
  };
  const postdata = JSON.stringify(myJSON);
  console.log(postdata);
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("accessToken"),
    },
    method: "POST",
    data: postdata,

    url: "http://localhost:8090/home/homepagegraph",
  }).done(function (data) {
    console.log(data);
    var Difference_In_Days = data[0].showNumberIndex;
    formatSpecificHomeConsumptionData(data, intervalType, domLebal1, Difference_In_Days);
  });
}

function formatSpecificHomeConsumptionData(data, intervalType, domLebal1, Difference_In_Days) {
  var chartData = { Throughput: [], TotalEnergyConsumption: [] };
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    var count = data.length;
    const tmpDate = new Date(element.date);
    chartData.TotalEnergyConsumption.push({
      y: element.fuelConsumption, x: tmpDate
    });
    chartData.Throughput.push({ y: element.throughput, x: tmpDate });
  }
  console.log("Homechartdata", chartData);
  var interval = 1;
  if (!Difference_In_Days) {
    if (count / 8 > 1) {
      interval = Math.round(count / 8);
    } else {
      interval = 1;
    }

  }
  showSpecificHomeConsumptionChart(chartData, intervalType, domLebal1, Difference_In_Days, interval);
}
function showSpecificHomeConsumptionChart(data, intervalType, domLebal1, Difference_In_Days, interval) {
  var chart = new CanvasJS.Chart("chartContainer", {
    // height: 300 + 'vh',
    // width: '100%',
    animationEnabled: true,
    theme: "dark1",
    backgroundColor: " #26293c",
    axisX: {
      gridColor: "gray",
      gridThickness: 2,
      gridDashType: "dot",
      intervalType: Difference_In_Days == true ? "hour" : "day",
      valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
      title: Difference_In_Days == true ? "In hours" : " In Days",
      titleFontSize: 15,
      interval: interval,
      tickThickness: 0,
      lineThickness: 0,
      labelFontColor: "#d9d9d9",
      labelFontSize: 15,
      fontFamily: "Bahnschrift Light",

    },
    dataPointMaxWidth: 15,
    axisY: {
      title: $("#r1").find(":selected").val(),
      titleFontSize: 15,
      titleFontFamily: "Yu Gothic UI Semibold",
      titleFontColor: "#D9DAD9",
      gridThickness: 0,
      labelFontColor: "#d9d9d9",
      labelFontSize: 15,
      fontFamily: "Bahnschrift Light",
    },
    axisY2: {
      title: "MT/Day",
      titleFontSize: 15,
      titleFontFamily: "Yu Gothic UI Semibold",
      titleFontColor: "#D9DAD9",
      gridThickness: 0,
      labelFontColor: "#d9d9d9",
      labelFontSize: 15,
      fontFamily: "Bahnschrift Light",
    },
    toolTip: {
      shared: true  //disable here. 
    },

    data: [
      {
        type: "column",
        color: "#00b0f0",
        name: "Throughput",
        markerSize: 0,
        axisYType: "secondary",
        dataPoints: data.Throughput,
      },
      {
        type: "spline",
        color: "#dc7632",
        name: $("#r1").find(":selected").attr("label"),
        markerSize: 0,
        dataPoints: data.TotalEnergyConsumption,
      },
    ],
  });
  chart.render();
  var chartTypedata = document.getElementById("chartTypedata");
  chartTypedata.addEventListener("change", function () {
    chart.options.data[0].type = chartTypedata.options[chartTypedata.selectedIndex].value;
    chart.render();
  });

  var chartType1data = document.getElementById("chartType1data");
  chartType1data.addEventListener("change", function () {
    chart.options.data[1].type = chartType1data.options[chartType1data.selectedIndex].value;
    chart.render();
  });
}

function totalThroughput() {
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("accessToken"),
    },
    url: "http://localhost:8090/home/totalbalance",
    method: "GET",
  }).done(function (data) {
    document.getElementById("totalThroughput").innerHTML = data.totalNaphthaProcessed;
    document.getElementById("Power").innerHTML = data.cpppower;
    document.getElementById("Steam").innerHTML = data.cppsteam;
    document.getElementById("Renepower").innerHTML = data.renewablepower;
  });
}

function Truncated() {
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("accessToken"),
    },
    method: "GET",
    url: "http://localhost:8090/home/Truncate",
  }).done(function (data) {
    console.log(data);
  });
}
function csvdownload() {
  $.ajax({
    headers: {
      "Content-Type": "application/json",
      Authorization:
        sessionStorage.getItem("tokenType") +
        " " +
        sessionStorage.getItem("accessToken"),
    },
    method: "GET",
    url: "http://localhost:8090/home/Report",
  }).done(function (data) {
    console.log(data);

    const csvRows = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    console.log(data, "name");

    //console.log(csvRows, "values");

    for (const row of data) {
      csvRows.join("\n");
      var abc = "\n" + row.kpi_name + "," + row.value + "," + row.uom;
      csvRows.push(abc);
    }

    console.log(csvRows, "name");
    const blob = new Blob(csvRows, { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "download.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}