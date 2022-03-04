$(document).ready(function () {
    getCardValue1();
    getCardValue2();
    // getCardValue3();
    getCardValue4();
    getCardValue5();
    getCardValue6();
    getCardValue7();
    getCardValue8();
    getCardValue9();
    tpsTable();

    $("input[name=from]").on('change', function (event) {
        
        document.getElementById("tps1").min = $('#fromcpp').val();
        getTotalGenerationCostData();
    });
    $("input[name=tps]").on('change', function (event) {
        
        document.getElementById("fromcpp").min = $('#tps1').val();
        getTotalGenerationCostData();
    });
    $("input[name=cpp-tps]").click(function (event) {

        getTotalGenerationCostData();
    });
  
    var now = new Date();
    const d = new Date(sessionStorage.getItem("lastUpdateddate"));
    d.setHours(05);
    d.setMinutes(30);
    d.setSeconds(0);
    $('#fromcpp').val(d.toJSON().slice(0, 19));
    const tod = new Date(sessionStorage.getItem("lastUpdateddate"));
    tod.setHours(29);
    tod.setMinutes(29);
    tod.setSeconds(0);
    $('#tps1').val(tod.toJSON().slice(0, 19));
    document.getElementById("tps1").min = $('#fromcpp').val();
    document.getElementById("fromcpp").max = $('#tps1').val();
    console.log(d, 'daa');
    console.log(new Date(d.toJSON()), 'JSON');

    getTotalGenerationCostData();
});

function getCardValue1() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/totalPowerGenerated",

    }).done(function (data) {
        document.getElementById('TPC').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('TPGR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES1').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES1').innerHTML = data[0]['currentvalue'].toFixed(2);
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });

    })
}
function getCardValue2() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/SpecificFuelConsumtion",

    }).done(function (data) {

        document.getElementById('SFC').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('SFCR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES2').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES2').innerHTML = data[0]['currentvalue'].toFixed(2);
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });


    })
}
function getCardValue3() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/specificWater",

    }).done(function (data) {
        document.getElementById('SW').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('SWR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES3').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES3').innerHTML = data[0]['currentvalue'].toFixed(2);
        }

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}
function getCardValue4() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/specificSteam",

    }).done(function (data) {

        document.getElementById('SS').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('SSR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES4').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES4').innerHTML = data[0]['currentvalue'].toFixed(2);
        }

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}
function getCardValue5() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/optimumPowerGeneration",

    }).done(function (data) {

        document.getElementById('OPGC').innerHTML = data[0]['tagvalue'].toFixed(2);

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}
function getCardValue6() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/CPPPowerGenerationCost",

    }).done(function (data) {
        document.getElementById('CPGC').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('CPGCR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES5').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES5').innerHTML = data[0]['currentvalue'].toFixed(2);
        }

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}
function getCardValue7() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/totalSteamGenerated",

    }).done(function (data) {
        document.getElementById('TSG').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('TSGR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES6').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES6').innerHTML = data[0]['currentvalue'].toFixed(2);
        }

        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}
function getCardValue8() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/overallEfficiency",

    }).done(function (data) {
        document.getElementById('OE').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('OER').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES7').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES7').innerHTML = data[0]['currentvalue'].toFixed(2);
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });


    })
}
function getCardValue9() {

    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "GET",
        url: "http://localhost:8090/auth/tpsoverview/grossHeatRate",

    }).done(function (data) {
        document.getElementById('GHR').innerHTML = data[0]['tagvalue'].toFixed(2);
        document.getElementById('GHRR').innerHTML = data[0]['refvalue'].toFixed(2);
        if (data[0]['currentvalue'] > 0) {
            document.getElementById('RES8').innerHTML = "+" + data[0]['currentvalue'].toFixed(2);
        }
        else{
            document.getElementById('RES8').innerHTML = data[0]['currentvalue'].toFixed(2);
        }
        $(".result").each(function () {
            var text = $(this).text();
            if (/[+-]?\d+(\.\d+)?/.test(text)) {
                var num = parseFloat(text);
                if (num < 0) {
                    $(this).addClass("red");
                } else if (num >= 0) {
                    $(this).addClass("green");
                }

            }
        });



    })
}



