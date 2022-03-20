$(document).ready(function () {
    electricityDoughnutProgress2();
    // getElectricityStackedData();
    getStackBarvalue()
    getcardElectricity1();
    getcardElectricity2();
    getcardElectricity3();
    getcardElectricity4();
    getcardElectricity5();

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
    d.setHours(01);
    d.setMinutes(00);
    d.setSeconds(0);
    $('#fromelectricity').val(d.toJSON().slice(0, 19));
    console.log(d, 'daa');
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(18);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#toelectricity').val(tod.toJSON().slice(0, 19));
    document.getElementById("toelectricity").min = $('#fromelectricity').val();
    document.getElementById("fromelectricity").max = $('#toelectricity').val();

    getSpecificElectricityConsumptionData();

});


function getSpecificElectricityConsumptionData() {
    var myJSON = { 'fromdate': $('#fromelectricity').val(), 'day': $('#toelectricity').val() };
    const postdata = JSON.stringify(myJSON);
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/EmsPNC/auth/electricity/SpecificElectricity",
    }).done(function (data) {
        console.log(data)
        var Difference_In_Days = data[0].showNumberIndex;
        formatSpecificElectricityConsumptionData(data, Difference_In_Days);
    })

}

function formatSpecificElectricityConsumptionData(data, Difference_In_Days) {
    var chartData = { TotalEnergyConsumption: [], Throughput: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const electricityDate = new Date(element.date);
        chartData.Throughput.push({ y: element.throughput, x: electricityDate });
        chartData.TotalEnergyConsumption.push({ y: element.fuelConsumption, x: electricityDate });
    }
    console.log("electricitychartdata", chartData);
    var interval = 1;
    if (!Difference_In_Days) {
        if (count / 8 > 1) {
            interval = Math.round(count / 8);
        } else {
            interval = 1;
        }

    }
    showSpecificEletricityConsumptionChart(chartData, Difference_In_Days, interval);
}

function showSpecificEletricityConsumptionChart(data, Difference_In_Days, interval) {
    var chart = new CanvasJS.Chart("PNCelectricityLine", {
        // height: 450,
        animationEnabled: true,
        theme: "dark1",
        backgroundColor: " #26293c",
        toolTip: {
            shared: true
        },
        axisX: {
            labelFontColor: "#d9d9d9",
            lineColor: "gray",
            tickThickness: 0,
            intervalType: Difference_In_Days == true ? "hour" : "day",
            valueFormatString: Difference_In_Days == true ? "HH" : "DD MMM YYYY",
            //valueFormatString: "DD MMM" ,
            title: Difference_In_Days == true ? "In hours" : "In Days",
            interval: interval,
            labelAngle: -20,
            titleFontSize: 14,
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
            minimum: 1400,
            maximum: 2600
        },
        toolTip: {
            shared: true  //disable here. 
        },
        data: [{
            type: $("#chartType1data option:selected").val(),
            color: "#00b0f0",
            name: "Throughput",

            axisYType: "secondary",
            yValueFormatString: "0.00#",
            markerSize: 0,
            dataPoints: data.Throughput
        },
        {
            type: $("#chartTypedata option:selected").val(),
            color: "#ED7E31",
            name: "Specific Electricity Consumption",
            yValueFormatString: "0.00#",
            markerSize: 0,
            dataPoints: data.TotalEnergyConsumption
        }

        ]
    });
    chart.render();
    var chartTypedata = document.getElementById('chartTypedata');
    chartTypedata.addEventListener("change", function () {
        chart.options.data[1].type = chartTypedata.options[chartTypedata.selectedIndex].value;
        chart.render();
    });

    var chartType1data = document.getElementById('chartType1data');
    chartType1data.addEventListener("change", function () {
        chart.options.data[0].type = chartType1data.options[chartType1data.selectedIndex].value;
        chart.render();
    });
}

function electricityprogressbarchartload() {

    $.ajax({
        type: "GET",
        url: "http://localhost:8090/EmsPNC/api/energyConsumption/steamGenerationCapacity",
    }).done(function (electricityprogressvalue) {
        console.log(electricityprogressvalue);
        loadProgressChart(electricityprogressvalue);
    });
}

function electricityDoughnutProgress2() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/EmsPNC/auth/electricity/ElectricityCapacity",
    }).done(function (data) {

        loadDoughnutChartelectricityProgress2(data);
    })

}

function loadDoughnutChartelectricityProgress2(data) {

    CanvasJS.addColorSet("greenShades", [
        "#00b0f0",
        "#D9D9D9"
    ]);
    var dataPoints = [];
    var chart = new CanvasJS.Chart("doughnutChartprogresselectricity", {
        colorSet: "greenShades",
        // height: 139,
        // width: 176,
        theme: "dark1",
        backgroundColor: "#26293c",
        toolTip: {
            enabled: false,
        },
        title: {
            text: data[0].tagvalue.toFixed(2) + " %",
            //text:30,
            verticalAlign: "center",
            dockInsidePlotArea: true,
            color: "white",
            fontFamily: "Bahnschrift Light",
            // fontColor : "white"
            fontColor: data[0].colorcode == "none" ? "white" : data[0].colorcode,

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
                { y: data[0].tagvalue },
                { y: 100 - data[0].tagvalue },

            ]
        }]
    });
    chart.render();
}

