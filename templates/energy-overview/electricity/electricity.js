$(document).ready(function () {
    electricityDoughnutProgress2();
    getElectricityStackedData();
    
    getcardElectricity1();
    getcardElectricity2();
    getcardElectricity3();
    getcardElectricity4();

   
    $("input[name=fromelectricity]").on('change', function () {
        document.getElementById("toelectricity").min = $('#fromelectricity').val();
        getSpecificElectricityConsumptionData();
    });
    $("#toelectricity").on('change', function () {
       
        document.getElementById("fromelectricity").max = $('#toelectricity').val();
        getSpecificElectricityConsumptionData();
    });

    // // setting from date, to date - 24hrs.   
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromelectricity').val(d.toJSON().slice(0, 19));
    console.log(d, 'daa');
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toelectricity').val(tod.toJSON().slice(0,19));
    document.getElementById("toelectricity").min = $('#fromelectricity').val();
    document.getElementById("fromelectricity").max = $('#toelectricity').val();

    getSpecificElectricityConsumptionData();

});


function getSpecificElectricityConsumptionData() {
    var myJSON = { 'fromdate': $('#fromelectricity').val(), 'day':  $('#toelectricity').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,
         
        url: "http://localhost:8090/EMSPro/auth/electricity/SpecificElectricity",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificElectricityConsumptionData(data ,Difference_In_Days);
    })
  
}

function formatSpecificElectricityConsumptionData(data ,Difference_In_Days) {
    var chartData = { TotalEnergyConsumption: [], Throughput: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
      const electricityDate = new Date(element.date);
        chartData.Throughput.push({ y: element.throughput ,x:electricityDate});
        chartData.TotalEnergyConsumption.push({ y: element.fuelConsumption ,x:electricityDate});
    }
    console.log("electricitychartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showSpecificEletricityConsumptionChart(chartData ,Difference_In_Days ,interval);
}

function showSpecificEletricityConsumptionChart(data ,Difference_In_Days ,interval) {
    var chart = new CanvasJS.Chart("PNCelectricityLine", {
        // height: 450,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            gridColor: "gray",
            gridThickness: 2,
            gridDashType: "dot",
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            title:Difference_In_Days == true?  "In hours":" In Days",
            titleFontSize:15,
            interval: interval,
            tickThickness: 0,
            lineThickness: 0,
            labelFontColor: "#d9d9d9",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        }, 
        dataPointMaxWidth: 15,
        axisY: {
            title: "KWh/MT of Product",
            titleFontSize: 15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light"
        },
        axisY2: {
            title: "MT/Day",
            titleFontSize: 15,
            titleFontFamily: "Yu Gothic UI Semibold",
            titleFontColor: "#D9DAD9",
            gridThickness: 0,
            labelFontColor: "#bfbfbf",
            labelFontSize: 15,
            fontFamily: "Bahnschrift Light",
        },
        toolTip: {
            shared: true  //disable here. 
          }, 
        data: [{
            type: "column",
            color: "#00b0f0",
            name: "Specific Electricity Consumption",
            axisYType: "secondary",
            yValueFormatString: "0.00#",
            markerSize: 0,
            dataPoints: data.Throughput
        },
        {
            type: "spline",
            color: "#ED7E31",
            name: "Throughput",
            yValueFormatString: "0.00#",
            markerSize: 0,
            dataPoints: data.TotalEnergyConsumption
        }

        ]
    });
    chart.render();
    var chartTypedata = document.getElementById('chartTypedata');
    chartTypedata.addEventListener("change", function () {
        chart.options.data[0].type = chartTypedata.options[chartTypedata.selectedIndex].value;
        chart.render();
    });

    var chartType1data = document.getElementById('chartType1data');
    chartType1data.addEventListener("change", function () {
        chart.options.data[1].type = chartType1data.options[chartType1data.selectedIndex].value;
        chart.render();
    });
}

function electricityprogressbarchartload() {

    $.ajax({
        type: "GET",
        url: "http://192.168.1.113:8090/api/energyConsumption/steamGenerationCapacity",
    }).done(function (electricityprogressvalue) {
        console.log(electricityprogressvalue);
        loadProgressChart(electricityprogressvalue);
    });
}

function electricityDoughnutProgress2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType")+" "+sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EMSPro/auth/electricity/ElectricityCapacity",
    }).done(function (data) {

    loadDoughnutChartelectricityProgress2(data);
    })

}