function getTotalGenerationCostData() {
    var postdata = JSON.stringify({ 'fromdate': $('#fromcpp').val(), "tagname": $('input[name="cpp-tps"]:checked').val(), "todate": $('#tps1').val() });
    console.log(postdata);
    $.ajax({
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("tokenType") + " " + sessionStorage.getItem("accessToken"),
        },
        method: "POST",
        data: postdata,

        url: "http://localhost:8090/auth/tpsoverview/fuelOilConsumptionGraph",

    }).done(function (data) {
        var Difference_In_Days1 = data[0].showNumberIndex;
        formatTotalGenCostData(data, Difference_In_Days1);
        // formatTotalGenCostData(data, intervalType);
    })
        .fail(function () {
            var failData = []
            formatTotalGenCostData(failData);
        })
}

function formatTotalGenCostData(data, Difference_In_Days) {
    // console.log(data,'data total generation');
    var chartData = { Actual: [], Optimized: [] };
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        var count = data.length;
        const tmpDate = new Date(element.date);
        //console.log(tmpDate,'date new');
        chartData.Optimized.push({ y: element.design ,x: tmpDate });
        chartData.Actual.push({ y: element.actual ,x: tmpDate });
        // chartData.Optimized.push({ x: tmpDate});
        // chartData.Actual.push({ x: tmpDate });
    }
    console.log(chartData , 'blob');
    var interval = 1;
    if (!Difference_In_Days) {
      if (count/8 > 1) {
         interval =Math.round(count/8);
      }else{
        interval = 1;
      }
     
    }
    showTotalGenerationCostChart(chartData, Difference_In_Days, interval);

}

function showTotalGenerationCostChart(data,Difference_In_Days ,interval) {
console.log(data,"jkljclkdjocj");
    var chart = new CanvasJS.Chart("cpp-tsp-barchart", {
        animationEnabled: true,
         theme: "dark1",
        backgroundColor: "#26293c",
        height: 320,
        title: {
            text: ""
        },
        toolTip: {
            shared: true  //disable here. 
        },
        
        dataPointMaxWidth: 20,
        axisX: {
            labelFontColor: "#d9d9d9",
            lineColor: "gray",
            tickThickness: 0,
            intervalType:Difference_In_Days == true?  "hour":"day",
            valueFormatString:Difference_In_Days == true?  "HH":"DD MMM YYYY" ,
             //valueFormatString: "DD MMM" ,
             title:Difference_In_Days == true?  "In hours":" In Days",
             interval: interval,
            labelAngle: -20
        },
        axisY: {
            labelFontColor: "#d9d9d9",
            gridColor: "#d9d9d9",
            gridThickness: 1,
            gridDashType: "dot",
            lineColor: "gray",
        },
        data: [{
            type: "column",
            name: "Actual",
            color: "#0895cc",
            dataPoints: data.Actual
        },
        {
            type: "column",
            name: "Design",

            color: "#ffc000",
            dataPoints: data.Optimized
        },
        ]
    });
    chart.render();
}


//table

function tpsTable() {
    $.ajax({
      url: "http://localhost:8090/auth/tpsoverview/ParameterTable",
      method: "GET"
    }).done(function (data) {
        loadtpsTable(data) 
    })
    
  
  }
  
  function loadtpsTable(data){
    var table_data = '';
    $.each(data, function (key, value) {
  
      table_data += '<tr>';
  
      table_data += '<td>' + value.parameter + '</td>';
      table_data += '<td>' + value.actual + '</td>';
      table_data += '</tr>';
  
    });
    $('#tps_card_body').append(table_data);
  
  }