function getcardElectricity1() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/auth/electricity/secelectricity',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data1");
        document.getElementById("count_ele1").innerHTML = data[0].tagvalue;
        document.getElementById("count_ele1").style.color = data[0].colorcode == "none" ? "white" : data[0].colorcode;
        document.getElementById("ref_ele1").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele1").innerHTML = '+' + data[0].currentvalue;
        }
        else {
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
        url: "http://localhost:8090/EmsPNC/auth/electricity/ElectricityTotalGeneration",
        method: "GET"
    }).done(function (data) {
        console.log(data, "data2");
        document.getElementById("count_ele2").innerHTML = data[0].tagvalue;
        document.getElementById("count_ele2").style.color = data[0].colorcode == "none" ? "white" : data[0].colorcode;
        document.getElementById("ref_ele2").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele2").innerHTML = '+' + data[0].currentvalue;
        }
        else {
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
        url: 'http://localhost:8090/EmsPNC/auth/electricity/ElectricityTotalConsumption',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data3");
        document.getElementById("count_ele3").innerHTML = data[0].tagvalue;
        document.getElementById("count_ele3").style.color = data[0].colorcode == "none" ? "white" : data[0].colorcode;
        document.getElementById("ref_ele3").innerHTML = data[0].refvalue;
        if (data[0].currentvalue > 0) {
            document.getElementById("result_ele3").innerHTML = '+' + data[0].currentvalue;
        }
        else {
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
        url: 'http://localhost:8090/EmsPNC/auth/electricity/ElectricityGenerationCost',
        method: "GET"
    }).done(function (data) {
        document.getElementById("count_ele4").innerHTML = data[0].tagvalue;
        document.getElementById("count_ele4").style.color = data[0].colorcode == "none" ? "white" : data[0].colorcode;
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

function getcardElectricity5() {
    $.ajax({
        url: 'http://localhost:8090/EmsPNC/auth/electricity/GridCost',
        method: "GET"
    }).done(function (data) {
        console.log(data, "data4");
        document.getElementById("count_ele5").innerHTML = data[0].value;
        document.getElementById("count_ele5").style.color = data[0].colorcode == "none" ? "white" : data[0].colorcode;
    });
}
var max1 = 100;
function getStackBarvalue() {
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        url: 'http://localhost:8090/EmsPNC/auth/electricity/TotalElectricity',
        method: "GET"
    }).done(function (data) {
        // var abc = (data[0].Generation / data[0].total) * 100;
        // var def = (data[0].Electricity / data[0].total) * 100;
        // var ghi = (data[0].Grid / data[0].total) * 100;
        // var jkl = (data[0].prImport / data[0].total) * 100;
        // var mno = (data[0].prExport / data[0].total) * 100;
        // var pqr = (data[0].alinExport / data[0].total) * 100;
        // var stu = (data[0].isrlExport / data[0].total) * 100;
        // var pad = (data[0].padcExport / data[0].total) * 100;
        document.getElementById("stack1").innerHTML = data[0].Generation;
        document.getElementById("stack2").innerHTML = data[0].Electricity;
        document.getElementById("stack3").innerHTML = data[0].Grid;
        document.getElementById("stack4").innerHTML = data[0].prImport;
        document.getElementById("stack5").innerHTML = data[0].prExport;
        document.getElementById("stack6").innerHTML = data[0].alinExport;
        document.getElementById("stack7").innerHTML = data[0].isrlExport;
        document.getElementById("stack8").innerHTML = data[0].padcExport;
        // document.getElementById("prog1").innerHTML = '<progress value =' + abc + ' max=' + max1 + ' data-toggle="tooltip" title=' + abc.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog2").innerHTML = '<progress value =' + def + ' max=' + max1 + ' data-toggle="tooltip" title=' + def.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog3").innerHTML = '<progress value =' + ghi + ' max=' + max1 + ' data-toggle="tooltip" title=' + ghi.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog4").innerHTML = '<progress value =' + jkl + ' max=' + max1 + ' data-toggle="tooltip" title=' + jkl.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog5").innerHTML = '<progress value =' + mno + ' max=' + max1 + ' data-toggle="tooltip" title=' + mno.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog6").innerHTML = '<progress value =' + pqr + ' max=' + max1 + ' data-toggle="tooltip" title=' + pqr.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog7").innerHTML = '<progress value =' + stu + ' max=' + max1 + ' data-toggle="tooltip" title=' + stu.toFixed(2) + '%' + '></progress>'
        // document.getElementById("prog7").innerHTML = '<progress value =' + pad + ' max=' + max1 + ' data-toggle="tooltip" title=' + pad.toFixed(2) + '%' + '></progress>'
    });
}