function loadDoughnutChartelectricityProgress2(data) {
   
    CanvasJS.addColorSet("greenShades", [
        "#ffa600",
       "#D9D9D9"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("doughnutChartprogresselectricity", {
        colorSet: "greenShades",
        // height: 139,
        // width: 176,
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip:{
            enabled:false,
        },
        title: {
            text: data[0].tagvalue.toFixed(2)+" %",
            //text:30,
            verticalAlign: "center",
            dockInsidePlotArea: true,
            color: "white",
            fontFamily: "Bahnschrift Light"

        },
        axisY: {
            title: "Units",
            titleFontSize: 20,
            includeZero: true

        },
        data: [{
            type: "doughnut",
            toolTipContent: false,
            yValueFormatString: "0.00#",
            startAngle: 64,
            dataPoints: [
                { y: data[0].tagvalue},
                { y:100 - data[0].tagvalue},
                
            ]
        }]
    });
    chart.render();
}

function getcardElectricity1() {
    $.ajax({
        url: 'http://localhost:8090/EMSPro/auth/electricity/secelectricity',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data1");
        document.getElementById("count_ele1").innerHTML = data[0].tagvalue;
        document.getElementById("ref_ele1").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele1").innerHTML = '+' + data[0].currentvalue;
        }
        else{
            document.getElementById("result_ele1").innerHTML = data[0].currentvalue;
        }
        
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}
function getcardElectricity2() {
    $.ajax({
        url: "http://localhost:8090/EMSPro/auth/electricity/ElectricityCapacity",
        method: "GET"
    }).done(function (data) {
        console.log(data, "data2");
        document.getElementById("count_ele2").innerHTML = data[0].tagvalue;
        document.getElementById("ref_ele2").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele2").innerHTML = '+' + data[0].currentvalue;
        }
        else{
            document.getElementById("result_ele2").innerHTML = data[0].currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}
function getcardElectricity3() {
    $.ajax({
        url: 'http://localhost:8090/EMSPro/auth/electricity/ElectricityTotalConsumption',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data3");
        document.getElementById("count_ele3").innerHTML = data[0].tagvalue;
        document.getElementById("ref_ele3").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele3").innerHTML = '+' + data[0].currentvalue;
        }
        else{
            document.getElementById("result_ele3").innerHTML = data[0].currentvalue;
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });

}
function getcardElectricity4() {
    $.ajax({
    url: 'http://localhost:8090/EMSPro/auth/electricity/ElectricityGenerationCost',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data4");
        document.getElementById("count_ele4").innerHTML = data[0].tagvalue;
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num > 0) {
                    $(this).addClass("green");
                }

            }
        });
    });


}

function getElectricityStackedData() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8090/EMSPro/auth/electricity/TotalElectricity",

    }).done(function (data) {

        formatElectricityStackedData(data);
    })
       
}

function formatElectricityStackedData(data) {
    var chartData = { Generation: [], Electricity: [], Grid: [], Export: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        chartData.Generation.push({ y: element.Generation });

        chartData.Electricity.push({ y: element.Electricity });

        chartData.Grid.push({ y: element.Grid });

        chartData.Export.push({ y: element.Export });


    }
    stackedBar(chartData);
}

function stackedBar(data) {
    console.log(data, "tttttttttt");
    var chart = new CanvasJS.Chart("ctx",
        {
            backgroundColor: "transparent",
            color: "#d9d9d9",
            // height: 200,
            axisX: {
                gridColor: "gray",
                gridThickness: 0,
                gridDashType: "dot",
                tickThickness: 0,
                lineThickness: 0,
                labelFontColor: "#d9d9d9",
                labelFontSize: 0,
                fontFamily: "Bahnschrift Light",

            },
            dataPointWidth: 50,

            axisY: {

                titleFontSize: 15,
                tickThickness: 0,
                labelFontSize: 0,
                lineThickness: 0,
                titleFontFamily: "Yu Gothic UI Semibold",
                titleFontColor: "#D9DAD9",
                gridThickness: 0,
                indexLabelFontColor: "#d9d9d9",
                fontFamily: "Bahnschrift Light",
                "minimum": 0
            },
            data: [

                {
                    type: "stackedColumn",
                    indexLabelOrientation: "horizontal",  // "horizontal", "vertical"
                    indexLabel: " {y}%",
                    color: "#4d5463",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    dataPoints: data.Generation,

                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    color: "#00ab7e",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    dataPoints: data.Electricity,
                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    color: "#00405c",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    dataPoints: data.Grid,
                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    color: "#ffc100",
                    dataPoints: data.Export,
                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    color: "#72ad5f",
                    dataPoints: data.Grid,
                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    color: "#732278",
                    dataPoints: data.Export,
                }, {
                    type: "stackedColumn",
                    indexLabel: " {y}%",
                    indexLabelFontColor: "#d9d9d9",
                    indexLabelFontWeight: "1",
                    indexLabelFontSize: 13,
                    color: "#9f2c76",
                    dataPoints: data.Electricity,
                }
            ]
        });

    chart.render();
}